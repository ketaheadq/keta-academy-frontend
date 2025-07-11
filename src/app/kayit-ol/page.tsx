"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Chrome, Loader2, ArrowLeft, Shield, Users, BookOpen, Star, Trophy, Target } from "lucide-react"
import Link from "next/link"
import { useAuthStore, useAuthLoading, useAuthError } from "@/stores/auth-store"

const features = [
  {
    icon: BookOpen,
    title: "1000+ Kursa Erişim",
    description: "YKS, AYT, LGS, KPSS, DGS ve daha fazlası için hazırlanmış kurslar",
    color: "text-blue-600",
  },
  {
    icon: Trophy,
    title: "İlerlemenizi Takip Edin",
    description: "Başarılar kazanın ve sertifikalar alın",
    color: "text-yellow-600",
  },
  {
    icon: Target,
    title: "Etkileşimli Quizler",
    description: "Bilginizi ilgi çekici değerlendirmelerle test edin",
    color: "text-green-600",
  },
  {
    icon: Users,
    title: "50K+ Öğrenciye Katılın",
    description: "Motive olmuş akranlarınızla birlikte öğrenin",
    color: "text-purple-600",
  },
]

export default function SignUpPage() {
  const { signInWithGoogle, clearError } = useAuthStore()
  const isLoading = useAuthLoading()
  const error = useAuthError()
  const [isSigningUp, setIsSigningUp] = useState(false)

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleGoogleSignUp = async () => {
    setIsSigningUp(true)
    clearError()

    try {
      await signInWithGoogle()
    } catch (err) {
      // Error is handled in the store
    } finally {
      setIsSigningUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">


      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Features */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-blue-600">Yeni</Badge>
                  <span className="text-sm text-gray-600">Binlerce başarılı öğrenciye katılın</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Öğrenme Yolculuğunuza Bugün Başlayın</h1>
                <p className="text-xl text-gray-600">
                  Premium kurslara erişim sağlayın, ilerlemenizi takip edin ve akademik hedeflerinize ulaşın.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                      <div className={`p-2 rounded-lg bg-gray-50`}>
                        <IconComponent className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">4.9/5</span> 50.000+ öğrenciden
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="space-y-8">
              <Card className="shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Hesabınızı Oluşturun</CardTitle>
                  <CardDescription>Keta Academy'ye katılın ve potansiyelinizi açığa çıkarın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Google Sign-Up Button */}
                  <Button
                    onClick={handleGoogleSignUp}
                    disabled={isSigningUp || isLoading}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                    variant="outline"
                  >
                    {isSigningUp || isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Hesap oluşturuluyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Chrome className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Google ile Kayıt Ol</span>
                      </div>
                    )}
                  </Button>

                  {/* Benefits */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 text-sm">Neler elde edeceksiniz:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>Temel kurslara ücretsiz erişim</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span>İlerleme takibi ve sertifikalar</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span>Topluluk erişimi ve destek</span>
                      </div>
                    </div>
                  </div>

                  {/* Sign In Link */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Zaten hesabınız var mı?{" "}
                      <Link href="/giris" className="font-medium text-blue-600 hover:text-blue-500">
                        Buradan giriş yapın
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <p className="text-center text-xs text-gray-500">
                Hesap oluşturarak{" "}
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
      </div>

    </div>
  )
}
