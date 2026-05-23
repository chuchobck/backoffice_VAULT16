import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { useState } from 'react'
import { getEmpleado, deactivateEmpleado } from '../api/personalApi'
import { LinkButton } from '@/shared/components/ui/LinkButton'
import { ResetPasswordModal } from '../components/ResetPasswordModal'

export function EmpleadoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)

  const { data: emp, isLoading } = useQuery({
    queryKey: ['empleado', id],
    queryFn: () => getEmpleado(Number(id)),
    enabled: !!id,
  })

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateEmpleado(Number(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['empleado', id] }); qc.invalidateQueries({ queryKey: ['empleados'] }); toast.success('Empleado desactivado'); setConfirmDeactivate(false) },
    onError: () => toast.error('Error al desactivar'),
  })

  if (isLoading) return <PageSpinner />
  if (!emp) return <p className="text-asphalt-400">Empleado no encontrado</p>

  return (
    <div className="flex flex-col gap-6 max-w-[700px]">
      <div className="flex items-center gap-3">
        <LinkButton to="/backoffice/personal" variant="ghost" size="icon" aria-label="Volver"><ArrowLeft className="h-4 w-4" /></LinkButton>
        <h2 className="text-lg font-semibold text-asphalt-100">{emp.nombre1} {emp.apellido1}</h2>
        <Badge variant={emp.estado_emp === 'ACT' ? 'success' : 'muted'}>{emp.estado_emp === 'ACT' ? 'Activo' : 'Inactivo'}</Badge>
      </div>

      <div className="bg-asphalt-800 rounded-xl border border-asphalt-700 p-5 grid grid-cols-2 gap-4">
        {[
          { label: 'Email', value: emp.email },
          { label: 'Teléfono', value: emp.telefono ?? '—' },
          { label: 'Rol', value: emp.rol.nombre_rol },
          { label: 'Usuario sistema', value: emp.usuario?.email ?? 'Sin usuario' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-asphalt-500 mb-1">{label}</p>
            <p className="text-sm text-asphalt-200">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <ResetPasswordModal empleadoId={emp.id_empleado} empleadoNombre={`${emp.nombre1} ${emp.apellido1}`} />
        {emp.estado_emp === 'ACT' && (
          <Button variant="danger" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDeactivate(true)}>
            Desactivar empleado
          </Button>
        )}
      </div>

      <Modal open={confirmDeactivate} onClose={() => setConfirmDeactivate(false)} title="Confirmar desactivación" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDeactivate(false)}>Cancelar</Button>
            <Button variant="danger" loading={deactivateMutation.isPending} onClick={() => deactivateMutation.mutate()}>Desactivar</Button>
          </>
        }
      >
        <p className="text-sm text-asphalt-300">¿Estás seguro de desactivar a <strong className="text-asphalt-100">{emp.nombre1} {emp.apellido1}</strong>? No podrá acceder al sistema.</p>
      </Modal>
    </div>
  )
}
