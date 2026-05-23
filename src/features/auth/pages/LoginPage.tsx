import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingBag, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { useAuthBoStore } from '@/shared/stores/authBoStore'
import { loginBackoffice } from '../api/authApi'

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})
type LoginInput = z.infer<typeof LoginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated } = useAuthBoStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/backoffice'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) })

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    navigate(returnUrl, { replace: true })
    return null
  }

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await loginBackoffice(data)
      login(result.user, result.token)
      navigate(returnUrl, { replace: true })
    } catch {
      toast.error('Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen bg-asphalt-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-electric-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-electric-500/30">
            <ShoppingBag className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-asphalt-50">VAULT 16</h1>
          <p className="text-sm text-asphalt-400 mt-1">Panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-6 shadow-2xl">
          <h2 className="text-base font-semibold text-asphalt-100 mb-5">Iniciar sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
              error={errors.email?.message}
              fullWidth
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="text-asphalt-400 hover:text-asphalt-200 transition-colors pointer-events-auto"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              fullWidth
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
              Ingresar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-asphalt-600 mt-6">
          VAULT 16 Backoffice · Acceso restringido
        </p>
      </div>
    </div>
  )
}
