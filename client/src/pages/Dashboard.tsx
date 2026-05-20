import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useLeads } from '../hooks/useLeads'
import { useDebounce } from '../hooks/useDebounce'
import { LeadFilters, Lead, CreateLeadPayload } from '../types'
import { createLead, updateLead, deleteLead, getExportUrl } from '../services/leadService'
import { getToken } from '../utils/storage'
import LeadTable from '../components/leads/LeadTable'
import FilterBar from '../components/leads/FilterBar'
import Pagination from '../components/leads/Pagination'
import Modal from '../components/ui/Modal'
import LeadForm from '../components/leads/LeadForm'
import Button from '../components/ui/Button'
import DarkModeToggle from '../components/ui/DarkModeToggle'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Filter state
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 })

  // Merge debounced search into filters
  const activeFilters: LeadFilters = { ...filters, search: debouncedSearch || undefined, page: filters.page }

  const { leads, meta, loading, error, refetch } = useLeads(activeFilters)

  // Modal state
  const [createOpen, setCreateOpen] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleFilterChange = useCallback((key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }, [])

  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }))

  const handleCreate = async (payload: CreateLeadPayload) => {
    setFormLoading(true)
    try {
      await createLead(payload)
      toast.success('Lead created')
      setCreateOpen(false)
      refetch()
    } catch {
      toast.error('Failed to create lead')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (payload: CreateLeadPayload) => {
    if (!editLead) return
    setFormLoading(true)
    try {
      await updateLead(editLead._id, payload)
      toast.success('Lead updated')
      setEditLead(null)
      refetch()
    } catch {
      toast.error('Failed to update lead')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingLead) return
    setDeleteLoading(true)
    try {
      await deleteLead(deletingLead._id)
      toast.success('Lead deleted')
      setDeletingLead(null)
      refetch()
    } catch {
      toast.error('Failed to delete lead')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleExport = () => {
    const url = getExportUrl(activeFilters)
    const token = getToken()
    // Open with token in header via fetch + blob download
    fetch(url, { headers: { Authorization: `Bearer ${token ?? ''}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const date = new Date().toISOString().split('T')[0]
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `leads-export-${date}.csv`
        a.click()
        URL.revokeObjectURL(a.href)
      })
      .catch(() => toast.error('Export failed'))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary-600">GigFlow</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Smart Leads Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name} <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{user?.role}</span>
            </span>
            <DarkModeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Leads</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your sales leads</p>
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar
            filters={filters}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            onCreateClick={() => setCreateOpen(true)}
          />
        </div>

        {/* Table area */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-red-500 font-medium">{error}</p>
            <Button variant="secondary" onClick={refetch}>Retry</Button>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">No leads found</p>
            <p className="text-sm">Try adjusting your filters or add a new lead</p>
          </div>
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={(lead) => setEditLead(lead)}
              onDelete={(lead) => setDeletingLead(lead)}
            />
            {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
          </>
        )}
      </main>

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add New Lead">
        <LeadForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} loading={formLoading} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            initialData={editLead}
            onSubmit={handleUpdate}
            onCancel={() => setEditLead(null)}
            loading={formLoading}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingLead} onClose={() => setDeletingLead(null)} title="Delete Lead" size="sm">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-100">{deletingLead?.name}</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeletingLead(null)}>Cancel</Button>
          <Button variant="danger" loading={deleteLoading} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
