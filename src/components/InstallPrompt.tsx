import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently (show again after 7 days)
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSince = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', new Date().toISOString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] max-w-sm mx-auto">
      <div className="bg-[#0B1E3C] border border-[#1E63AF]/30 rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-slide-up">
        <div className="w-12 h-12 bg-[#1E63AF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-[#00BFA6]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Install KIRA IMPORTS App</p>
          <p className="text-white/60 text-xs">Add to home screen for quick access</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-white/50 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleInstall}
            className="bg-[#E91E8C] hover:bg-[#C41675] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
