import { type ReactNode, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/shared/lib/queryClient'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Dark mode: backoffice siempre en dark por defecto
  useEffect(() => {
    const saved = localStorage.getItem('vault16-bo-theme')
    if (saved === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#252A2E',
              color: '#F0F2F4',
              border: '1px solid #353C42',
              borderRadius: '8px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#16A34A', secondary: '#F0F2F4' } },
            error: { iconTheme: { primary: '#DC2626', secondary: '#F0F2F4' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
