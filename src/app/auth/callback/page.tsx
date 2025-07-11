'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const { handleAuthRedirect, error, isLoading } = useAuthStore()

  useEffect(() => {
    const processCallback = async () => {
      // Check if we have any parameters (error or success)
      const hasParams = searchParams.toString().length > 0
      
      if (!hasParams) {
        console.error('No parameters found in callback URL')
        return
      }

      // Process the authentication with all search parameters
      await handleAuthRedirect(searchParams)
    }

    processCallback()
  }, [searchParams, handleAuthRedirect])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Giriş Başarısız
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/giris'} 
                className="w-full"
              >
                Tekrar Deneyin
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Giriş Yapılıyor...
            </h2>
            <p className="text-gray-600">
              Hesabınız doğrulanıyor, lütfen bekleyin.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state (this should be brief as user gets redirected)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Giriş Başarılı!
          </h2>
          <p className="text-gray-600">
            Yönlendiriliyorsunuz...
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 