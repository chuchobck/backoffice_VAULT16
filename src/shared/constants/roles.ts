export const ROLES = {
  ADMIN:     'ADMIN',
  VENDEDOR:  'VENDEDOR',
  BODEGA:    'BODEGA',
  MARKETING: 'MARKETING',
  REPORTES:  'REPORTES',
} as const

export type RoleName = keyof typeof ROLES

export const ROLE_LABELS: Record<string, string> = {
  ADMIN:     'Administrador',
  VENDEDOR:  'Vendedor',
  BODEGA:    'Bodega',
  MARKETING: 'Marketing',
  REPORTES:  'Reportes',
}

export const ROLE_COLORS: Record<string, string> = {
  ADMIN:     'bg-red-500/10 text-red-400 border-red-500/20',
  VENDEDOR:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  BODEGA:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  MARKETING: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  REPORTES:  'bg-asphalt-500/10 text-asphalt-300 border-asphalt-500/20',
}
