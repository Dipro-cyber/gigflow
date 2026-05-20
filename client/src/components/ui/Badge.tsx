import { LeadStatus, LeadSource } from '../../types'

type BadgeVariant = LeadStatus | LeadSource | string

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  Website: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  Referral: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

interface BadgeProps {
  value: BadgeVariant
}

export default function Badge({ value }: BadgeProps) {
  const colorClass = statusColors[value] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {value}
    </span>
  )
}
