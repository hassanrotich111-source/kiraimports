import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { footerConfig } from '../config';
import { useCompanySettings } from '../hooks/useCompanySettings';
import { 
  MapPin,
  Mail,
  Phone,
  Settings
} from 'lucide-react';

interface FooterProps {
  onNavigateAdmin?: () => void;
}

export default function Footer({ onNavigateAdmin }: FooterProps) {
  const { settings: companyInfo } = useCompanySettings();
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

  const handleAdminClick = () => {
    if (onNavigateAdmin) {
      onNavigateAdmin();
    }
  };

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
                href={`https://instagram.com/${companyInfo.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] transition-all"
                title="Instagram"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href={`https://tiktok.com/@${companyInfo.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-black transition-all"
                title="TikTok"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
              <a
                href={`https://facebook.com/${companyInfo.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#1877F2] transition-all"
                title="Facebook"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\s/g, '').replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#25D366] transition-all"
                title="WhatsApp"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
              <a
                key={index}
                href={link.href}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Admin Access - Bottom of page */}
      <div className="w-full py-3 bg-[#051224] border-t border-white/5">
        <div className="flex justify-center">
          <button
            onClick={handleAdminClick}
            className="flex items-center gap-2 px-3 py-1.5 text-white/20 hover:text-white/50 transition-colors text-[10px]"
            title="Admin Access"
          >
            <Settings className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
