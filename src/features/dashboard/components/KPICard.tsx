import { type ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import { Spinner } from '@/shared/components/ui/Spinner'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: number
  trendLabel?: string
  isLoading?: boolean
  colorClass?: string
}

export function KPICard({ title, value, icon, trend, trendLabel, isLoading, colorClass = 'text-electric-400' }: KPICardProps) {
  return (
    <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-asphalt-400">{title}</p>
        <span className={cn('p-2 rounded-lg bg-asphalt-700', colorClass)}>
          {icon}
        </span>
      </div>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <p className="text-2xl font-bold text-asphalt-100">{value}</p>
      )}
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs', trend >= 0 ? 'text-green-400' : 'text-red-400')}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(trend)}% {trendLabel}</span>
        </div>
      )}
    </div>
  )
}
