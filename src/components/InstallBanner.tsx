import { useState, useEffect } from 'react';
import { X, Download, Share2, Plus, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently (24 hours)
    const dismissed = localStorage.getItem('kira_install_dismissed');
    if (dismissed) {
      const hoursSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60);
      if (hoursSince < 24) return;
    }

    // Listen for install prompt (Chrome/Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS or if no beforeinstallprompt, show banner after delay
    const timer = setTimeout(() => {
      if (!isInstalled && !dismissed) {
        setShowBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android/Chrome - use native install
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS - show instructions modal
      setShowIosModal(true);
      setShowBanner(false);
    } else {
      // Other browsers - try to trigger install or show instructions
      setShowIosModal(true);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('kira_install_dismissed', Date.now().toString());
  };

  const handleCloseIos = () => {
    setShowIosModal(false);
    localStorage.setItem('kira_install_dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isInstalled) return null;

  return (
    <>
      {/* Auto-popup banner at top */}
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
                  src="/kiraimports/images/logo.jpeg"
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
                  Add to your home screen for quick access
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

      {/* Floating bottom install button */}
      {!showBanner && !showIosModal && (
        <button
          onClick={() => setShowBanner(true)}
          className="fixed bottom-4 right-4 z-[9998] bg-[#E91E8C] text-white p-3 rounded-full shadow-lg hover:bg-[#C41675] transition-all hover:scale-110 flex items-center gap-2 pr-4"
          title="Install App"
        >
          <Download className="w-5 h-5" />
          <span className="text-sm font-semibold">Install</span>
        </button>
      )}

      {/* iOS Install Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0a1f3d]/60 backdrop-blur-sm"
            onClick={handleCloseIos}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E63AF] to-[#00BFA6] px-5 py-4 text-center">
              <button
                onClick={handleCloseIos}
                className="absolute top-3 right-3 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-[#0a1f3d] mb-3">
                <img
                  src="/kiraimports/images/logo.jpeg"
                  alt="KIRA IMPORTS"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-white">Install KIRA IMPORTS</h2>
              <p className="text-white/80 text-sm">Add to your home screen</p>
            </div>

            {/* Instructions */}
            <div className="p-5 space-y-4">
              {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#E91E8C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-4 h-4 text-[#E91E8C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a1f3d] text-sm">Step 1</p>
                      <p className="text-[#5a6a7a] text-sm">Tap the <strong>Share</strong> button in Safari</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#E91E8C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4 text-[#E91E8C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a1f3d] text-sm">Step 2</p>
                      <p className="text-[#5a6a7a] text-sm">Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#E91E8C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-4 h-4 text-[#E91E8C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a1f3d] text-sm">Chrome / Android</p>
                      <p className="text-[#5a6a7a] text-sm">Tap the menu (3 dots) → <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#E91E8C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-4 h-4 text-[#E91E8C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a1f3d] text-sm">Samsung Internet</p>
                      <p className="text-[#5a6a7a] text-sm">Tap menu → <strong>&quot;Add page to&quot;</strong> → <strong>&quot;Home screen&quot;</strong></p>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleCloseIos}
                className="w-full py-3 bg-[#E91E8C] text-white rounded-xl font-bold hover:bg-[#C41675] transition-colors"
              >
                Got it!
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
