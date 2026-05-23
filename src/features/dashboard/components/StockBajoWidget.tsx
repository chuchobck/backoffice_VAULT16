import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StockBajoItem } from '../api/dashboardApi'
import { Spinner } from '@/shared/components/ui/Spinner'

interface StockBajoWidgetProps {
  data?: StockBajoItem[]
  isLoading?: boolean
}

export function StockBajoWidget({ data, isLoading }: StockBajoWidgetProps) {
  return (
    <div className="bg-asphalt-800 border border-amber-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-asphalt-200">Stock bajo</h3>
        {data && data.length > 0 && (
          <span className="ml-auto text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
            {data.length}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner /></div>
      ) : !data?.length ? (
        <p className="text-sm text-asphalt-500 text-center py-6">Todo el stock en buen nivel</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto scrollbar-hide">
          {data.map((item) => (
            <div key={item.id_variante} className="flex items-center justify-between gap-2 py-1.5 border-b border-asphalt-700/50 last:border-0">
              <div className="min-w-0">
                <p className="text-sm text-asphalt-200 truncate">{item.nombre_producto}</p>
                <p className="text-xs text-asphalt-500 font-mono">{item.sku} · {item.talla}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.stock <= 2 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {item.stock} ud.
              </span>
            </div>
          ))}
        </div>
      )}
      <Link to="/backoffice/inventario/stock" className="mt-3 block text-xs text-electric-400 hover:text-electric-300 transition-colors">
        Ver inventario completo →
      </Link>
    </div>
  )
}
