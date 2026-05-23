import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { getMetricasIA } from '../api/asistenteIAApi'

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-asphalt-800 rounded-xl border border-asphalt-700 p-4">
      <p className="text-xs text-asphalt-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-asphalt-100">{value}</p>
    </div>
  )
}

export function MetricasIAPage() {
  const { data, isLoading } = useQuery({ queryKey: ['metricas-ia'], queryFn: getMetricasIA })

  if (isLoading) return <PageSpinner />
  if (!data) return null

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Sesiones totales" value={data.total_sesiones} />
        <KPI label="Mensajes totales" value={data.total_mensajes} />
        <KPI label="Tokens consumidos" value={data.total_tokens.toLocaleString()} />
        <KPI label="Mensajes / sesión" value={Number(data.avg_mensajes_por_sesion).toFixed(1)} />
      </div>

      <div className="bg-asphalt-800 rounded-xl border border-asphalt-700 p-5">
        <p className="text-sm font-semibold text-asphalt-200 mb-4">Actividad diaria</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data.sesiones_por_dia} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIASesiones" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => format(new Date(v), 'dd/MM', { locale: es })} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', color: '#e2e8f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="sesiones" stroke="#818cf8" fill="url(#gradIASesiones)" strokeWidth={2} name="Sesiones" />
            <Area type="monotone" dataKey="mensajes" stroke="#38bdf8" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Mensajes" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
