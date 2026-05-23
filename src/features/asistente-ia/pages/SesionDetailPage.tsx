import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Bot, User } from 'lucide-react'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { getSesion } from '../api/asistenteIAApi'
import { LinkButton } from '@/shared/components/ui/LinkButton'

export function SesionDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: sesion, isLoading } = useQuery({
    queryKey: ['sesion-ia', id],
    queryFn: () => getSesion(id!),
    enabled: !!id,
  })

  if (isLoading) return <PageSpinner />
  if (!sesion) return <p className="text-asphalt-400">Sesión no encontrada</p>

  return (
    <div className="flex flex-col gap-5 max-w-[800px]">
      <div className="flex items-center gap-3">
        <LinkButton to="/backoffice/asistente-ia/sesiones" variant="ghost" size="icon" aria-label="Volver"><ArrowLeft className="h-4 w-4" /></LinkButton>
        <div>
          <p className="text-sm font-semibold text-asphalt-100">
            {sesion.cliente ? `${sesion.cliente.nombre1} ${sesion.cliente.apellido1}` : 'Cliente anónimo'}
          </p>
          <p className="text-xs text-asphalt-500">{format(new Date(sesion.fecha_inicio), 'dd MMM yyyy HH:mm', { locale: es })}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sesion.mensajes.map((m) => (
          <div key={m.id_mensaje} className={`flex gap-3 ${m.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.rol === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-electric-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-3.5 w-3.5 text-electric-400" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm ${m.rol === 'user' ? 'bg-electric-600/20 text-electric-100 ml-auto' : 'bg-asphalt-700 text-asphalt-200'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.contenido}</p>
              <p className="text-[10px] mt-1 opacity-50">{format(new Date(m.fecha), 'HH:mm', { locale: es })}{m.tokens_usados ? ` · ${m.tokens_usados} tokens` : ''}</p>
            </div>
            {m.rol === 'user' && (
              <div className="w-7 h-7 rounded-full bg-asphalt-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-3.5 w-3.5 text-asphalt-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
