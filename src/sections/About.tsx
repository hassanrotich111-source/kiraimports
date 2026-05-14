import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutConfig } from '../config';
import { getImages } from '../services/api';
import { Globe, Target, TrendingUp, Users, Eye, Crosshair } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Globe, title: 'Worldwide Sourcing', description: 'Direct connections to manufacturers in China and USA' },
  { icon: Target, title: 'Quality Guaranteed', description: 'Rigorous quality checks before shipment' },
  { icon: TrendingUp, title: 'Real-time Updates', description: 'Track your orders from source to delivery' },
  { icon: Users, title: 'Stress-free Importation', description: 'We handle customs, logistics, and delivery' },
];

// Map gallery image keys
const galleryImageKeys = [
  { key: 'sourcing_factory_line', alt: 'Factory Production', label: 'Sourcing' },
  { key: 'quality_inspection', alt: 'Quality Control', label: 'Quality' },
  { key: 'shipping_truck_road', alt: 'Shipping', label: 'Delivery' },
  { key: 'service_support_desk', alt: 'Customer Support', label: 'Support' },
  { key: 'import_cargo_plane', alt: 'Air Freight', label: 'Air Freight' },
  { key: 'sourcing_warehouse_aisle', alt: 'Warehousing', label: 'Storage' },
];

// Default about text
const defaultAboutText = {
  vision: 'To be a trusted sourcing partner that connects businesses to quality products around the world.',
  mission: 'Our mission is to make global trade simple, safe, and profitable for our clients. Through professionalism, transparency, and strong supplier networks, we help businesses grow by connecting them to the right products at the right price.',
  description: 'KIRA IMPORTS is an importation and sourcing company dedicated to helping businesses and entrepreneurs access high-quality products from international markets.\n\nWe specialize in sourcing reliable suppliers, negotiating competitive prices, and managing the importation process from purchase to delivery.',
};

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [galleryImages, setGalleryImages] = useState<Record<string, string>>({});
  const [aboutText, setAboutText] = useState(defaultAboutText);

  // Load images and about text
  useEffect(() => {
    // Load custom about text from localStorage
    const saved = localStorage.getItem('kiraimports_about_text');
    if (saved) {
      try {
        setAboutText(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load about text:', e);
      }
    }

    // Load images from backend
    const loadImages = async () => {
      try {
        const images = await getImages();
        setGalleryImages({
          'sourcing_factory_line': images.sourcing_factory_line || '',
          'quality_inspection': images.quality_inspection || '',
          'shipping_truck_road': images.shipping_truck_road || '',
          'service_support_desk': images.service_support_desk || '',
          'import_cargo_plane': images.import_cargo_plane || '',
          'sourcing_warehouse_aisle': images.sourcing_warehouse_aisle || '',
        });
      } catch (err) {
        console.error('Failed to load gallery images:', err);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1,
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-transparent">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Vision & Mission */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision */}
            <div className="animate-item p-6 bg-gradient-to-br from-[#E91E8C]/20 to-[#E91E8C]/5 rounded-2xl border border-[#E91E8C]/30">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-[#E91E8C]" />
                <h3 className="text-xl font-bold text-[#E91E8C]">Vision</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {aboutText.vision}
              </p>
            </div>
            {/* Mission */}
            <div className="animate-item p-6 bg-gradient-to-br from-[#F5C518]/20 to-[#F5C518]/5 rounded-2xl border border-[#F5C518]/30">
              <div className="flex items-center gap-3 mb-4">
                <Crosshair className="w-8 h-8 text-[#F5C518]" />
                <h3 className="text-xl font-bold text-[#F5C518]">Mission</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {aboutText.mission}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="animate-item inline-block text-xs font-semibold tracking-widest uppercase text-[#E91E8C] mb-3">
            {aboutConfig.label}
          </span>
          <h2 className="animate-item text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {aboutConfig.headline}
          </h2>
          <p className="animate-item text-sm sm:text-base text-white/70 whitespace-pre-line">
            {aboutText.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="animate-item p-5 bg-white/5 rounded-xl border border-white/10">
              <feature.icon className="w-8 h-8 text-[#E91E8C] mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {aboutConfig.stats.map((stat, index) => (
            <div key={index} className="animate-item text-center p-4 bg-[#E91E8C]/10 rounded-xl">
              <p className="text-2xl lg:text-3xl font-bold text-[#E91E8C]">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Gallery Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryImageKeys.map((item, index) => {
            const imageUrl = galleryImages[item.key];
            if (!imageUrl) return null;
            
            return (
              <div key={index} className="animate-item relative h-32 overflow-hidden group" style={{ borderRadius: '24px' }}>
                <img 
                  src={imageUrl} 
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  style={{ borderRadius: '24px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3d]/80 to-transparent" style={{ borderRadius: '24px' }} />
                <div className="absolute bottom-2 left-2">
                  <span className="text-xs font-medium text-white/80">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
