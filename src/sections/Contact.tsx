import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { visitConfig } from '../config';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { useCompanySettings } from '../hooks/useCompanySettings';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', productInterest: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { settings: contactInfo } = useCompanySettings();

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

  const whatsappNumber = contactInfo.whatsapp.replace(/\s/g, '').replace('+', '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      const message = `*NEW INQUIRY FROM KIRA IMPORTS WEBSITE*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Product Interest:* ${formData.productInterest}\n*Message:* ${formData.message}\n\nPlease contact me.`;
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`New Inquiry from ${formData.name}`)}&body=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', productInterest: '', message: '' });
      }, 3000);
    }, 1000);
  };

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-transparent">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Content */}
          <div>
            <span className="animate-item inline-block text-xs font-semibold tracking-widest uppercase text-[#E91E8C] mb-3">{visitConfig.label}</span>
            <h2 className="animate-item text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{visitConfig.headline}</h2>
            <p className="animate-item text-sm text-white/60 mb-8">{visitConfig.description}</p>

            <div className="space-y-3 mb-8">
              <div className="animate-item flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-[#E91E8C]/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#E91E8C]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Phone</p>
                  <p className="text-sm text-white">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="animate-item flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-[#E91E8C]/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#E91E8C]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Email</p>
                  <p className="text-sm text-white">{contactInfo.email}</p>
                </div>
              </div>
              <div className="animate-item flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-[#E91E8C]/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#E91E8C]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Address</p>
                  <p className="text-sm text-white">{contactInfo.address}</p>
                </div>
              </div>
              <div className="animate-item flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-10 h-10 bg-[#E91E8C]/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#E91E8C]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Business Hours</p>
                  <p className="text-sm text-white">{contactInfo.hours}</p>
                </div>
              </div>
            </div>

            <div className="animate-item">
              <p className="text-xs text-white/50 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href={contactInfo.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] transition-all" title="Instagram">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href={contactInfo.tiktok || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-black transition-all" title="TikTok">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </a>
                <a href={contactInfo.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#1877F2] transition-all" title="Facebook">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#25D366] transition-all" title="WhatsApp">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-item bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Send Us a Message</h3>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Message Sent!</h4>
                <p className="text-sm text-white/60">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Your Name" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#E91E8C]" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="Email Address" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#E91E8C]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required placeholder="Phone Number" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#E91E8C]" />
                  <select value={formData.productInterest} onChange={(e) => setFormData({...formData, productInterest: e.target.value})} required className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E91E8C] appearance-none">
                    <option value="" className="bg-[#0a1f3d]">Select category</option>
                    <option value="machines" className="bg-[#0a1f3d]">Machines & Equipment</option>
                    <option value="electronics" className="bg-[#0a1f3d]">Electronics & Phones</option>
                    <option value="kitchenware" className="bg-[#0a1f3d]">Kitchenware</option>
                    <option value="furniture" className="bg-[#0a1f3d]">Furniture & Home</option>
                    <option value="clothing" className="bg-[#0a1f3d]">Clothing & Shoes</option>
                    <option value="bags" className="bg-[#0a1f3d]">Bags & Accessories</option>
                    <option value="other" className="bg-[#0a1f3d]">Other</option>
                  </select>
                </div>
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={3} placeholder="Tell us what products you're looking for..." className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#E91E8C] resize-none" />
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#E91E8C] text-white rounded-lg text-sm font-medium hover:bg-[#C41675] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /><span>{visitConfig.ctaText}</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
