import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/shared/components/ui/Button'
import { Select } from '@/shared/components/ui/Select'
import { Input } from '@/shared/components/ui/Input'
import { createAjuste } from '../api/inventarioApi'
import { getStockActual } from '../api/inventarioApi'

const Schema = z.object({
  tipo: z.enum(['ING', 'EGR']),
  motivo: z.string().min(3, 'Requerido'),
  lineas: z.array(z.object({
    id_variante: z.coerce.number().positive('Selecciona variante'),
    cantidad: z.coerce.number().positive('> 0'),
  })).min(1, 'Al menos 1 línea'),
})
type FormInput = z.infer<typeof Schema>

export function AjusteForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: stock } = useQuery({ queryKey: ['stock-actual', { pageSize: 200 }], queryFn: () => getStockActual({ pageSize: 200 }) })

  const varianteOptions = (stock?.data ?? []).map((s) => ({
    value: String(s.id_variante),
    label: `${s.nombre_producto} — ${s.talla} (${s.sku}) | Stock: ${s.stock}`,
  }))

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(Schema),
    defaultValues: { tipo: 'ING', motivo: '', lineas: [{ id_variante: 0, cantidad: 1 }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lineas' })

  const mutation = useMutation({
    mutationFn: createAjuste,
    onSuccess: () => { toast.success('Ajuste creado'); onSuccess() },
    onError: () => toast.error('Error al crear ajuste'),
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo"
          options={[{ value: 'ING', label: 'Ingreso de stock' }, { value: 'EGR', label: 'Egreso de stock' }]}
          {...register('tipo')}
          fullWidth
        />
        <Input label="Motivo" {...register('motivo')} error={errors.motivo?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-asphalt-200">Líneas</p>
          <Button type="button" variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => append({ id_variante: 0, cantidad: 1 })}>
            Agregar línea
          </Button>
        </div>
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <Select
                label={i === 0 ? 'Variante' : undefined}
                options={varianteOptions}
                placeholder="Selecciona variante"
                {...register(`lineas.${i}.id_variante`)}
                error={errors.lineas?.[i]?.id_variante?.message}
                fullWidth
              />
            </div>
            <div className="w-24">
              <Input
                label={i === 0 ? 'Cantidad' : undefined}
                type="number"
                min={1}
                {...register(`lineas.${i}.cantidad`)}
                error={errors.lineas?.[i]?.cantidad?.message}
              />
            </div>
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" aria-label="Eliminar línea" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            )}
          </div>
        ))}
        {errors.lineas?.root && <p className="text-xs text-red-400">{errors.lineas.root.message}</p>}
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button type="submit" loading={isSubmitting || mutation.isPending}>Crear ajuste</Button>
      </div>
    </form>
  )
}
