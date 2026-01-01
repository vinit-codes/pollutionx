'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/components/PWAInit';

export default function PWAInstallButton() {
  const [showButton, setShowButton] = useState(false);
  const { isInstallable, isInstalled, promptInstall } = usePWA();

  useEffect(() => {
    // Show install button if app is installable and not already installed
    setShowButton(isInstallable && !isInstalled);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowButton(false);
    }
  };

  if (!showButton || isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-lg lg:hidden"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      Install App
    </Button>
  );
}
