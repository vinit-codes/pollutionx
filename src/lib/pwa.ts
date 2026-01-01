'use client';

// PWA utility functions for PollutionX

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Check if app is already installed
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      window.matchMedia('(display-mode: fullscreen)').matches;

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));

    // Listen for app installed event
    window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));

    // Register service worker
    this.registerServiceWorker();
  }

  private handleBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
    console.log('[PWA] Before install prompt fired');
    e.preventDefault();
    this.deferredPrompt = e;
    
    // Show install button/banner
    this.showInstallPromotion();
  }

  private handleAppInstalled() {
    console.log('[PWA] App was installed');
    this.isInstalled = true;
    this.deferredPrompt = null;
    this.hideInstallPromotion();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service Worker registered successfully');

        registration.addEventListener('updatefound', () => {
          console.log('[PWA] New service worker version found');
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New version available
                  this.showUpdateAvailable();
                }
              }
            });
          }
        });

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    console.log('[PWA] Message from service worker:', event.data);
    
    if (event.data.type === 'CACHE_UPDATED') {
      this.showUpdateAvailable();
    }
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('[PWA] No deferred prompt available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('[PWA] User choice:', outcome);
      
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return false;
    }
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  private showInstallPromotion() {
    // Create install banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
    
    banner.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <div>
          <div class="font-semibold">Install PollutionX</div>
          <div class="text-sm opacity-90">Get the app for better performance</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="pwa-install-button" class="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors">
          Install
        </button>
        <button id="pwa-dismiss-button" class="text-white hover:text-blue-200 p-2">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    const installButton = document.getElementById('pwa-install-button');
    const dismissButton = document.getElementById('pwa-dismiss-button');

    if (installButton) {
      installButton.addEventListener('click', () => {
        this.promptInstall();
        this.hideInstallPromotion();
      });
    }

    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        this.hideInstallPromotion();
      });
    }
  }

  private hideInstallPromotion() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private showUpdateAvailable() {
    // Create update banner
    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.className = 'fixed top-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
    
    banner.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <div>
          <div class="font-semibold">Update Available</div>
          <div class="text-sm opacity-90">New features and improvements</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="pwa-update-button" class="bg-white text-green-600 px-4 py-2 rounded font-medium hover:bg-green-50 transition-colors">
          Update
        </button>
        <button id="pwa-update-dismiss-button" class="text-white hover:text-green-200 p-2">
          ✕
        </button>
      </div>
    `;

    // Remove existing update banner
    const existingBanner = document.getElementById('pwa-update-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    document.body.appendChild(banner);

    // Add event listeners
    const updateButton = document.getElementById('pwa-update-button');
    const dismissButton = document.getElementById('pwa-update-dismiss-button');

    if (updateButton) {
      updateButton.addEventListener('click', () => {
        window.location.reload();
      });
    }

    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        banner.remove();
      });
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  public async showNotification(title: string, options: NotificationOptions = {}) {
    if (!await this.requestNotificationPermission()) {
      console.log('[PWA] Notification permission denied');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Use service worker to show persistent notification
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options: defaultOptions
      });
    } else {
      // Fallback to regular notification
      new Notification(title, defaultOptions);
    }
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// Utility functions
export const installPWA = () => pwaManager.promptInstall();
export const isPWAInstallable = () => pwaManager.isInstallable();
export const isPWAInstalled = () => pwaManager.isAppInstalled();
export const showPWANotification = (title: string, options?: NotificationOptions) => 
  pwaManager.showNotification(title, options);
