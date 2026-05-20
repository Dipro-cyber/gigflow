import { Router } from 'express'
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  createLeadValidation,
  updateLeadValidation,
} from '../controllers/leadController'
import { exportLeadsCSV } from '../controllers/exportController'
import { protect, requireRole } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

// All lead routes require authentication
router.use(protect)

// CSV export — must be before /:id to avoid param conflict
router.get('/export/csv', exportLeadsCSV)

router.route('/')
  .get(getLeads)
  .post(createLeadValidation, validate, createLead)

router.route('/:id')
  .get(getLeadById)
  .put(updateLeadValidation, validate, updateLead)
  .delete(requireRole('admin'), deleteLead) // admin only

export default router
