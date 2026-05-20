import { Schema, model, Document, Types } from 'mongoose'
import { ILead, LeadStatus, LeadSource } from '../types'

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] satisfies LeadStatus[],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] satisfies LeadSource[],
      required: [true, 'Lead source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

// Index for faster filtering queries
leadSchema.index({ status: 1 })
leadSchema.index({ source: 1 })
leadSchema.index({ createdBy: 1 })
leadSchema.index({ name: 'text', email: 'text' })

const Lead = model<ILeadDocument>('Lead', leadSchema)
export default Lead
