import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/shared/components/ui/Button'
import { deleteFoto, type Foto } from '../../api/catalogoApi'

interface FotosGaleriaProps {
  fotos: Foto[]
  productoId: string
}

export function FotosGaleria({ fotos, productoId }: FotosGaleriaProps) {
  const qc = useQueryClient()

  const deleteM = useMutation({
    mutationFn: (id: number) => deleteFoto(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['productos', productoId] }); toast.success('Foto eliminada') },
    onError: () => toast.error('Error al eliminar foto'),
  })

  if (fotos.length === 0) {
    return <p className="text-sm text-asphalt-500 text-center py-8">Sin fotos — sube la primera</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {fotos
        .sort((a, b) => a.orden - b.orden)
        .map((foto) => (
          <div key={foto.id_foto} className="relative group rounded-lg overflow-hidden border border-asphalt-700 aspect-square bg-asphalt-800">
            <img
              src={foto.url_foto}
              alt="Foto del producto"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {foto.es_principal && (
              <div className="absolute top-2 left-2">
                <span className="flex items-center gap-1 bg-electric-500/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                  <Star className="h-2.5 w-2.5" /> Principal
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="danger"
                size="icon"
                aria-label="Eliminar foto"
                loading={deleteM.isPending}
                onClick={() => deleteM.mutate(foto.id_foto)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}
