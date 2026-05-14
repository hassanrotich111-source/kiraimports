import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Upload, X, Save, 
  Image as ImageIcon, Loader2, LogOut, Star,
  Type, Quote, Clock, Play
} from 'lucide-react';
import { gsap } from 'gsap';
import { getImages, uploadImage, getProducts, createProduct, updateProduct, deleteProduct, getTestimonials, saveTestimonials, uploadVideo } from '../services/api';
import type { Product, BackgroundSettings } from '../App';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onNavigateHome: () => void;
  onLogout?: () => void;
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: React.Dispatch<React.SetStateAction<BackgroundSettings>>;
}

// Image sections configuration
const imageSections = {
  hero: {
    title: 'Hero Section',
    description: 'Main banner images',
    images: [
      { key: 'hero_left', label: 'Left Hero Image' },
      { key: 'hero_right', label: 'Right Hero Image' },
    ]
  },
  about: {
    title: 'About Us Section',
    description: 'Gallery images for About section',
    images: [
      { key: 'sourcing_factory_line', label: 'Factory/Sourcing' },
      { key: 'quality_inspection', label: 'Quality Control' },
      { key: 'shipping_truck_road', label: 'Shipping/Delivery' },
      { key: 'service_support_desk', label: 'Customer Support' },
      { key: 'import_cargo_plane', label: 'Air Freight' },
      { key: 'sourcing_warehouse_aisle', label: 'Warehousing' },
    ]
  },
  services: {
    title: 'Our Services',
    description: 'Service card images',
    images: [
      { key: 'service_sourcing', label: 'Product Sourcing' },
      { key: 'service_verification', label: 'Supplier Verification' },
      { key: 'service_quality', label: 'Quality Control' },
      { key: 'service_shipping', label: 'Shipping & Logistics' },
      { key: 'service_delivery', label: 'Last Mile Delivery' },
      { key: 'service_support', label: 'Customer Support' },
    ]
  },
  categories: {
    title: 'Categories',
    description: 'Category card images',
    images: [
      { key: 'category_machines', label: 'Machines & Equipment' },
      { key: 'category_electronics', label: 'Electronics & Phones' },
      { key: 'category_kitchenware', label: 'Kitchenware' },
      { key: 'category_furniture', label: 'Furniture & Home' },
      { key: 'category_clothing', label: 'Clothing & Shoes' },
      { key: 'category_bags', label: 'Bags & Accessories' },
    ]
  },
  background: {
    title: 'Website Background',
    description: 'Main background image',
    images: [
      { key: 'background', label: 'Main Background' },
    ]
  },
  shop: {
    title: 'Shop Background',
    description: 'Background image for the shop page',
    images: [
      { key: 'shop_background', label: 'Shop Page Background' },
    ]
  }
};

// Default testimonials data - 4 testimonials with image support
const defaultTestimonials = [
  { id: '1', name: 'James Ochieng', title: 'Retailer, Nairobi', quote: 'Kira Imports made everything feel simple—quotes were clear, delivery was on time. They\'ve become our go-to sourcing partner.', rating: 5, imageUrl: '' },
  { id: '2', name: 'Amina Njoroge', title: 'Boutique Owner, Mombasa', quote: 'I\'ve worked with other agents before. This team actually follows up and solves problems fast. Highly recommended!', rating: 5, imageUrl: '' },
  { id: '3', name: 'David Kimani', title: 'E-commerce Seller', quote: 'We\'ve scaled our stock without flying to China. That\'s real value. KIRA IMPORTS handles everything professionally.', rating: 5, imageUrl: '' },
  { id: '4', name: 'Sarah Wanjiku', title: 'Shop Owner, Kisumu', quote: 'The quality of products is always top-notch. I highly recommend KIRA IMPORTS!', rating: 5, imageUrl: '' },
];

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

// Default hero text
const defaultHeroText = {
  headline: 'GLOBAL SOURCING',
  tagline: 'Your trusted partner for importing quality products from China & USA to Kenya',
  badge: 'China • USA → Kenya',
  ctaButton: 'Explore Products',
};

// Default about text
const defaultAboutText = {
  vision: 'To be a trusted sourcing partner that connects businesses to quality products around the world.',
  mission: 'Our mission is to make global trade simple, safe, and profitable for our clients. Through professionalism, transparency, and strong supplier networks, we help businesses grow by connecting them to the right products at the right price.',
  description: 'KIRA IMPORTS is an importation and sourcing company dedicated to helping businesses and entrepreneurs access high-quality products from international markets.\n\nWe specialize in sourcing reliable suppliers, negotiating competitive prices, and managing the importation process from purchase to delivery.',
};

// Custom Input Component with high contrast
const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false, rows = 1 }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    {rows > 1 ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
        style={{ color: '#111827', backgroundColor: '#ffffff' }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
        style={{ color: '#111827', backgroundColor: '#ffffff' }}
      />
    )}
  </div>
);

// Custom Select Component
const Select = ({ label, value, onChange, options }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-base focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
      style={{ color: '#111827', backgroundColor: '#ffffff' }}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value} style={{ color: '#111827' }}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default function AdminPanel({ 
  products, 
  setProducts, 
  onNavigateHome, 
  onLogout,
  backgroundSettings,
  setBackgroundSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'images' | 'testimonials' | 'contact' | 'text'>('products');
  const [activeImageSection, setActiveImageSection] = useState<string>('hero');
  const [authToken, setAuthToken] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<string>('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Background state
  const [bgOverlay, setBgOverlay] = useState(backgroundSettings.overlayOpacity);
  
  // Testimonials state
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<typeof defaultTestimonials[0] | null>(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  
  // Contact info state
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  
  // Hero text state
  const [heroText, setHeroText] = useState(defaultHeroText);
  
  // About text state
  const [aboutText, setAboutText] = useState(defaultAboutText);
  
  // Product state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    serviceFee: '',
    videoUrl: '',
    category: 'electronics',
    image: null as File | null,
  });
  
  const headerRef = useRef<HTMLDivElement>(null);

  // Load all data on mount
  useEffect(() => {
    const token = localStorage.getItem('kiraimports_admin_token') || '';
    setAuthToken(token);
    
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    
    // Load all data
    loadAllData();
  }, []);

  // Load all data function
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load images
      const images = await getImages();
      setSectionImages(images);
      
      // Load products from backend
      const backendProducts = await getProducts();
      if (backendProducts && backendProducts.length > 0) {
        setProducts(backendProducts);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    
    // Load testimonials from BACKEND ONLY
    try {
      const backendTestimonials = await getTestimonials();
      if (backendTestimonials && backendTestimonials.length > 0) {
        const formatted = backendTestimonials.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          title: t.title,
          quote: t.quote,
          rating: t.rating,
          imageUrl: t.imageUrl || '',
        }));
        setTestimonials(formatted);
      }
    } catch (err) {
      console.error('Backend testimonials error:', err);
    }
    
    const savedContact = localStorage.getItem('kiraimports_contact');
    if (savedContact) setContactInfo(JSON.parse(savedContact));
    
    const savedHeroText = localStorage.getItem('kiraimports_hero_text');
    if (savedHeroText) setHeroText(JSON.parse(savedHeroText));
    
    const savedAboutText = localStorage.getItem('kiraimports_about_text');
    if (savedAboutText) setAboutText(JSON.parse(savedAboutText));
    
    setIsLoading(false);
  };

  // Handle video upload for product
  const handleVideoUpload = async (file: File) => {
    setUploadingVideo(true);
    try {
      const result = await uploadVideo(file);
      setProductForm(prev => ({ ...prev, videoUrl: result.url }));
      alert('Video uploaded successfully!');
    } catch (err: any) {
      alert('Video upload failed: ' + (err.message || 'Try a smaller video (under 50MB)'));
    } finally {
      setUploadingVideo(false);
    }
  };

  // Handle image upload for any section
  const handleImageUpload = async (key: string, file: File) => {
    setUploadingImage(key);
    try {
      const result = await uploadImage(key, file, authToken);
      if (result.url) {
        setSectionImages(prev => ({ ...prev, [key]: result.url }));
        
        // Save image URL to localStorage for ALL images (testimonials, background, etc.)
        // This ensures frontend can display images even if backend /save fails
        const savedImages = JSON.parse(localStorage.getItem('kiraimports_section_images') || '{}');
        savedImages[key] = result.url;
        localStorage.setItem('kiraimports_section_images', JSON.stringify(savedImages));
        
        if (key === 'background') {
          const settings = { ...backgroundSettings, imageUrl: result.url };
          setBackgroundSettings(settings);
          localStorage.setItem('kiraimports_background', JSON.stringify(settings));
          try {
            await fetch('https://kira-imports-backend.onrender.com/api/background', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify(settings),
            });
          } catch (e) { console.log('Backend save failed'); }
        }
        alert('Image uploaded successfully!');
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Try again'));
    } finally {
      setUploadingImage('');
    }
  };

  // Save functions
  const saveContactInfo = () => {
    localStorage.setItem('kiraimports_contact', JSON.stringify(contactInfo));
    alert('Contact info saved!');
  };

  const saveHeroText = () => {
    localStorage.setItem('kiraimports_hero_text', JSON.stringify(heroText));
    alert('Hero text saved!');
  };

  const saveAboutText = () => {
    localStorage.setItem('kiraimports_about_text', JSON.stringify(aboutText));
    alert('About text saved!');
  };

  const saveBackgroundOverlay = async () => {
    const settings = { ...backgroundSettings, overlayOpacity: bgOverlay };
    setBackgroundSettings(settings);
    localStorage.setItem('kiraimports_background', JSON.stringify(settings));
    try {
      await fetch('https://kira-imports-backend.onrender.com/api/background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(settings),
      });
      alert('Background settings saved!');
    } catch (e) { alert('Saved locally'); }
  };

  // Product functions
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('service_fee', productForm.serviceFee);
    formData.append('video_url', productForm.videoUrl);
    formData.append('category', productForm.category);
    if (productForm.image) formData.append('image', productForm.image);
    
    try {
      let result: Product;
      if (editingProduct) {
        result = await updateProduct(Number(editingProduct.id), formData, authToken);
        setProducts(products.map(p => p.id === editingProduct.id ? result : p));
      } else {
        result = await createProduct(formData, authToken);
        setProducts([result, ...products]);
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', serviceFee: '', videoUrl: '', category: 'electronics', image: null });
      alert('Product saved successfully!');
    } catch (err: any) {
      alert('Failed to save: ' + (err.message || 'Backend may be sleeping. Wait 30s and try again.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(Number(id), authToken);
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + (err.message || 'Try again'));
    }
  };

  // Testimonial functions
  const handleTestimonialSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    
    const updatedTestimonials = editingTestimonial.id
      ? testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t)
      : [...testimonials, { ...editingTestimonial, id: Date.now().toString() }];
    
    setTestimonials(updatedTestimonials);
    setShowTestimonialForm(false);
    setEditingTestimonial(null);
    
    // Save to BACKEND ONLY
    try {
      await saveTestimonials(updatedTestimonials, authToken);
      alert('Saved to server!');
    } catch (err: any) {
      alert('Server error: ' + (err.message || 'Redeploy backend on Render'));
    }
  };
  
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    try {
      await saveTestimonials(updated, authToken);
    } catch (err: any) {
      alert('Delete error: ' + (err.message || 'Redeploy backend on Render'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 bg-gray-50">
      {/* Header */}
      <div ref={headerRef} className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button onClick={onNavigateHome} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Website
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage your website content and images</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mb-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm overflow-x-auto">
          {[
            { key: 'products', label: 'Products' },
            { key: 'images', label: 'Images' },
            { key: 'testimonials', label: 'Testimonials' },
            { key: 'contact', label: 'Contact Info' },
            { key: 'text', label: 'Website Text' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                activeTab === tab.key ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Products ({products.length})</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', description: '', price: '', serviceFee: '', videoUrl: '', category: 'electronics', image: null });
                setShowProductForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-100">
                  <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-pink-500 font-bold text-sm">Ksh {Number(product.price || 0).toLocaleString('en-KE')}</p>
                    {product.service_fee && Number(product.service_fee) > 0 && (
                      <p className="text-xs text-gray-500">
                        Shipping: Ksh {Number(product.service_fee).toLocaleString('en-KE')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setProductForm({
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          serviceFee: product.service_fee || '',
                          videoUrl: product.videoUrl || '',
                          category: product.category,
                          image: null,
                        });
                        setShowProductForm(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                  <button onClick={() => setShowProductForm(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleProductSubmit}>
                  <Input label="Product Name" value={productForm.name} onChange={(e: any) => setProductForm({...productForm, name: e.target.value})} required />
                  <Input label="Product Description" value={productForm.description} onChange={(e: any) => setProductForm({...productForm, description: e.target.value})} rows={3} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Product Price" value={productForm.price} onChange={(e: any) => setProductForm({...productForm, price: e.target.value})} placeholder="e.g. KSh 5,000" required />
                    <Input label="Shipping Fee" value={productForm.serviceFee} onChange={(e: any) => setProductForm({...productForm, serviceFee: e.target.value})} placeholder="e.g. KSh 500" />
                  </div>
                  <Select 
                    label="Category" 
                    value={productForm.category} 
                    onChange={(e: any) => setProductForm({...productForm, category: e.target.value})}
                    options={[
                      { value: 'electronics', label: 'Electronics' },
                      { value: 'machines', label: 'Machines & Equipment' },
                      { value: 'kitchenware', label: 'Kitchenware' },
                      { value: 'furniture', label: 'Furniture' },
                      { value: 'clothing', label: 'Clothing' },
                      { value: 'bags', label: 'Bags & Accessories' },
                    ]}
                  />
                  {/* Video Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Product Video (optional)</label>
                    
                    {/* Video Upload Button */}
                    <div className="flex items-center gap-3 mb-2">
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploadingVideo ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                        {uploadingVideo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Upload Video
                          </>
                        )}
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file);
                            e.target.value = '';
                          }}
                          disabled={uploadingVideo}
                          className="hidden"
                        />
                      </label>
                      {productForm.videoUrl && (
                        <span className="text-xs text-green-600">Video added</span>
                      )}
                    </div>
                    
                    {/* Video Preview */}
                    {productForm.videoUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden bg-black">
                        <video src={productForm.videoUrl} controls className="w-full h-32 object-cover" />
                      </div>
                    )}
                    
                    {/* Or paste URL */}
                    <input
                      type="text"
                      value={productForm.videoUrl}
                      onChange={(e: any) => setProductForm({...productForm, videoUrl: e.target.value})}
                      placeholder="Or paste video URL here"
                      className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Product Image</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setProductForm({...productForm, image: e.target.files?.[0] || null})}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingProduct ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Add Product'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IMAGES TAB */}
      {activeTab === 'images' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
                <div className="space-y-1">
                  {Object.entries(imageSections).map(([key, section]) => (
                    <button
                      key={key}
                      onClick={() => setActiveImageSection(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeImageSection === key ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{imageSections[activeImageSection as keyof typeof imageSections].title}</h2>
                  <p className="text-gray-500 text-sm">{imageSections[activeImageSection as keyof typeof imageSections].description}</p>
                </div>

                {activeImageSection === 'background' ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Current Background</label>
                      <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden border">
                        {sectionImages['background'] ? (
                          <img src={sectionImages['background']} alt="Background" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-400">No background image</span></div>
                        )}
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(10, 31, 61, ${bgOverlay/100}) 0%, rgba(5, 18, 36, ${bgOverlay/100}) 50%, rgba(2, 10, 20, ${bgOverlay/100}) 100%)` }} />
                      </div>
                    </div>
                    <ImageUploadCard label="Upload Background Image" imageUrl={sectionImages['background']} uploading={uploadingImage === 'background'} onUpload={(file: File) => handleImageUpload('background', file)} />
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Dark Overlay: {bgOverlay}%</label>
                      <input type="range" min="0" max="100" value={bgOverlay} onChange={(e) => setBgOverlay(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                      <button onClick={saveBackgroundOverlay} className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">Save Overlay Setting</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {imageSections[activeImageSection as keyof typeof imageSections].images.map(({ key, label }) => (
                      <ImageUploadCard key={key} label={label} imageUrl={sectionImages[key]} uploading={uploadingImage === key} onUpload={(file: File) => handleImageUpload(key, file)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Testimonials ({testimonials.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!confirm('Reset all testimonials to default? This will clear all photos and data.')) return;
                  setTestimonials(defaultTestimonials);
                  try { await saveTestimonials(defaultTestimonials, authToken); } catch {}
                  alert('Testimonials reset to default!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Reset All
              </button>
              <button
                onClick={() => { setEditingTestimonial({ id: '', name: '', title: '', quote: '', rating: 5, imageUrl: '' }); setShowTestimonialForm(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-start gap-3 mb-3">
                  {testimonial.imageUrl ? (
                    <img src={testimonial.imageUrl} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-pink-500">{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{testimonial.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{testimonial.title}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic mb-4 line-clamp-3">"{testimonial.quote}"</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingTestimonial(testimonial); setShowTestimonialForm(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteTestimonial(testimonial.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Form Modal */}
          {showTestimonialForm && editingTestimonial && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                  <button onClick={() => setShowTestimonialForm(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleTestimonialSave}>
                  {/* Profile Photo Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Profile Photo</label>
                    {editingTestimonial.imageUrl ? (
                      <div className="mb-3 flex items-center gap-3">
                        <img src={editingTestimonial.imageUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-pink-500" />
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial({...editingTestimonial, imageUrl: ''})}
                          className="text-sm text-red-500 hover:text-red-700 underline"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <label className={`flex items-center justify-center gap-2 w-full h-16 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploadingImage ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-500">Click to upload profile photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={!!uploadingImage}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const key = `testimonial_${editingTestimonial.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'photo'}`;
                            setUploadingImage(key);
                            try {
                              const result = await uploadImage(key, file, authToken);
                              if (result.url && editingTestimonial) {
                                setEditingTestimonial({ ...editingTestimonial, imageUrl: result.url });
                              }
                            } catch (err: any) {
                              alert('Upload failed: ' + (err.message || 'Try again'));
                            } finally {
                              setUploadingImage('');
                            }
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <Input label="Name" value={editingTestimonial.name} onChange={(e: any) => setEditingTestimonial({...editingTestimonial, name: e.target.value})} required />
                  <Input label="Title/Position" value={editingTestimonial.title} onChange={(e: any) => setEditingTestimonial({...editingTestimonial, title: e.target.value})} placeholder="e.g. Retailer, Nairobi" required />
                  <Input label="Quote" value={editingTestimonial.quote} onChange={(e: any) => setEditingTestimonial({...editingTestimonial, quote: e.target.value})} rows={4} required />
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={editingTestimonial.rating} onChange={(e) => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900" required />
                  </div>
                  <button type="submit" className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600">
                    {editingTestimonial.id ? 'Update Testimonial' : 'Add Testimonial'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTACT INFO TAB */}
      {activeTab === 'contact' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Phone" value={contactInfo.phone} onChange={(e: any) => setContactInfo({...contactInfo, phone: e.target.value})} />
                <Input label="WhatsApp" value={contactInfo.whatsapp} onChange={(e: any) => setContactInfo({...contactInfo, whatsapp: e.target.value})} />
                <Input label="Email" value={contactInfo.email} onChange={(e: any) => setContactInfo({...contactInfo, email: e.target.value})} />
                <Input label="Address" value={contactInfo.address} onChange={(e: any) => setContactInfo({...contactInfo, address: e.target.value})} />
                <Input label="Business Hours" value={contactInfo.hours} onChange={(e: any) => setContactInfo({...contactInfo, hours: e.target.value})} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Instagram" value={contactInfo.instagram} onChange={(e: any) => setContactInfo({...contactInfo, instagram: e.target.value})} placeholder="username" />
                  <Input label="TikTok" value={contactInfo.tiktok} onChange={(e: any) => setContactInfo({...contactInfo, tiktok: e.target.value})} placeholder="username" />
                  <Input label="Facebook" value={contactInfo.facebook} onChange={(e: any) => setContactInfo({...contactInfo, facebook: e.target.value})} placeholder="username" />
                </div>
              </div>

              <button onClick={saveContactInfo} className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save Contact Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEBSITE TEXT TAB */}
      {activeTab === 'text' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Hero Text */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Type className="w-5 h-5" /> Hero Section Text</h3>
              <Input label="Headline" value={heroText.headline} onChange={(e: any) => setHeroText({...heroText, headline: e.target.value})} />
              <Input label="Tagline" value={heroText.tagline} onChange={(e: any) => setHeroText({...heroText, tagline: e.target.value})} rows={2} />
              <Input label="Badge Text" value={heroText.badge} onChange={(e: any) => setHeroText({...heroText, badge: e.target.value})} />
              <Input label="CTA Button Text" value={heroText.ctaButton} onChange={(e: any) => setHeroText({...heroText, ctaButton: e.target.value})} />
              <button onClick={saveHeroText} className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Hero Text
              </button>
            </div>

            {/* About Text */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Quote className="w-5 h-5" /> About Section Text</h3>
              <Input label="Vision" value={aboutText.vision} onChange={(e: any) => setAboutText({...aboutText, vision: e.target.value})} rows={2} />
              <Input label="Mission" value={aboutText.mission} onChange={(e: any) => setAboutText({...aboutText, mission: e.target.value})} rows={3} />
              <Input label="Description" value={aboutText.description} onChange={(e: any) => setAboutText({...aboutText, description: e.target.value})} rows={5} />
              <button onClick={saveAboutText} className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save About Text
              </button>
            </div>

            {/* Delivery Time */}
            <DeliveryTimeEditor />
          </div>
        </div>
      )}
    </div>
  );
}

// Delivery Time Editor Component
function DeliveryTimeEditor() {
  const [deliveryTime, setDeliveryTime] = useState(() => {
    return localStorage.getItem('kiraimports_delivery_time') || '14-21 business days';
  });

  const saveDeliveryTime = () => {
    localStorage.setItem('kiraimports_delivery_time', deliveryTime);
    alert('Delivery time saved! It will show on all product cards.');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Delivery Time Settings</h3>
      <p className="text-sm text-gray-500 mb-4">
        This text will appear on all product cards in the shop. Customers will see this as the estimated delivery time.
      </p>
      <Input 
        label="Estimated Delivery Time" 
        value={deliveryTime} 
        onChange={(e: any) => setDeliveryTime(e.target.value)} 
        placeholder="e.g. 14-21 business days"
      />
      <button onClick={saveDeliveryTime} className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 flex items-center justify-center gap-2">
        <Save className="w-4 h-4" /> Save Delivery Time
      </button>
    </div>
  );
}

// Image Upload Card Component
function ImageUploadCard({ label, imageUrl, uploading, onUpload }: any) {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <label className="flex items-center justify-center gap-2 w-full py-2 bg-pink-500 text-white rounded-lg cursor-pointer hover:bg-pink-600 disabled:opacity-50 text-sm">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} disabled={uploading} />
      </label>
    </div>
  );
}
