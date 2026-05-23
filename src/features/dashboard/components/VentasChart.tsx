import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { VentaDia } from '../api/dashboardApi'
import { Spinner } from '@/shared/components/ui/Spinner'

interface VentasChartProps {
  data?: VentaDia[]
  isLoading?: boolean
}

export function VentasChart({ data, isLoading }: VentasChartProps) {
  const chartData = (data ?? []).map((d) => ({
    ...d,
    fecha: format(parseISO(d.fecha), 'd MMM', { locale: es }),
    total: Number(d.total),
  }))

  return (
    <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-asphalt-200 mb-4">Ventas últimos 30 días</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-48"><Spinner /></div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#353C42" vertical={false} />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 10, fill: '#6B757D' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6B757D' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              contentStyle={{ background: '#252A2E', border: '1px solid #353C42', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#C8CDD1' }}
              itemStyle={{ color: '#60A5FA' }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, 'Total']}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorVentas)"
              dot={false}
              activeDot={{ r: 4, fill: '#60A5FA' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
