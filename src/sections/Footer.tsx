import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { footerConfig, companyInfo } from '../config';
import { 
  Instagram, 
  Facebook, 
  Music2, 
  MessageCircle,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface FooterProps {
  onNavigateLegal?: (page: 'privacy' | 'terms') => void;
}

export default function Footer({ onNavigateLegal }: FooterProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const animation = gsap.to(marquee.querySelector('.marquee-content'), {
      x: '-50%',
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <footer className="relative w-full bg-transparent" style={{ zIndex: 70 }}>
      {/* Marquee */}
      <div 
        ref={marqueeRef}
        className="overflow-hidden py-6 border-t border-white/10"
      >
        <div className="marquee-content flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-4xl lg:text-6xl font-black text-white/10 mx-4">
              {footerConfig.marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-6 lg:px-[7vw] py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl lg:text-2xl font-black mb-4">
              <span className="text-[#2563EB]">KIRA</span>{' '}
              <span className="text-white">IMPORTS</span>
            </h3>
            <p className="text-white/70 leading-relaxed mb-6 max-w-md text-sm lg:text-base">
              {footerConfig.brandDescription}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={`https://instagram.com/${companyInfo.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#E91E8C] transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href={`https://tiktok.com/@${companyInfo.social.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#00D4AA] transition-colors"
              >
                <Music2 className="w-5 h-5 text-white" />
              </a>
              <a
                href={`https://facebook.com/${companyInfo.social.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#F5C518] transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\s/g, '').replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              {footerConfig.quickLinksTitle}
            </h4>
            <ul className="space-y-3">
              {footerConfig.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              {footerConfig.contactTitle}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-[#E91E8C]" />
                <span>{companyInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-[#E91E8C]" />
                <span>{companyInfo.email}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-[#E91E8C]" />
                <span>{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>WhatsApp: {companyInfo.whatsapp}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-6 lg:px-[7vw] py-4 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {footerConfig.brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {footerConfig.bottomLinks.map((link, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onNavigateLegal?.(link.href === '#terms' ? 'terms' : 'privacy')}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
