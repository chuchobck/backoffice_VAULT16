import { useQuery } from '@tanstack/react-query'
import { getKPIs, getVentasPorDia, getTopProductos, getStockBajo, getUsoIA } from '../api/dashboardApi'

export function useDashboard() {
  const kpis = useQuery({ queryKey: ['dashboard', 'kpis'], queryFn: getKPIs })
  const ventas = useQuery({ queryKey: ['dashboard', 'ventas-dia'], queryFn: getVentasPorDia })
  const topProductos = useQuery({ queryKey: ['dashboard', 'top-productos'], queryFn: getTopProductos })
  const stockBajo = useQuery({ queryKey: ['dashboard', 'stock-bajo'], queryFn: getStockBajo })
  const usoIA = useQuery({ queryKey: ['dashboard', 'uso-ia'], queryFn: getUsoIA })

  return { kpis, ventas, topProductos, stockBajo, usoIA }
}
