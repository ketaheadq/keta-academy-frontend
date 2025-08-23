// components/CookieConsent.tsx
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented: string | null = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = (): void => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    
    // Enable analytics/tracking here
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleDecline = (): void => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-sm">Çerez Bildirimi</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Çerezleri kullanarak deneyiminizi ve site kullanımınızı iyileştirmek için kullanıyoruz. 
            <a href="/gizlilik-politikasi" className="underline hover:text-gray-800">
              Daha fazla bilgi al
            </a>
          </p>
          
          <div className="flex gap-2">
            <Button onClick={handleAccept} size="sm" className="flex-1">
              Kabul Et
            </Button>
            <Button 
              onClick={handleDecline} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              Reddet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}