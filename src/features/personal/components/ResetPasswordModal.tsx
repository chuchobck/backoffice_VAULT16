import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { resetPassword } from '../api/personalApi'

const Schema = z.object({
  nueva_password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmar: z.string(),
}).refine((d) => d.nueva_password === d.confirmar, { message: 'Las contraseñas no coinciden', path: ['confirmar'] })

type FormInput = z.infer<typeof Schema>

interface Props {
  empleadoId: number
  empleadoNombre: string
}

export function ResetPasswordModal({ empleadoId, empleadoNombre }: Props) {
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(Schema),
  })

  const mutation = useMutation({
    mutationFn: ({ nueva_password }: FormInput) => resetPassword(empleadoId, nueva_password),
    onSuccess: () => { toast.success('Contraseña actualizada'); reset(); setOpen(false) },
    onError: () => toast.error('Error al actualizar contraseña'),
  })

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Restablecer contraseña</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Restablecer contraseña — ${empleadoNombre}`} size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button loading={isSubmitting} form="reset-pw-form" type="submit">Guardar</Button>
          </>
        }
      >
        <form id="reset-pw-form" onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-3">
          <Input label="Nueva contraseña" type="password" {...register('nueva_password')} error={errors.nueva_password?.message} />
          <Input label="Confirmar contraseña" type="password" {...register('confirmar')} error={errors.confirmar?.message} />
        </form>
      </Modal>
    </>
  )
}
