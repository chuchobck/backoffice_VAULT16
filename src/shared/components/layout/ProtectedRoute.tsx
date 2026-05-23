import { Navigate, useLocation } from 'react-router-dom'
import { useAuthBoStore } from '@/shared/stores/authBoStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthBoStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/backoffice" replace />
  }

  return <>{children}</>
}
