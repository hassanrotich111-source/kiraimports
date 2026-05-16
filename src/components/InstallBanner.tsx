import { useState, useEffect, useCallback } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Check if app is already installed
  const isInstalled = useCallback(() => {
    // Standalone display mode (Android/Chrome/Edge)
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    // iOS standalone mode
    if ('standalone' in navigator && (navigator as any).standalone === true) return true;
    // Check if user permanently dismissed
    if (localStorage.getItem('kira_install_permanent') === 'true') return true;
    return false;
  }, []);

  // Check if recently dismissed (7 days)
  const isRecentlyDismissed = useCallback(() => {
    const dismissed = localStorage.getItem('kira_install_dismissed');
    if (!dismissed) return false;
    const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
    return daysSince < 7;
  }, []);

  useEffect(() => {
    // Don't do anything if already installed
    if (isInstalled()) return;
    // Don't show if recently dismissed
    if (isRecentlyDismissed()) return;

    // Listen for browser's install prompt (Chrome, Edge, Samsung, Opera)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Also listen for appinstalled event to hide banner after install
    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
      setCanInstall(false);
      localStorage.setItem('kira_install_permanent', 'true');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, isRecentlyDismissed]);

  // Direct install - browser handles the popup
  const handleDirectInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      // Installed successfully - never show again
      localStorage.setItem('kira_install_permanent', 'true');
      setShowBanner(false);
      setDeferredPrompt(null);
      setCanInstall(false);
    } else {
      // User cancelled the browser's install popup
      // Don't show again for 7 days
      handleDismiss();
    }
  };

  // Dismiss - don't show for 7 days
  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('kira_install_dismissed', Date.now().toString());
  };

  // Permanent dismiss
  const handleNeverShow = () => {
    setShowBanner(false);
    localStorage.setItem('kira_install_permanent', 'true');
  };

  const handleCloseHelp = () => {
    setShowHelpModal(false);
    localStorage.setItem('kira_install_dismissed', Date.now().toString());
  };

  // Don't render anything if installed
  if (isInstalled()) return null;

  return (
    <>
      {/* Top popup banner - ONLY shown when browser supports direct install */}
      {showBanner && canInstall && (
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
                  onClick={handleDirectInstall}
                  className="px-4 py-1.5 bg-[#E91E8C] text-white text-xs font-bold rounded-lg hover:bg-[#C41675] transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install
                </button>
              </div>

              {/* Close X */}
              <button
                onClick={handleNeverShow}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Don't ask again"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Install button - shown when install is available but banner was dismissed */}
      {!showBanner && canInstall && deferredPrompt && (
        <button
          onClick={() => setShowBanner(true)}
          className="fixed bottom-4 right-4 z-[9998] bg-[#E91E8C] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#C41675] transition-all hover:scale-105 flex items-center gap-2"
          title="Install App"
        >
          <Download className="w-5 h-5" />
          <span className="text-sm font-semibold">Install App</span>
        </button>
      )}

      {/* Help modal for Safari/iOS and other browsers without native install */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0a1f3d]/60 backdrop-blur-sm"
            onClick={handleCloseHelp}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E63AF] to-[#00BFA6] px-5 py-4 text-center relative">
              <button
                onClick={handleCloseHelp}
                className="absolute top-3 right-3 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-[#0a1f3d] mb-3">
                <img
                  src="/images/logo.jpeg"
                  alt="KIRA IMPORTS"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-white">Install KIRA IMPORTS</h2>
              <p className="text-white/80 text-sm">Add to your home screen</p>
            </div>

            {/* Device-specific instructions */}
            <div className="p-5 space-y-4">
              {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                /* iOS Safari */
                <div className="space-y-3">
                  <p className="text-sm text-[#5a6a7a] text-center">
                    Tap <strong className="text-[#0a1f3d]">Share</strong> button below, then scroll and tap <strong className="text-[#0a1f3d]">&quot;Add to Home Screen&quot;</strong>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#5a6a7a] bg-gray-50 p-3 rounded-lg">
                    <span className="text-2xl">📤</span>
                    <span>→</span>
                    <span className="text-2xl">➕</span>
                    <span>→</span>
                    <span className="font-semibold">Add</span>
                  </div>
                </div>
              ) : /Android/i.test(navigator.userAgent) ? (
                /* Android browsers that don't support beforeinstallprompt */
                <div className="space-y-3">
                  <p className="text-sm text-[#5a6a7a] text-center">
                    Tap menu (3 dots) → <strong className="text-[#0a1f3d]">&quot;Add to Home screen&quot;</strong> or <strong className="text-[#0a1f3d]">&quot;Install app&quot;</strong>
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-[#5a6a7a] bg-gray-50 p-3 rounded-lg">
                    <span className="text-2xl">⋮</span>
                    <span>→</span>
                    <span className="font-semibold">Install</span>
                  </div>
                </div>
              ) : (
                /* Desktop */
                <div className="space-y-3">
                  <p className="text-sm text-[#5a6a7a] text-center">
                    Click the <strong className="text-[#0a1f3d]">install icon</strong> in the address bar (looks like a monitor with a down arrow)
                  </p>
                  <p className="text-sm text-[#5a6a7a] text-center">
                    Or press <strong className="text-[#0a1f3d]">Ctrl+Shift+A</strong> (Chrome) / <strong className="text-[#0a1f3d]">Ctrl+Alt+A</strong> (Edge)
                  </p>
                </div>
              )}

              <button
                onClick={handleCloseHelp}
                className="w-full py-3 bg-[#E91E8C] text-white rounded-xl font-bold hover:bg-[#C41675] transition-colors"
              >
                Got it
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
