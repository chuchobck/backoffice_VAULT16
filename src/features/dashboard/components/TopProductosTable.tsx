import type { TopProducto } from '../api/dashboardApi'
import { Spinner } from '@/shared/components/ui/Spinner'

interface TopProductosTableProps {
  data?: TopProducto[]
  isLoading?: boolean
}

export function TopProductosTable({ data, isLoading }: TopProductosTableProps) {
  return (
    <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-asphalt-200 mb-4">Top 10 Productos</h3>
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : !data?.length ? (
        <p className="text-sm text-asphalt-500 text-center py-8">Sin datos</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-asphalt-700">
                <th className="text-left py-2 text-xs text-asphalt-500 font-medium">#</th>
                <th className="text-left py-2 text-xs text-asphalt-500 font-medium">Producto</th>
                <th className="text-right py-2 text-xs text-asphalt-500 font-medium">Uds.</th>
                <th className="text-right py-2 text-xs text-asphalt-500 font-medium">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, i) => (
                <tr key={p.id_producto} className="border-b border-asphalt-800/50">
                  <td className="py-2.5 text-asphalt-500 w-6">{i + 1}</td>
                  <td className="py-2.5 text-asphalt-200 max-w-[160px] truncate">{p.nombre}</td>
                  <td className="py-2.5 text-right text-asphalt-300">{p.cantidad_vendida}</td>
                  <td className="py-2.5 text-right text-electric-400 font-mono">
                    ${Number(p.ingreso_total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
