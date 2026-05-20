import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lead } from '../types'
import { getLeadById } from '../services/leadService'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getLeadById(id)
      .then(setLead)
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to load lead'
        setError(msg)
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500 font-medium">{error ?? 'Lead not found'}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  const creator = typeof lead.createdBy === 'object' ? lead.createdBy : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lead.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{lead.email}</p>
            </div>
            <Badge value={lead.status} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Source</p>
              <Badge value={lead.source} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Created</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {new Date(lead.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {creator && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Created By</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{creator.name}</p>
                <p className="text-xs text-gray-400">{creator.email}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Lead ID</p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">{lead._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
