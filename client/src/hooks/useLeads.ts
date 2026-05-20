import { useState, useEffect, useCallback } from 'react'
import { Lead, LeadFilters, PaginationMeta } from '../types'
import { getLeads } from '../services/leadService'

interface UseLeadsReturn {
  leads: Lead[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLeads(filters: LeadFilters): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getLeads(filters)
      setLeads(res.data)
      setMeta(res.meta)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to fetch leads'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.source, filters.search, filters.sort, filters.page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads])

  return { leads, meta, loading, error, refetch: fetchLeads }
}
