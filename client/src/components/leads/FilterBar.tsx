import { LeadFilters, LeadStatus, LeadSource } from '../../types'
import Input from '../ui/Input'
import Button from '../ui/Button'

interface FilterBarProps {
  filters: LeadFilters
  searchInput: string
  onSearchChange: (val: string) => void
  onFilterChange: (key: keyof LeadFilters, value: string) => void
  onExport: () => void
  onCreateClick: () => void
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost']
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral']

export default function FilterBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onExport,
  onCreateClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Source filter */}
      <select
        value={filters.source ?? ''}
        onChange={(e) => onFilterChange('source', e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Sources</option>
        {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Sort toggle */}
      <select
        value={filters.sort ?? 'latest'}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {/* Actions */}
      <Button variant="secondary" size="md" onClick={onExport}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export CSV
      </Button>

      <Button size="md" onClick={onCreateClick}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Lead
      </Button>
    </div>
  )
}
