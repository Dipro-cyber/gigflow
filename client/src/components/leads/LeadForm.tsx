import { useState, FormEvent } from 'react'
import { Lead, CreateLeadPayload, LeadStatus, LeadSource } from '../../types'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface LeadFormProps {
  initialData?: Lead
  onSubmit: (payload: CreateLeadPayload) => Promise<void>
  onCancel: () => void
  loading: boolean
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost']
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral']

interface FormErrors {
  name?: string
  email?: string
  source?: string
}

export default function LeadForm({ initialData, onSubmit, onCancel, loading }: LeadFormProps) {
  const [form, setForm] = useState<CreateLeadPayload>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    status: initialData?.status ?? 'New',
    source: initialData?.source ?? 'Website',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.source) errs.source = 'Source is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        placeholder="Lead name"
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        placeholder="lead@example.com"
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
        <select
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initialData ? 'Update Lead' : 'Create Lead'}</Button>
      </div>
    </form>
  )
}
