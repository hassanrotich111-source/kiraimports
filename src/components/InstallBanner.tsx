import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Check if app is already installed
  const isInstalled = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if ('standalone' in navigator && (navigator as any).standalone === true) return true;
    return false;
  };

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled()) return;

    // Show banner after 2 seconds on every visit
    const showTimer = setTimeout(() => {
      if (!isInstalled()) {
        setShowBanner(true);
      }
    }, 2000);

    // Listen for browser's native install prompt (Chrome, Edge, Samsung)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Hide after successful install
    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Direct install - browser handles it
  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else {
      // For browsers without beforeinstallprompt, show help
      setShowBanner(false);
    }
  };

  // Hide banner (will show again on next visit)
  const handleDismiss = () => {
    setShowBanner(false);
  };

  // Don't render if installed
  if (isInstalled()) return null;

  return (
    <>
      {showBanner && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] p-3"
          style={{ animation: 'slideDown 0.4s ease-out' }}
        >
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              {/* App Icon */}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#0a1f3d]">
                <img
                  src="/images/logo.jpeg"
                  alt="KIRA IMPORTS"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0a1f3d] text-sm truncate">
                  Install KIRA IMPORTS
                </p>
                <p className="text-xs text-[#5a6a7a]">
                  Quick access from your home screen
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-xs font-medium text-[#5a6a7a] hover:text-[#0a1f3d] transition-colors"
                >
                  Not Now
                </button>
                <button
                  onClick={handleInstall}
                  className="px-4 py-1.5 bg-[#E91E8C] text-white text-xs font-bold rounded-lg hover:bg-[#C41675] transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install
                </button>
              </div>

              {/* Close X */}
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
