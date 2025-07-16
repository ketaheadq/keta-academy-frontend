"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Settings, Shield } from "lucide-react"

interface PermissionWarningProps {
  contentType: string
  endpoint?: string
}

export default function PermissionWarning({ 
  contentType, 
  endpoint 
}: PermissionWarningProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">
          İçerik Yüklenemedi - İzin Hatası
        </AlertTitle>
        <AlertDescription className="text-orange-700 space-y-3">
          <p>
            <strong>{contentType}</strong> içeriği yüklenemiyor. Bu sorun genellikle Strapi yönetim panelinde 
            gerekli izinlerin ayarlanmamış olmasından kaynaklanır.
          </p>
          
          <div className="bg-white p-3 rounded border border-orange-200">
            <h4 className="font-semibold mb-2 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Çözüm Adımları:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Strapi yönetim paneline giriş yapın</li>
              <li><Badge variant="outline">Settings → Roles → Public</Badge> bölümüne gidin</li>
              <li><strong>{contentType}</strong> koleksiyonu için <Badge className="bg-green-500">find</Badge> iznini etkinleştirin</li>
              <li>Değişiklikleri kaydedin ve sayfayı yeniden yükleyin</li>
            </ol>
          </div>

          {endpoint && (
            <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded">
              <strong>Endpoint:</strong> <code className="bg-white px-1 rounded">{endpoint}</code>
            </div>
          )}
          
          <p className="text-sm">
            <Shield className="h-4 w-4 inline mr-1" />
            Bu mesaj yalnızca geliştirme aşamasında görüntülenir.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
} 