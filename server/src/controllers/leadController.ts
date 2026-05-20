import { Response, NextFunction } from 'express'
import { body } from 'express-validator'
import Lead from '../models/Lead'
import { AuthRequest, LeadStatus, LeadSource } from '../types'
import { sendSuccess, sendError, sendPaginated } from '../utils/response'

const PAGE_LIMIT = 10

// POST /api/leads
export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, status, source } = req.body as {
      name: string
      email: string
      status?: LeadStatus
      source: LeadSource
    }

    const lead = await Lead.create({
      name,
      email,
      status: status ?? 'New',
      source,
      createdBy: req.user!.id,
    })

    sendSuccess(res, lead, 'Lead created', 201)
  } catch (err) {
    next(err)
  }
}

// GET /api/leads
export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort, page } = req.query as {
      status?: LeadStatus
      source?: LeadSource
      search?: string
      sort?: 'latest' | 'oldest'
      page?: string
    }

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {}

    // RBAC: sales_user sees only their own leads
    if (req.user!.role === 'sales_user') {
      filter.createdBy = req.user!.id
    }

    if (status) filter.status = status
    if (source) filter.source = source

    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ name: regex }, { email: regex }]
    }

    const sortOrder = sort === 'oldest' ? 1 : -1
    const currentPage = Math.max(1, parseInt(page ?? '1', 10))
    const skip = (currentPage - 1) * PAGE_LIMIT

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(PAGE_LIMIT).populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ])

    sendPaginated(res, leads, {
      total,
      page: currentPage,
      limit: PAGE_LIMIT,
      totalPages: Math.ceil(total / PAGE_LIMIT),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/leads/:id
export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params['id']).populate('createdBy', 'name email')

    if (!lead) {
      sendError(res, 'Lead not found', 404)
      return
    }

    // sales_user can only view their own leads
    if (req.user!.role === 'sales_user' && lead.createdBy.toString() !== req.user!.id) {
      sendError(res, 'Forbidden', 403)
      return
    }

    sendSuccess(res, lead)
  } catch (err) {
    next(err)
  }
}

// PUT /api/leads/:id
export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params['id'])

    if (!lead) {
      sendError(res, 'Lead not found', 404)
      return
    }

    // sales_user can only update their own leads
    if (req.user!.role === 'sales_user' && lead.createdBy.toString() !== req.user!.id) {
      sendError(res, 'Forbidden', 403)
      return
    }

    const { name, email, status, source } = req.body as Partial<{
      name: string
      email: string
      status: LeadStatus
      source: LeadSource
    }>

    if (name !== undefined) lead.name = name
    if (email !== undefined) lead.email = email
    if (status !== undefined) lead.status = status
    if (source !== undefined) lead.source = source

    await lead.save()
    sendSuccess(res, lead, 'Lead updated')
  } catch (err) {
    next(err)
  }
}

// DELETE /api/leads/:id  (admin only — enforced in route middleware)
export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params['id'])

    if (!lead) {
      sendError(res, 'Lead not found', 404)
      return
    }

    sendSuccess(res, null, 'Lead deleted')
  } catch (err) {
    next(err)
  }
}

// Validation rules (reusable)
export const createLeadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').notEmpty().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
]

export const updateLeadValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
]
