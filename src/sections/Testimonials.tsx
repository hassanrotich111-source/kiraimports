import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonialsConfig } from '../config';
import { getTestimonials } from '../services/api';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Default 4 testimonials with imageUrl support
const defaultTestimonials = [
  { name: 'James Ochieng', title: 'Retailer, Nairobi', quote: 'Kira Imports made everything feel simple—quotes were clear, delivery was on time. They\'ve become our go-to sourcing partner.', rating: 5, imageUrl: '' },
  { name: 'Amina Njoroge', title: 'Boutique Owner, Mombasa', quote: 'I\'ve worked with other agents before. This team actually follows up and solves problems fast.', rating: 5, imageUrl: '' },
  { name: 'David Kimani', title: 'E-commerce Seller', quote: 'We\'ve scaled our stock without flying to China. That\'s real value.', rating: 5, imageUrl: '' },
  { name: 'Sarah Wanjiku', title: 'Shop Owner, Kisumu', quote: 'The quality of products is always top-notch. Highly recommended!', rating: 5, imageUrl: '' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  // Load from BACKEND ONLY
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data.map((t: any) => ({
            name: t.name,
            title: t.title,
            quote: t.quote,
            rating: t.rating,
            imageUrl: t.imageUrl || t.image_url || '',
          })));
        }
      } catch (err) {
        console.error('Backend error:', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.testimonial-card'),
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
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#E91E8C] mb-3">TESTIMONIALS</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card bg-white/5 rounded-xl p-5 border border-white/10">
              <Quote className="w-6 h-6 text-[#E91E8C] mb-3" />
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/80 mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#E91E8C]/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#E91E8C]">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/50">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {testimonialsConfig.trustBadges.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xl font-bold text-[#E91E8C]">{stat.value}</p>
              <p className="text-xs text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
