import { PaginationMeta } from '../../types'
import Button from '../ui/Button'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = meta
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
      <span>Showing {from}–{to} of {total} leads</span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">
          {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
