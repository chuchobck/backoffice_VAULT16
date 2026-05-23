import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { createPromocion, type Promocion } from '../api/promocionesApi'

const Schema = z.object({
  nombre: z.string().min(3).max(80),
  descripcion: z.string().max(200).optional(),
  descuento_porcentaje: z.coerce.number().min(1).max(99),
  fecha_inicio: z.string().min(1, 'Requerida'),
  fecha_fin: z.string().min(1, 'Requerida'),
}).refine((d) => d.fecha_fin > d.fecha_inicio, { message: 'Fin debe ser después del inicio', path: ['fecha_fin'] })

type FormInput = z.infer<typeof Schema>

export function PromocionForm({ onSuccess }: { onSuccess: (promo: Promocion) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(Schema),
  })

  const mutation = useMutation({
    mutationFn: createPromocion,
    onSuccess: (promo) => onSuccess(promo),
    onError: () => toast.error('Error al crear promoción'),
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
      <Input label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
      <Input label="Descripción (opcional)" {...register('descripcion')} error={errors.descripcion?.message} />
      <Input label="Descuento %" type="number" min={1} max={99} {...register('descuento_porcentaje')} error={errors.descuento_porcentaje?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Fecha inicio" type="date" {...register('fecha_inicio')} error={errors.fecha_inicio?.message} />
        <Input label="Fecha fin" type="date" {...register('fecha_fin')} error={errors.fecha_fin?.message} />
      </div>
      <div className="flex justify-end mt-2">
        <Button type="submit" loading={isSubmitting || mutation.isPending}>Crear promoción</Button>
      </div>
    </form>
  )
}
