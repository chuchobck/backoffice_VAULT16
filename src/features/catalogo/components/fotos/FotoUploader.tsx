import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Upload, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/shared/components/ui/Button'
import { uploadFoto } from '../../api/catalogoApi'

interface FotoUploaderProps {
  productoId: string
  onSuccess: () => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5

export function FotoUploader({ productoId, onSuccess }: FotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const uploadM = useMutation({
    mutationFn: (f: File) => uploadFoto(productoId, f),
    onSuccess: () => { toast.success('Foto subida'); onSuccess() },
    onError: () => toast.error('Error al subir foto'),
  })

  const handleFile = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error('Solo JPG, PNG o WebP')
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Máximo ${MAX_SIZE_MB} MB`)
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          dragOver ? 'border-electric-500 bg-electric-500/5' : 'border-asphalt-600 hover:border-asphalt-500'
        }`}
        role="button"
        aria-label="Arrastra o haz clic para seleccionar foto"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
      >
        {preview ? (
          <img src={preview} alt="Vista previa" className="max-h-40 rounded object-cover" />
        ) : (
          <>
            <ImagePlus className="h-10 w-10 text-asphalt-600" aria-hidden="true" />
            <p className="text-sm text-asphalt-400 text-center">
              Arrastra una imagen aquí o <span className="text-electric-400">haz clic</span>
            </p>
            <p className="text-xs text-asphalt-600">JPG, PNG, WebP · máx. {MAX_SIZE_MB} MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          aria-hidden="true"
        />
      </div>

      {file && (
        <Button
          leftIcon={<Upload className="h-4 w-4" />}
          loading={uploadM.isPending}
          onClick={() => uploadM.mutate(file)}
          fullWidth
        >
          Subir foto
        </Button>
      )}
    </div>
  )
}
