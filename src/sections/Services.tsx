import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Factory, ClipboardCheck, Ship, Truck, Headphones } from 'lucide-react';
import { getImages } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const serviceList = [
  { key: 'service_sourcing', icon: Search, title: 'Product Sourcing', description: 'Connect to verified manufacturers in China and USA.', defaultImage: '/images/sourcing_factory_line.jpg' },
  { key: 'service_verification', icon: Factory, title: 'Supplier Verification', description: 'Thorough background checks and factory audits.', defaultImage: '/images/quality_inspection.jpg' },
  { key: 'service_quality', icon: ClipboardCheck, title: 'Quality Control', description: 'Rigorous inspections at every stage.', defaultImage: '/images/quality_packaging.jpg' },
  { key: 'service_shipping', icon: Ship, title: 'Shipping & Logistics', description: 'Sea and air freight with customs clearance.', defaultImage: '/images/import_cargo_plane.jpg' },
  { key: 'service_delivery', icon: Truck, title: 'Last Mile Delivery', description: 'Reliable delivery anywhere in Kenya.', defaultImage: '/images/shipping_truck_road.jpg' },
  { key: 'service_support', icon: Headphones, title: 'Customer Support', description: 'Dedicated support throughout the process.', defaultImage: '/images/service_support_desk.jpg' },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});

  // Load images from backend
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getImages();
        setServiceImages({
          'service_sourcing': images.service_sourcing || '',
          'service_verification': images.service_verification || '',
          'service_quality': images.service_quality || '',
          'service_shipping': images.service_shipping || '',
          'service_delivery': images.service_delivery || '',
          'service_support': images.service_support || '',
        });
      } catch (err) {
        console.error('Failed to load service images:', err);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.service-card'),
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
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#E91E8C] mb-3">OUR SERVICES</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">How We Help You Import</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceList.map((service, index) => {
            const imageUrl = serviceImages[service.key] || service.defaultImage;
            
            return (
              <div key={index} className="service-card group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#E91E8C]/50 transition-colors">
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = service.defaultImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3d] to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 bg-[#E91E8C] rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-xs text-white/60">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
