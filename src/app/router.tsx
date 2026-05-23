import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { BackofficeLayout } from '@/shared/components/layout/BackofficeLayout'
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute'
import { ROLES } from '@/shared/constants/roles'

// ─── Lazy pages ──────────────────────────────────────────────────────────────

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const FacturasPage = lazy(() =>
  import('@/features/ventas/pages/FacturasPage').then((m) => ({ default: m.FacturasPage })),
)
const FacturaDetailPage = lazy(() =>
  import('@/features/ventas/pages/FacturaDetailPage').then((m) => ({ default: m.FacturaDetailPage })),
)
const PagosPage = lazy(() =>
  import('@/features/pagos/pages/PagosPage').then((m) => ({ default: m.PagosPage })),
)
const PagoDetailPage = lazy(() =>
  import('@/features/pagos/pages/PagoDetailPage').then((m) => ({ default: m.PagoDetailPage })),
)
const ClientesPage = lazy(() =>
  import('@/features/clientes/pages/ClientesPage').then((m) => ({ default: m.ClientesPage })),
)
const ClienteDetailPage = lazy(() =>
  import('@/features/clientes/pages/ClienteDetailPage').then((m) => ({ default: m.ClienteDetailPage })),
)
const ProductosPage = lazy(() =>
  import('@/features/catalogo/pages/ProductosPage').then((m) => ({ default: m.ProductosPage })),
)
const ProductoDetailPage = lazy(() =>
  import('@/features/catalogo/pages/ProductoDetailPage').then((m) => ({ default: m.ProductoDetailPage })),
)
const CategoriasPage = lazy(() =>
  import('@/features/catalogo/pages/CategoriasPage').then((m) => ({ default: m.CategoriasPage })),
)
const TallasPage = lazy(() =>
  import('@/features/catalogo/pages/TallasPage').then((m) => ({ default: m.TallasPage })),
)
const StockActualPage = lazy(() =>
  import('@/features/inventario/pages/StockActualPage').then((m) => ({ default: m.StockActualPage })),
)
const AjustesPage = lazy(() =>
  import('@/features/inventario/pages/AjustesPage').then((m) => ({ default: m.AjustesPage })),
)
const MovimientosPage = lazy(() =>
  import('@/features/inventario/pages/MovimientosPage').then((m) => ({ default: m.MovimientosPage })),
)
const PromocionesPage = lazy(() =>
  import('@/features/promociones/pages/PromocionesPage').then((m) => ({ default: m.PromocionesPage })),
)
const PromocionDetailPage = lazy(() =>
  import('@/features/promociones/pages/PromocionDetailPage').then((m) => ({ default: m.PromocionDetailPage })),
)
const EmpleadosPage = lazy(() =>
  import('@/features/personal/pages/EmpleadosPage').then((m) => ({ default: m.EmpleadosPage })),
)
const EmpleadoDetailPage = lazy(() =>
  import('@/features/personal/pages/EmpleadoDetailPage').then((m) => ({ default: m.EmpleadoDetailPage })),
)
const RolesPage = lazy(() =>
  import('@/features/personal/pages/RolesPage').then((m) => ({ default: m.RolesPage })),
)
const SesionesPage = lazy(() =>
  import('@/features/asistente-ia/pages/SesionesPage').then((m) => ({ default: m.SesionesPage })),
)
const SesionDetailPage = lazy(() =>
  import('@/features/asistente-ia/pages/SesionDetailPage').then((m) => ({ default: m.SesionDetailPage })),
)
const MetricasIAPage = lazy(() =>
  import('@/features/asistente-ia/pages/MetricasIAPage').then((m) => ({ default: m.MetricasIAPage })),
)
const AuditoriaPage = lazy(() =>
  import('@/features/auditoria/pages/AuditoriaPage').then((m) => ({ default: m.AuditoriaPage })),
)

// ─── Loading Fallback ─────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/backoffice" replace />} />

        {/* Backoffice — requiere auth */}
        <Route
          path="/backoffice"
          element={
            <ProtectedRoute>
              <BackofficeLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.BODEGA, ROLES.MARKETING, ROLES.REPORTES]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Ventas */}
          <Route
            path="ventas"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <FacturasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="ventas/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <FacturaDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Pagos */}
          <Route
            path="pagos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <PagosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pagos/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <PagoDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Clientes */}
          <Route
            path="clientes"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <ClientesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="clientes/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
                <ClienteDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Catálogo */}
          <Route
            path="catalogo/productos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING, ROLES.BODEGA]}>
                <ProductosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="catalogo/productos/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING, ROLES.BODEGA]}>
                <ProductoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="catalogo/categorias"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING, ROLES.BODEGA]}>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="catalogo/tallas"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING, ROLES.BODEGA]}>
                <TallasPage />
              </ProtectedRoute>
            }
          />

          {/* Inventario */}
          <Route
            path="inventario/stock"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.BODEGA]}>
                <StockActualPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventario/ajustes"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.BODEGA]}>
                <AjustesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventario/movimientos"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.BODEGA]}>
                <MovimientosPage />
              </ProtectedRoute>
            }
          />

          {/* Promociones */}
          <Route
            path="promociones"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING]}>
                <PromocionesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="promociones/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING]}>
                <PromocionDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Personal */}
          <Route
            path="personal/empleados"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EmpleadosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="personal/empleados/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EmpleadoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="personal/roles"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <RolesPage />
              </ProtectedRoute>
            }
          />

          {/* Asistente IA */}
          <Route
            path="ia/sesiones"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING]}>
                <SesionesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="ia/sesiones/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING]}>
                <SesionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="ia/metricas"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MARKETING]}>
                <MetricasIAPage />
              </ProtectedRoute>
            }
          />

          {/* Auditoría */}
          <Route
            path="auditoria"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AuditoriaPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/backoffice" replace />} />
      </Routes>
    </Suspense>
  )
}
