import { Response, NextFunction } from 'express'
import Lead from '../models/Lead'
import { AuthRequest, LeadStatus, LeadSource } from '../types'

// GET /api/leads/export/csv
export const exportLeadsCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort } = req.query as {
      status?: LeadStatus
      source?: LeadSource
      search?: string
      sort?: 'latest' | 'oldest'
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {}

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

    const leads = await Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .populate('createdBy', 'name email')
      .lean()

    // Build CSV
    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created By', 'Created At']
    const rows = leads.map((lead) => {
      const creator = lead.createdBy as unknown as { name: string; email: string } | null
      return [
        lead._id.toString(),
        `"${lead.name}"`,
        lead.email,
        lead.status,
        lead.source,
        creator ? `"${creator.name}"` : '',
        new Date(lead.createdAt).toISOString(),
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    const date = new Date().toISOString().split('T')[0]

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="leads-export-${date}.csv"`)
    res.status(200).send(csv)
  } catch (err) {
    next(err)
  }
}
