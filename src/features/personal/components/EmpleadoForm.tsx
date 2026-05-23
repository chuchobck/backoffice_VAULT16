import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Button } from '@/shared/components/ui/Button'
import { createEmpleado, getRoles } from '../api/personalApi'

const Schema = z.object({
  nombre1: z.string().min(2),
  nombre2: z.string().optional(),
  apellido1: z.string().min(2),
  apellido2: z.string().optional(),
  email: z.string().email(),
  telefono: z.string().optional(),
  id_rol: z.coerce.number().positive('Selecciona un rol'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})
type FormInput = z.infer<typeof Schema>

export function EmpleadoForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: roles } = useQuery({ queryKey: ['roles-list'], queryFn: getRoles })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(Schema),
  })

  const mutation = useMutation({
    mutationFn: createEmpleado,
    onSuccess: onSuccess,
    onError: () => toast.error('Error al crear empleado'),
  })

  const rolOptions = (roles ?? []).map((r) => ({ value: String(r.id_rol), label: r.nombre_rol }))

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Primer nombre*" {...register('nombre1')} error={errors.nombre1?.message} />
        <Input label="Segundo nombre" {...register('nombre2')} />
        <Input label="Primer apellido*" {...register('apellido1')} error={errors.apellido1?.message} />
        <Input label="Segundo apellido" {...register('apellido2')} />
      </div>
      <Input label="Email*" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Teléfono" {...register('telefono')} />
      <Select label="Rol*" options={rolOptions} placeholder="Selecciona rol" {...register('id_rol')} error={errors.id_rol?.message} fullWidth />
      <Input label="Contraseña inicial*" type="password" {...register('password')} error={errors.password?.message} />
      <div className="flex justify-end mt-2">
        <Button type="submit" loading={isSubmitting || mutation.isPending}>Crear empleado</Button>
      </div>
    </form>
  )
}
