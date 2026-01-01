'use client';

import { useEffect } from 'react';
import { pwaManager } from '@/lib/pwa';

export default function PWAInit() {
  useEffect(() => {
    // PWA is automatically initialized when pwaManager is imported
    // This component serves as a client-side initialization trigger
    
    // Optional: Show notification permission request after app loads
    const requestNotificationPermission = async () => {
      // Wait a bit before asking for notifications to improve UX
      setTimeout(async () => {
        if ('Notification' in window && Notification.permission === 'default') {
          const hasPermission = await pwaManager.requestNotificationPermission();
          if (hasPermission) {
            console.log('[PWA] Notification permission granted');
            // Optionally show a welcome notification
            pwaManager.showNotification('Welcome to PollutionX!', {
              body: 'Stay updated with air quality alerts in Bhubaneswar',
              icon: '/icons/icon-192x192.png',
              tag: 'welcome',
              requireInteraction: false,
            });
          }
        }
      }, 3000); // Wait 3 seconds after page load
    };

    requestNotificationPermission();

    // Handle online/offline events
    const handleOnline = () => {
      console.log('[PWA] App is now online');
      pwaManager.showNotification('Back Online!', {
        body: 'Connection restored. Syncing latest pollution data...',
        icon: '/icons/icon-192x192.png',
        tag: 'online-status',
      });
    };

    const handleOffline = () => {
      console.log('[PWA] App is now offline');
      pwaManager.showNotification('Offline Mode', {
        body: 'You can still view cached pollution data',
        icon: '/icons/icon-192x192.png',
        tag: 'offline-status',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Additional PWA hooks for use in other components
export function usePWA() {
  return {
    isInstallable: pwaManager.isInstallable(),
    isInstalled: pwaManager.isAppInstalled(),
    promptInstall: () => pwaManager.promptInstall(),
    showNotification: (title: string, options?: NotificationOptions) => 
      pwaManager.showNotification(title, options),
  };
}
