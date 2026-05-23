import { useLocation } from 'react-router-dom'

const ROUTE_TITLES: Record<string, string> = {
  '/backoffice': 'Dashboard',
  '/backoffice/ventas': 'Ventas',
  '/backoffice/pagos': 'Pagos',
  '/backoffice/clientes': 'Clientes',
  '/backoffice/catalogo/productos': 'Catálogo — Productos',
  '/backoffice/catalogo/categorias': 'Catálogo — Categorías',
  '/backoffice/catalogo/tallas': 'Catálogo — Tallas',
  '/backoffice/inventario/stock': 'Inventario — Stock actual',
  '/backoffice/inventario/ajustes': 'Inventario — Ajustes',
  '/backoffice/inventario/movimientos': 'Inventario — Movimientos',
  '/backoffice/promociones': 'Promociones',
  '/backoffice/personal/empleados': 'Personal — Empleados',
  '/backoffice/personal/roles': 'Personal — Roles',
  '/backoffice/ia/sesiones': 'Asistente IA — Sesiones',
  '/backoffice/ia/metricas': 'Asistente IA — Métricas',
  '/backoffice/auditoria': 'Auditoría',
}

function getTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  // Match dynamic routes
  if (/^\/backoffice\/ventas\/\d+$/.test(pathname)) return 'Detalle de Factura'
  if (/^\/backoffice\/pagos\/\d+$/.test(pathname)) return 'Detalle de Pago'
  if (/^\/backoffice\/clientes\/\d+$/.test(pathname)) return 'Detalle de Cliente'
  if (/^\/backoffice\/catalogo\/productos\/.+$/.test(pathname)) return 'Detalle de Producto'
  if (/^\/backoffice\/promociones\/.+$/.test(pathname)) return 'Detalle de Promoción'
  if (/^\/backoffice\/personal\/empleados\/.+$/.test(pathname)) return 'Detalle de Empleado'
  if (/^\/backoffice\/ia\/sesiones\/.+$/.test(pathname)) return 'Sesión IA'
  return 'VAULT 16'
}

export function TopBar() {
  const { pathname } = useLocation()
  const title = getTitle(pathname)

  return (
    <header className="h-14 flex items-center px-6 border-b border-asphalt-800 bg-asphalt-900/80 backdrop-blur-md sticky top-0 z-10">
      <h1 className="text-sm font-semibold text-asphalt-200">{title}</h1>
    </header>
  )
}
