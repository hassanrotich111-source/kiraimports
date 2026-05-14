import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions for browsers that don't support beforeinstallprompt
      setShowInstructions(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 px-3 py-2 bg-[#00D4AA] text-white rounded-lg text-sm font-semibold hover:bg-[#00b894] transition-colors shadow-md"
        title="Install KIRA IMPORTS App"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {/* Instructions Modal for iOS Safari and other browsers */}
      {showInstructions && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInstructions(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#00D4AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-[#00D4AA]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1f3d] mb-2">Install KIRA IMPORTS</h3>
              <p className="text-sm text-[#5a6a7a]">Add to your home screen for quick access</p>
            </div>

            {/* iOS Safari Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-[#0a1f3d] mb-3 flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Safari_browser_logo.svg/48px-Safari_browser_logo.svg.png" alt="Safari" className="w-5 h-5" />
                iPhone / iPad (Safari)
              </h4>
              <ol className="space-y-3 text-sm text-[#5a6a7a]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#E91E8C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>Tap the <Share2 className="w-4 h-4 inline mx-1" /> Share button at the bottom</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#E91E8C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>Scroll down and tap <strong className="text-[#0a1f3d]">Add to Home Screen</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#E91E8C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Tap <strong className="text-[#0a1f3d]">Add</strong> in the top right corner</span>
                </li>
              </ol>
            </div>

            {/* Android Chrome Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-[#0a1f3d] mb-3 flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/48px-Google_Chrome_icon_%28February_2022%29.svg.png" alt="Chrome" className="w-5 h-5" />
                Android (Chrome)
              </h4>
              <ol className="space-y-3 text-sm text-[#5a6a7a]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E63AF] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>Tap the menu <strong className="text-[#0a1f3d]">(3 dots)</strong> in the top right</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E63AF] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>Tap <strong className="text-[#0a1f3d]">Add to Home Screen</strong> or <strong className="text-[#0a1f3d]">Install App</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1E63AF] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Tap <strong className="text-[#0a1f3d]">Install</strong> or <strong className="text-[#0a1f3d]">Add</strong></span>
                </li>
              </ol>
            </div>

            {/* Samsung Internet Instructions */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-[#0a1f3d] mb-3 flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-[#1428A0]" />
                Samsung Internet
              </h4>
              <ol className="space-y-3 text-sm text-[#5a6a7a]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1428A0] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>Tap the menu <strong className="text-[#0a1f3d]">(3 lines)</strong> at the bottom</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-[#1428A0] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>Tap <strong className="text-[#0a1f3d]">Add page to</strong> then <strong className="text-[#0a1f3d]">Home screen</strong></span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
