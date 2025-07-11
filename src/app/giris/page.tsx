"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Chrome, Loader2, ArrowLeft, Shield, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuthStore, useAuthLoading, useAuthError } from "@/stores/auth-store"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const { signInWithGoogle, clearError } = useAuthStore()
  const isLoading = useAuthLoading()
  const error = useAuthError()
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    clearError()

    try {
      await signInWithGoogle()
    } catch (err) {
      // Error is handled in the store
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
     {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tekrar Hoşgeldiniz!</h2>
            <p className="text-gray-600">Öğrenme yolculuğunuza devam etmek için giriş yapın</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Keta Academy'ye Giriş</CardTitle>
              <CardDescription>Kurslarınıza erişin, ilerlemenizi takip edin ve öğrenmeye devam edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign-In Button */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn || isLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                variant="outline"
              >
                {isSigningIn || isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Giriş yapılıyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Chrome className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Google ile Devam Et</span>
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Neden Google Girişi?</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>Güvenli ve şifrelenmiş kimlik doğrulama</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>Şifre hatırlamadan hızlı erişim</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>İlerlemenizi tüm cihazlarda senkronize edin</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Hesabınız yok mu?{" "}
                  <Link href="/kayit-ol" className="font-medium text-blue-600 hover:text-blue-500">
                    Buradan kayıt olun
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500">
            Giriş yaparak{" "}
            <Link href="/hizmet-sartlari" className="text-blue-600 hover:text-blue-500">
              Hizmet Şartlarımızı
            </Link>{" "}
            ve{" "}
            <Link href="/gizlilik-politikasi" className="text-blue-600 hover:text-blue-500">
              Gizlilik Politikamızı
            </Link>{" "}
            kabul etmiş olursunuz
          </p>
        </div>
      </div>
    </div>
  )
}
