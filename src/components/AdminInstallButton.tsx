import { useState, useEffect } from 'react';
import { Download, CheckCircle, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AdminInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Check if already installed
  const checkInstalled = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if ('standalone' in navigator && (navigator as any).standalone === true) return true;
    return false;
  };

  useEffect(() => {
    if (checkInstalled()) {
      setInstalled(true);
      return;
    }

    // Capture the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Direct install - triggers native browser install popup
  const handleInstall = async () => {
    if (deferredPrompt) {
      // Browser supports direct install
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Browser doesn't support direct install (Safari, etc.)
      setShowHelp(true);
    }
  };

  if (installed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 font-medium text-sm">App Installed!</p>
        <p className="text-green-600 text-xs mt-1">KIRA IMPORTS is on your home screen</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleInstall}
        className="w-full py-3 bg-[#E91E8C] text-white rounded-lg font-semibold hover:bg-[#C41675] transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        <span>Install KIRA IMPORTS App</span>
      </button>

      <p className="text-xs text-gray-500 text-center">
        Installs directly to your home screen. Works on Android, iPhone, and computers.
      </p>

      {/* Help for browsers without direct install support */}
      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
          <div className="flex items-start gap-2">
            <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium text-sm mb-1">Install Manually</p>
              {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? (
                <p className="text-blue-600 text-xs">Tap <strong>Share</strong> button at bottom, then scroll and tap <strong>&quot;Add to Home Screen&quot;</strong></p>
              ) : (
                <p className="text-blue-600 text-xs">Tap <strong>menu (3 dots)</strong> at top right, then tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong></p>
              )}
              <button onClick={() => setShowHelp(false)} className="text-blue-500 text-xs mt-2 underline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
