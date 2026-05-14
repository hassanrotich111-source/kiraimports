import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { websiteImages as defaultImages } from '../config';
import { getImages } from '../services/api';

interface HeroProps {
  onShopClick: () => void;
}

// Default hero text
const defaultHeroText = {
  headline: 'GLOBAL SOURCING',
  tagline: 'Your trusted partner for importing quality products from China & USA to Kenya',
  badge: 'China • USA → Kenya',
  ctaButton: 'Explore Products',
};

export default function Hero({ onShopClick }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [websiteImages, setWebsiteImages] = useState(defaultImages);
  const [heroText, setHeroText] = useState(defaultHeroText);

  // Load images and hero text
  useEffect(() => {
    // Load custom hero text from localStorage
    const saved = localStorage.getItem('kiraimports_hero_text');
    if (saved) {
      try {
        setHeroText(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load hero text:', e);
      }
    }

    // Load images from backend API
    const loadImages = async () => {
      try {
        const images = await getImages();
        setWebsiteImages(prev => ({
          ...prev,
          logo: images.logo || prev.logo,
          hero: {
            leftCard: images.hero_left || prev.hero.leftCard,
            rightCard: images.hero_right || prev.hero.rightCard,
          }
        }));
      } catch (err) {
        console.error('Failed to load images:', err);
      }
    };
    loadImages();
    const interval = setInterval(loadImages, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-transparent"
    >
      {/* Content */}
      <div className="relative z-10 min-h-screen w-full px-4 sm:px-6 lg:px-12 pt-20 lg:pt-24 pb-24 flex flex-col items-center justify-center">
        
        {/* Logo - Top - No Border */}
        <div className="flex items-center justify-center gap-5 mb-8">
          <img 
            src={websiteImages.logo} 
            alt="KIRA IMPORTS"
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black">
              <span className="text-[#E91E8C]">KIRA</span>{' '}
              <span className="text-[#F5C518]">IMPORTS</span>
            </p>
            <p className="text-xs sm:text-sm text-[#60A5FA] font-medium tracking-wider">{heroText.badge}</p>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
            <span className="text-[#E91E8C]">{heroText.headline.split(' ')[0]}</span>{' '}
            <span className="text-[#F5C518]">{heroText.headline.split(' ')[1] || ''}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#60A5FA] max-w-md mx-auto">
            {heroText.tagline}
          </p>
        </div>

        {/* Image Cards - Only show if images uploaded */}
        {(websiteImages.hero.leftCard || websiteImages.hero.rightCard) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-8">
            {websiteImages.hero.leftCard && (
              <div className="w-full sm:w-64 lg:w-80 h-40 sm:h-48">
                <div className="relative w-full h-full overflow-hidden border border-white/10" style={{ borderRadius: '24px' }}>
                  <img src={websiteImages.hero.leftCard} alt="Shipping" className="w-full h-full object-cover" loading="lazy" style={{ borderRadius: '24px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" style={{ borderRadius: '24px' }} />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs text-[#00D4AA]">FROM CHINA</p>
                    <p className="text-sm font-semibold">Sea & Air Freight</p>
                  </div>
                </div>
              </div>
            )}

            {websiteImages.hero.rightCard && (
              <div className="w-full sm:w-64 lg:w-80 h-40 sm:h-48">
                <div className="relative w-full h-full overflow-hidden border border-white/10" style={{ borderRadius: '24px' }}>
                  <img src={websiteImages.hero.rightCard} alt="Business" className="w-full h-full object-cover" loading="lazy" style={{ borderRadius: '24px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" style={{ borderRadius: '24px' }} />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs text-[#F5C518]">FROM USA</p>
                    <p className="text-sm font-semibold">Premium Quality</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={onShopClick}
            className="flex items-center gap-2 px-6 py-3 bg-[#E91E8C] text-white rounded-full text-sm font-medium hover:bg-[#C41675] transition-colors"
          >
            <span>{heroText.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
