import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Config
import { siteConfig } from './config';

// API
import { getProducts, getBackgroundSettings } from './services/api';

// Hooks
import useLenis from './hooks/useLenis';

// Components
import Navigation from './components/Navigation';
import PurchaseModal from './components/PurchaseModal';
import InstallPrompt from './components/InstallPrompt';
import RequestProductModal from './components/RequestProductModal';

// Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Categories from './sections/Categories';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Shop Page
import Shop from './sections/Shop';

// Admin
import AdminLogin from './sections/AdminLogin';
import AdminPanel from './sections/AdminPanel';

gsap.registerPlugin(ScrollTrigger);

// User type
export interface User {
  name: string;
  phone: string;
  email: string;
}

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  service_fee?: string;
  videoUrl?: string;
  category: string;
  image: string;
  image_url?: string;
}

// Background settings type
export interface BackgroundSettings {
  type: 'image' | 'color';
  imageUrl: string;
  color: string;
  overlayOpacity: number;
}

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  
  // State for routing
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'admin'>('home');
  
  // State for user authentication (optional - details collected at order time)
  const [user, setUser] = useState<User | null>(null);
  
  // State for admin authentication
  const [adminToken, setAdminToken] = useState<string | null>(null);
  
  // State for purchase
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Load admin token on mount
  useEffect(() => {
    const token = localStorage.getItem('kiraimports_admin_token');
    if (token) setAdminToken(token);
  }, []);
  
  // State for products - starts empty, admin uploads via backend
  const [products, setProducts] = useState<Product[]>([]);
  
  // State for background settings
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'image',
    imageUrl: '/images/hero_shipping_bg.jpg',
    color: '#0a1f3d',
    overlayOpacity: 85,
  });
  
  // Load products from backend on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const backendProducts = await getProducts();
        setProducts(backendProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    loadProducts();
  }, []);
  
  // Load background settings from backend
  useEffect(() => {
    const loadBackground = async () => {
      try {
        const settings = await getBackgroundSettings();
        if (settings && settings.type) {
          setBackgroundSettings(settings);
        }
      } catch (err) {
        console.error('Failed to load background from backend:', err);
        // Fallback to localStorage if backend fails
        const saved = localStorage.getItem('kiraimports_background');
        if (saved) {
          setBackgroundSettings(JSON.parse(saved));
        }
      }
    };
    loadBackground();
    
    // Refresh background every 10 seconds to sync across devices
    const interval = setInterval(loadBackground, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize smooth scroll
  useLenis();

  // Set document language and title
  useEffect(() => {
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }
    if (siteConfig.title) {
      document.title = siteConfig.title;
    }
  }, []);

  // Apply background to entire page
  useEffect(() => {
    if (backgroundSettings.type === 'color') {
      document.body.style.backgroundColor = backgroundSettings.color;
      document.body.style.backgroundImage = 'none';
    } else {
      document.body.style.backgroundColor = '#0a1f3d';
      document.body.style.backgroundImage = `url('${backgroundSettings.imageUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundRepeat = 'no-repeat';
    }
  }, [backgroundSettings]);

  // Handle navigation to shop — no registration required
  const handleNavigateToShop = () => {
    setCurrentPage('shop');
    window.scrollTo(0, 0);
  };

  // Handle purchase
  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  // Handle admin navigation
  const handleNavigateToAdmin = () => {
    setCurrentPage('admin');
    window.scrollTo(0, 0);
  };

  // Render current page
  if (currentPage === 'shop') {
    return (
      <div ref={mainRef} className="relative">
        <Navigation 
          onNavigateHome={() => setCurrentPage('home')} 
          onNavigateShop={() => {}}
          user={user}
          onLogout={() => setUser(null)}
        />
        <Shop 
          products={products}
          onPurchase={handlePurchase}
          onRequestProduct={() => setShowRequestModal(true)}
          onNavigateHome={() => setCurrentPage('home')}
        />
        {showPurchaseModal && selectedProduct && (
          <PurchaseModal
            product={selectedProduct}
            onClose={() => setShowPurchaseModal(false)}
          />
        )}
      </div>
    );
  }

  if (currentPage === 'admin') {
    // Show login if not authenticated
    if (!adminToken) {
      return (
        <AdminLogin 
          onLogin={(token) => setAdminToken(token)}
          onNavigateHome={() => setCurrentPage('home')}
        />
      );
    }
    
    return (
      <div ref={mainRef} className="relative">
        <Navigation 
          onNavigateHome={() => setCurrentPage('home')} 
          onNavigateShop={handleNavigateToShop}
          user={user}
          onLogout={() => setUser(null)}
        />
        <AdminPanel 
          products={products}
          setProducts={setProducts}
          onNavigateHome={() => setCurrentPage('home')}
          onLogout={() => {
            setAdminToken(null);
            localStorage.removeItem('kiraimports_admin_token');
          }}
          backgroundSettings={backgroundSettings}
          setBackgroundSettings={setBackgroundSettings}
        />
      </div>
    );
  }

  // Home page
  return (
    <>
      <div ref={mainRef} className="relative min-h-screen">
        {/* Global Background - Fixed for all sections */}
      {(() => {
        const opacity = backgroundSettings.overlayOpacity / 100;
        return (
          <div 
            className="fixed inset-0 z-0"
            style={{
              background: backgroundSettings.type === 'color' 
                ? backgroundSettings.color
                : `linear-gradient(135deg, rgba(10, 31, 61, ${opacity}) 0%, rgba(5, 18, 36, ${opacity}) 50%, rgba(2, 10, 20, ${opacity}) 100%), url('${backgroundSettings.imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
            }}
          />
        );
      })()}
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <Navigation 
          onNavigateHome={() => setCurrentPage('home')} 
          onNavigateShop={handleNavigateToShop}
          user={user}
          onLogout={() => setUser(null)}
        />
        
        {/* Hero Section */}
        <div id="hero">
          <Hero onShopClick={handleNavigateToShop} />
        </div>

        {/* About Section */}
        <div id="about">
          <About />
        </div>

        {/* Services Section */}
        <div id="services">
          <Services />
        </div>

        {/* Categories Section */}
        <div id="categories">
          <Categories onRequestQuote={handleNavigateToShop} />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <Testimonials />
        </div>

        {/* Contact Section */}
        <div id="contact">
          <Contact />
        </div>

        {/* Footer */}
        <div id="footer">
          <Footer onNavigateAdmin={handleNavigateToAdmin} />
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

    </div>

    {/* Request Product Modal - outside mainRef container */}
    {showRequestModal && (
      <RequestProductModal
        onClose={() => setShowRequestModal(false)}
      />
    )}

    {/* Install App Prompt */}
    <InstallPrompt />
  </>
  );
}

export default App;
