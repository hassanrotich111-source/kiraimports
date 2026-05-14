import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { visitConfig, companyInfo } from '../config';
import { Phone, Mail, Clock, MapPin, Send, Instagram, Facebook, Music2, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Default contact info
const defaultContactInfo = {
  phone: '+254792821836',
  whatsapp: '+254792821836',
  email: 'kiraimports6@gmail.com',
  address: 'Nairobi, Kenya',
  hours: 'Mon–Sat, 8:00–18:00 EAT',
  instagram: 'kiraimports',
  tiktok: 'kiraimports',
  facebook: 'kiraimports',
};

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', productInterest: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  useEffect(() => {
    // Load custom contact info from localStorage
    const saved = localStorage.getItem('kiraimports_contact');
    if (saved) {
      try {
        setContactInfo(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load contact info:', e);
      }
    }

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
      window.location.href = `mailto:${companyInfo.email}?subject=${encodeURIComponent(`New Inquiry from ${formData.name}`)}&body=${encodeURIComponent(message)}`;
      
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
              <div className="flex gap-2">
                <a href={`https://instagram.com/${contactInfo.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#E91E8C] transition-colors">
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <a href={`https://tiktok.com/@${contactInfo.tiktok}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00D4AA] transition-colors">
                  <Music2 className="w-4 h-4 text-white" />
                </a>
                <a href={`https://facebook.com/${contactInfo.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#F5C518] transition-colors">
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-4 h-4 text-white" />
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
