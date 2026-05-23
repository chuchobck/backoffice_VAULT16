import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { KPICard } from '../components/KPICard'
import { VentasChart } from '../components/VentasChart'
import { TopProductosTable } from '../components/TopProductosTable'
import { StockBajoWidget } from '../components/StockBajoWidget'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const { kpis, ventas, topProductos, stockBajo } = useDashboard()

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ventas hoy"
          value={kpis.data ? `$${Number(kpis.data.ventasHoy).toFixed(2)}` : '—'}
          icon={<DollarSign className="h-4 w-4" aria-hidden="true" />}
          isLoading={kpis.isLoading}
          colorClass="text-electric-400"
        />
        <KPICard
          title="Pedidos pendientes"
          value={kpis.data?.pedidosPendientes ?? '—'}
          icon={<ShoppingCart className="h-4 w-4" aria-hidden="true" />}
          isLoading={kpis.isLoading}
          colorClass="text-amber-400"
        />
        <KPICard
          title="Clientes activos"
          value={kpis.data?.clientesActivos ?? '—'}
          icon={<Users className="h-4 w-4" aria-hidden="true" />}
          isLoading={kpis.isLoading}
          colorClass="text-green-400"
        />
        <KPICard
          title="Ingresos del mes"
          value={kpis.data ? `$${Number(kpis.data.ingresosMes).toFixed(2)}` : '—'}
          icon={<Package className="h-4 w-4" aria-hidden="true" />}
          isLoading={kpis.isLoading}
          colorClass="text-purple-400"
        />
      </div>

      {/* Chart */}
      <VentasChart data={ventas.data} isLoading={ventas.isLoading} />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProductosTable data={topProductos.data} isLoading={topProductos.isLoading} />
        <StockBajoWidget data={stockBajo.data} isLoading={stockBajo.isLoading} />
      </div>
    </div>
  )
}
