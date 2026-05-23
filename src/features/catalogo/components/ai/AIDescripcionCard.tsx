import { Cpu } from 'lucide-react'

interface AIDescripcionCardProps {
  productoAi: { descripcion_generada: string | null; embedding_generado: boolean } | null
}

export function AIDescripcionCard({ productoAi }: AIDescripcionCardProps) {
  if (!productoAi || !productoAi.descripcion_generada) {
    return (
      <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-6 text-center">
        <Cpu className="h-8 w-8 text-asphalt-600 mx-auto mb-3" aria-hidden="true" />
        <p className="text-sm text-asphalt-400">No se ha generado contenido IA para este producto.</p>
        <p className="text-xs text-asphalt-600 mt-1">Usa el botón "Generar con IA" para crear descripción y embedding.</p>
      </div>
    )
  }

  return (
    <div className="bg-asphalt-800 border border-electric-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="h-4 w-4 text-electric-400" aria-hidden="true" />
        <p className="text-sm font-semibold text-asphalt-200">Descripción generada por IA</p>
        {productoAi.embedding_generado && (
          <span className="ml-auto text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Embedding listo</span>
        )}
      </div>
      <p className="text-sm text-asphalt-300 leading-relaxed whitespace-pre-wrap">
        {productoAi.descripcion_generada}
      </p>
    </div>
  )
}
