import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Badge } from '@/shared/components/ui/Badge'
import type { Variante } from '../../api/catalogoApi'

const col = createColumnHelper<Variante>()

interface VariantesTableProps {
  variantes: Variante[]
  productoId: string
}

export function VariantesTable({ variantes }: VariantesTableProps) {
  const columns = useMemo(() => [
    col.accessor('sku', {
      header: 'SKU',
      cell: (info) => <span className="font-mono text-xs text-asphalt-300">{info.getValue()}</span>,
    }),
    col.accessor('talla', {
      header: 'Talla',
      cell: (info) => <span className="text-asphalt-200">{info.getValue().nombre_talla}</span>,
    }),
    col.accessor('stock', {
      header: 'Stock',
      cell: (info) => {
        const v = info.getValue()
        return (
          <span className={`font-mono font-semibold ${v === 0 ? 'text-red-400' : v <= 5 ? 'text-amber-400' : 'text-green-400'}`}>
            {v}
          </span>
        )
      },
    }),
    col.accessor('precio_oferta', {
      header: 'Precio oferta',
      cell: (info) => info.getValue()
        ? <span className="font-mono text-electric-400">${Number(info.getValue()).toFixed(2)}</span>
        : <span className="text-asphalt-500">—</span>,
    }),
    col.accessor('estado', {
      header: 'Estado',
      cell: (info) => <Badge variant={info.getValue() === 'ACT' ? 'success' : 'muted'}>{info.getValue() === 'ACT' ? 'Activa' : 'Inactiva'}</Badge>,
    }),
  ], [])

  return (
    <DataTable
      data={variantes}
      columns={columns}
      emptyMessage="No hay variantes"
    />
  )
}
