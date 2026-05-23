import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Cpu, Upload, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import { VariantesTable } from '../components/variantes/VariantesTable'
import { FotosGaleria } from '../components/fotos/FotosGaleria'
import { FotoUploader } from '../components/fotos/FotoUploader'
import { AIDescripcionCard } from '../components/ai/AIDescripcionCard'
import { getProducto, toggleProductoEstado, generateAIContent } from '../api/catalogoApi'

type Tab = 'info' | 'variantes' | 'fotos' | 'ia'

export function ProductoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('info')
  const [showUploader, setShowUploader] = useState(false)

  const { data: producto, isLoading } = useQuery({
    queryKey: ['productos', id],
    queryFn: () => getProducto(id!),
    enabled: !!id,
  })

  const toggleEstado = useMutation({
    mutationFn: () => toggleProductoEstado(id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos'] }); toast.success('Estado actualizado') },
    onError: () => toast.error('Error al actualizar estado'),
  })

  const generateAI = useMutation({
    mutationFn: () => generateAIContent(id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos', id] }); toast.success('Contenido IA generado') },
    onError: () => toast.error('Error al generar contenido IA'),
  })

  if (isLoading) return <PageSpinner />
  if (!producto) return <p className="text-asphalt-400">Producto no encontrado</p>

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Info' },
    { key: 'variantes', label: `Variantes (${producto.variantes.length})` },
    { key: 'fotos', label: `Fotos (${producto.fotos.length})` },
    { key: 'ia', label: 'IA' },
  ]

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/backoffice/catalogo/productos">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>Volver</Button>
        </Link>
        <span className="font-mono text-xs text-asphalt-500">{producto.id_producto}</span>
        <h2 className="text-base font-semibold text-asphalt-100">{producto.nombre}</h2>
        <Badge variant={producto.estado_prod === 'ACT' ? 'success' : 'muted'}>
          {producto.estado_prod === 'ACT' ? 'Activo' : 'Inactivo'}
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button
            variant={producto.estado_prod === 'ACT' ? 'danger' : 'secondary'}
            size="sm"
            loading={toggleEstado.isPending}
            onClick={() => toggleEstado.mutate()}
          >
            {producto.estado_prod === 'ACT' ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-asphalt-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-electric-500 text-electric-400'
                : 'border-transparent text-asphalt-400 hover:text-asphalt-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
            <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-3">Detalles</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-asphalt-500">Categoría</dt><dd className="text-asphalt-200">{producto.categoria.nombre}</dd>
              <dt className="text-asphalt-500">Precio</dt><dd className="font-mono font-bold text-electric-400">${Number(producto.precio_venta).toFixed(2)}</dd>
              <dt className="text-asphalt-500 col-span-2 mt-2">Descripción corta</dt>
              <dd className="text-asphalt-300 col-span-2">{producto.descripcion_corta ?? '—'}</dd>
              <dt className="text-asphalt-500 col-span-2 mt-2">Descripción larga</dt>
              <dd className="text-asphalt-300 col-span-2 text-xs leading-relaxed">{producto.descripcion_larga ?? '—'}</dd>
            </dl>
          </div>
          <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
            <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-3">Estadísticas</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-asphalt-400">Variantes</span><span className="text-asphalt-200">{producto.variantes.length}</span></div>
              <div className="flex justify-between"><span className="text-asphalt-400">Fotos</span><span className="text-asphalt-200">{producto.fotos.length}</span></div>
              <div className="flex justify-between"><span className="text-asphalt-400">Stock total</span><span className="font-semibold text-asphalt-100">{producto.variantes.reduce((a, v) => a + v.stock, 0)}</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'variantes' && (
        <VariantesTable variantes={producto.variantes} productoId={id!} />
      )}

      {tab === 'fotos' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button size="sm" leftIcon={<Upload className="h-4 w-4" />} onClick={() => setShowUploader(true)}>
              Subir foto
            </Button>
          </div>
          <FotosGaleria fotos={producto.fotos} productoId={id!} />
          <Modal open={showUploader} onClose={() => setShowUploader(false)} title="Subir foto">
            <FotoUploader productoId={id!} onSuccess={() => { qc.invalidateQueries({ queryKey: ['productos', id] }); setShowUploader(false) }} />
          </Modal>
        </div>
      )}

      {tab === 'ia' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              leftIcon={<Cpu className="h-4 w-4" />}
              loading={generateAI.isPending}
              onClick={() => generateAI.mutate()}
            >
              Generar con IA
            </Button>
          </div>
          <AIDescripcionCard productoAi={producto.producto_ai} />
        </div>
      )}
    </div>
  )
}
