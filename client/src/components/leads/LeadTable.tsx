import { Lead } from '../../types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'

interface LeadTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export default function LeadTable({ leads, onEdit, onDelete }: LeadTableProps) {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Source</th>
            <th className="px-4 py-3 text-left">Created</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                <Link to={`/leads/${lead._id}`} className="hover:text-primary-600 hover:underline">
                  {lead.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{lead.email}</td>
              <td className="px-4 py-3"><Badge value={lead.status} /></td>
              <td className="px-4 py-3"><Badge value={lead.source} /></td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(lead)}>Edit</Button>
                  {user?.role === 'admin' && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(lead)}>Delete</Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
