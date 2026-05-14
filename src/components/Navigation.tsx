import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, LogOut } from 'lucide-react';
import { companyInfo, websiteImages as defaultImages } from '../config';
import { getImages } from '../services/api';
import type { User as UserType } from '../App';

interface NavigationProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  user: UserType | null;
  onLogout: () => void;
}

export default function Navigation({ 
  onNavigateHome, 
  onNavigateShop, 
  user, 
  onLogout 
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [websiteImages, setWebsiteImages] = useState(defaultImages);

  // Load images from backend API
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getImages();
        setWebsiteImages(prev => ({
          ...prev,
          logo: images.logo || prev.logo,
        }));
      } catch (err) {
        console.error('Failed to load images:', err);
      }
    };
    loadImages();
    // Refresh images every 30 seconds
    const interval = setInterval(loadImages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 group"
            >
              <img 
                src={websiteImages.logo} 
                alt="KIRA IMPORTS"
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover"
              />
              <div className="block text-left">
                <span className={`text-base sm:text-lg lg:text-xl font-black tracking-tight transition-colors`}>
                  <span className="text-[#E91E8C]">KIRA</span>{' '}
                  <span className="text-[#F5C518]">IMPORTS</span>
                </span>
                <p className="hidden sm:block text-[10px] text-[#60A5FA] font-medium tracking-wider">{companyInfo.tagline}</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                  isScrolled ? 'text-[#0a1f3d]' : 'text-white'
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                  isScrolled ? 'text-[#0a1f3d]' : 'text-white'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('categories')}
                className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                  isScrolled ? 'text-[#0a1f3d]' : 'text-white'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                  isScrolled ? 'text-[#0a1f3d]' : 'text-white'
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                  isScrolled ? 'text-[#0a1f3d]' : 'text-white'
                }`}
              >
                Contact
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Shop Button */}
              <button
                onClick={onNavigateShop}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Shop</span>
              </button>

              {/* User Status */}
              {user && (
                <div className="hidden lg:flex items-center gap-2 ml-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F5C518]/20 rounded-lg">
                    <div className="w-7 h-7 bg-[#F5C518] rounded-full flex items-center justify-center">
                      <span className="text-[#0a1f3d] text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#0a1f3d] max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-[#6B7A90] hover:text-[#2563EB] transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-[#0a1f3d]' : 'text-white'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-6 py-6 space-y-2">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-lg font-medium text-[#0a1f3d] py-3 border-b border-gray-100 hover:text-[#2563EB]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-lg font-medium text-[#0a1f3d] py-3 border-b border-gray-100 hover:text-[#2563EB]"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="block w-full text-left text-lg font-medium text-[#0a1f3d] py-3 border-b border-gray-100 hover:text-[#2563EB]"
            >
              Categories
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left text-lg font-medium text-[#0a1f3d] py-3 border-b border-gray-100 hover:text-[#2563EB]"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-lg font-medium text-[#0a1f3d] py-3 border-b border-gray-100 hover:text-[#2563EB]"
            >
              Contact
            </button>

            {user && (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex items-center gap-3 text-[#0a1f3d] mb-3">
                  <div className="w-10 h-10 bg-[#F5C518] rounded-full flex items-center justify-center">
                    <span className="text-[#0a1f3d] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-[#6B7A90]">{user.phone}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-[#2563EB] font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
