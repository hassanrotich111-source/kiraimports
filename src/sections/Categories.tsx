import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collectionsConfig } from '../config';
import { getImages } from '../services/api';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CategoriesProps {
  onRequestQuote: () => void;
}

// Map collection IDs to image keys (collections use numeric IDs 1-6)
const categoryImageKeys: Record<number, string> = {
  1: 'category_machines',
  2: 'category_electronics',
  3: 'category_kitchenware',
  4: 'category_furniture',
  5: 'category_clothing',
  6: 'category_bags',
};

export default function Categories({ onRequestQuote }: CategoriesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  // Load images from backend
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getImages();
        console.log('Loaded images from backend:', images);
        setCategoryImages({
          'category_machines': images.category_machines || '',
          'category_electronics': images.category_electronics || '',
          'category_kitchenware': images.category_kitchenware || '',
          'category_furniture': images.category_furniture || '',
          'category_clothing': images.category_clothing || '',
          'category_bags': images.category_bags || '',
        });
      } catch (err) {
        console.error('Failed to load category images:', err);
      }
    };
    loadImages();
    // Refresh images every 10 seconds
    const interval = setInterval(loadImages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.category-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08,
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-transparent">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#E91E8C] mb-3">{collectionsConfig.label}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{collectionsConfig.headline}</h2>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">Browse our categories and request a quote for any items you need.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionsConfig.collections.map((collection) => {
            const imageKey = categoryImageKeys[collection.id] || '';
            const uploadedImage = categoryImages[imageKey];
            const hasImage = uploadedImage && uploadedImage.trim() !== '';
            
            console.log(`Collection ${collection.id} (${collection.title}): imageKey=${imageKey}, hasImage=${hasImage}, url=${uploadedImage?.substring(0, 50)}...`);
            
            return (
            <div key={collection.id} className="category-card group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#E91E8C]/50 transition-all">
              <div className="relative h-44 overflow-hidden">
                {hasImage ? (
                  <img 
                    src={uploadedImage} 
                    alt={collection.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      console.error(`Failed to load image for ${collection.title}:`, uploadedImage);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a3a6a] to-[#0a1f3d] flex items-center justify-center">
                    <span className="text-4xl opacity-30">📦</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3d] via-[#0a1f3d]/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur text-xs font-medium text-white rounded">{collection.year}</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-lg font-bold text-white">{collection.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-white/60 mb-3">{collection.description}</p>
                <button onClick={onRequestQuote} className="flex items-center gap-1 text-xs font-medium text-[#E91E8C] hover:text-white transition-colors">
                  <span>{collectionsConfig.ctaText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
