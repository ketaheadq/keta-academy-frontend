"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Share,
  Copy,
  X
} from "lucide-react"

interface ShareButtonProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function ShareButton({ url, title, description, className }: ShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleShareWhatsApp = () => {
    const text = `${title} - ${description || ''}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShareTwitter = () => {
    const text = `${title} - ${description || ''}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank')
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowShareModal(true)}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Share className="h-4 w-4" />
        <span>Paylaş</span>
      </Button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Paylaş</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
                {description && <p className="text-xs text-gray-600">{description}</p>}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2"
                  variant={copySuccess ? "secondary" : "default"}
                >
                  <Copy className="h-4 w-4" />
                  <span>{copySuccess ? "Kopyalandı!" : "Linki Kopyala"}</span>
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="flex flex-col items-center space-y-1 h-16"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <span className="text-xs">WhatsApp</span>
                  </Button>

                  <Button
                    onClick={handleShareTwitter}
                    variant="outline"
                    className="flex flex-col items-center space-y-1 h-16"
                  >
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <span className="text-xs">Twitter</span>
                  </Button>

                  <Button
                    onClick={handleShareFacebook}
                    variant="outline"
                    className="flex flex-col items-center space-y-1 h-16"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">F</span>
                    </div>
                    <span className="text-xs">Facebook</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 