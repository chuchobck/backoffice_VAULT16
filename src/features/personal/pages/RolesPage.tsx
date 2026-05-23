import { useQuery } from '@tanstack/react-query'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { getRoles } from '../api/personalApi'

export function RolesPage() {
  const { data: roles, isLoading } = useQuery({ queryKey: ['roles-list'], queryFn: getRoles })

  if (isLoading) return <PageSpinner />

  return (
    <div className="flex flex-col gap-4 max-w-[700px]">
      <p className="text-sm text-asphalt-400">Los roles son fijos en el sistema. No se pueden crear ni eliminar.</p>
      <div className="bg-asphalt-800 rounded-xl border border-asphalt-700 divide-y divide-asphalt-700/60">
        {(roles ?? []).map((rol) => (
          <div key={rol.id_rol} className="p-4">
            <p className="font-semibold text-asphalt-100">{rol.nombre_rol}</p>
            {rol.descripcion && <p className="text-sm text-asphalt-400 mt-0.5">{rol.descripcion}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
