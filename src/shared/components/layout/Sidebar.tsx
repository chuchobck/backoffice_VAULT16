import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Receipt, CreditCard, Users, Package, PackageOpen,
  Tag, BadgeCheck, MessageSquareDot, Shield, ChevronRight, LogOut,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAuthBoStore } from '@/shared/stores/authBoStore'
import { ROLES, ROLE_COLORS, ROLE_LABELS } from '@/shared/constants/roles'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  roles: string[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Negocio',
    items: [
      { label: 'Dashboard', to: '/backoffice', icon: <LayoutDashboard className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.VENDEDOR, ROLES.BODEGA, ROLES.MARKETING, ROLES.REPORTES] },
      { label: 'Ventas', to: '/backoffice/ventas', icon: <Receipt className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
      { label: 'Pagos', to: '/backoffice/pagos', icon: <CreditCard className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
      { label: 'Clientes', to: '/backoffice/clientes', icon: <Users className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
    ],
  },
  {
    label: 'Catálogo & Stock',
    items: [
      { label: 'Catálogo', to: '/backoffice/catalogo/productos', icon: <Package className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.MARKETING, ROLES.BODEGA] },
      { label: 'Inventario', to: '/backoffice/inventario/stock', icon: <PackageOpen className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.BODEGA] },
      { label: 'Promociones', to: '/backoffice/promociones', icon: <Tag className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.MARKETING] },
    ],
  },
  {
    label: 'Administración',
    items: [
      { label: 'Personal', to: '/backoffice/personal/empleados', icon: <BadgeCheck className="h-4 w-4" />, roles: [ROLES.ADMIN] },
      { label: 'Asistente IA', to: '/backoffice/ia/sesiones', icon: <MessageSquareDot className="h-4 w-4" />, roles: [ROLES.ADMIN, ROLES.MARKETING] },
      { label: 'Auditoría', to: '/backoffice/auditoria', icon: <Shield className="h-4 w-4" />, roles: [ROLES.ADMIN] },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuthBoStore()
  const navigate = useNavigate()
  const userRol = user?.rol ?? ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-asphalt-900 border-r border-asphalt-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-asphalt-800">
        <div className="h-7 w-7 bg-electric-500 rounded flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-asphalt-100 tracking-tight">VAULT 16</span>
        <span className="text-xs text-asphalt-500 ml-auto">BO</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide" aria-label="Navegación principal">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(userRol))
          if (visibleItems.length === 0) return null
          return (
            <div key={group.label} className="mb-1">
              <p className="px-4 py-2 text-[10px] font-semibold text-asphalt-500 uppercase tracking-wider">
                {group.label}
              </p>
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/backoffice'}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-electric-500/10 text-electric-400 font-medium'
                        : 'text-asphalt-400 hover:bg-asphalt-800 hover:text-asphalt-200',
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <ChevronRight className="h-3 w-3 ml-auto opacity-40" aria-hidden="true" />
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="border-t border-asphalt-800 p-3">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-7 w-7 rounded-full bg-electric-500/20 flex items-center justify-center text-electric-400 text-xs font-semibold flex-shrink-0">
              {user.empleado.nombre1[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-asphalt-200 truncate">
                {user.empleado.nombre1} {user.empleado.apellido1}
              </p>
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', ROLE_COLORS[userRol])}>
                {ROLE_LABELS[userRol] ?? userRol}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-asphalt-400 hover:text-status-danger hover:bg-status-danger/10 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  )
}
