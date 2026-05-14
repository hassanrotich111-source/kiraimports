import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Search, Filter, Grid3X3, List, ShoppingCart, ArrowLeft, 
  Play, Clock, Truck, X, PlusCircle
} from 'lucide-react';
import { productCategories } from '../config';
import { getImages } from '../services/api';
import type { Product } from '../App';

interface ShopProps {
  products: Product[];
  onPurchase: (product: Product) => void;
  onRequestProduct: () => void;
  onNavigateHome: () => void;
}

// Format price with Ksh and commas
function formatPrice(price: string | number | null | undefined): string {
  if (!price || price === 'null' || price === '' || price === '0' || Number(price) === 0) return '';
  const cleanStr = String(price).replace(/[Kk]sh|[,\s]/g, '');
  const num = parseFloat(cleanStr);
  if (isNaN(num) || num === 0) return '';
  return 'Ksh ' + num.toLocaleString('en-KE');
}

// Check if a shipping fee is valid (> 0)
function hasShippingFee(fee: any): boolean {
  if (!fee || fee === 'null' || fee === '' || fee === '0') return false;
  const num = Number(fee);
  return !isNaN(num) && num > 0;
}

// Get delivery time from localStorage
function getDeliveryTime(): string {
  return localStorage.getItem('kiraimports_delivery_time') || '14-21 business days';
}

// Product Detail Modal
function ProductDetailModal({ product, onClose, onPurchase }: { product: Product; onClose: () => void; onPurchase: (p: Product) => void }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"><X size={20} /></button>
        
        {/* Image/Video */}
        <div className="relative rounded-3xl overflow-hidden mb-6 bg-gray-100" style={{ borderRadius: '24px' }}>
          {showVideo && product.videoUrl ? (
            <video
              src={product.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-64 sm:h-80 object-cover"
            />
          ) : (
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="w-full h-64 sm:h-80 object-cover"
              style={{ borderRadius: '24px' }}
              loading="lazy"
            />
          )}
          {product.videoUrl && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-[#1E63AF] rounded-full flex items-center justify-center shadow-lg"
            >
              <Play size={20} className="text-white ml-1" />
            </button>
          )}
        </div>

        {/* Info */}
        <h2 className="text-2xl font-bold text-[#0B1E3C] mb-2">{product.name}</h2>
        
        <p className="text-gray-600 mb-6">{product.description}</p>

        {/* Price & Shipping */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Product Price</span>
            <span className="text-2xl font-black text-[#1E63AF]">{formatPrice(product.price)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-semibold text-[#0B1E3C]">{hasShippingFee(product.service_fee) ? formatPrice(product.service_fee) : 'Free Shipping'}</span>
          </div>
          {/* Delivery Estimate */}
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl p-3">
            <Truck size={16} />
            <span>Estimated delivery: {getDeliveryTime()}</span>
          </div>
        </div>

        <button
          onClick={() => onPurchase(product)}
          className="w-full py-4 bg-[#0B1E3C] text-white rounded-2xl font-semibold hover:bg-[#1E63AF] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Order Now
        </button>
      </div>
    </div>
  );
}

export default function Shop({ products, onPurchase, onRequestProduct, onNavigateHome }: ShopProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [shopBackground, setShopBackground] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  
  const headerRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Load shop background and reviews
  useEffect(() => {
    const loadData = async () => {
      try {
        const images = await getImages();
        if (images.shop_background) setShopBackground(images.shop_background);
      } catch (err) {
        console.error('Failed to load shop background:', err);
      }
    };
    loadData();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        const priceA = parseFloat(String(a.price).replace(/[Kk]sh|[,\s]/g, '')) || 0;
        const priceB = parseFloat(String(b.price).replace(/[Kk]sh|[,\s]/g, '')) || 0;
        return priceA - priceB;
      }
      return a.name.localeCompare(b.name);
    });
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products, sortBy]);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    
    gsap.fromTo(
      productsRef.current?.querySelectorAll('.product-card') || [],
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.2
      }
    );
  }, [filteredProducts]);

  const getCategoryName = (categoryId: string) => {
    const category = productCategories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // No review functions - reviews hidden

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-16 relative">
      {/* Shop Background */}
      {shopBackground && (
        <>
          <div 
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: `url('${shopBackground}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0a1f3d]/95 via-[#0a1f3d]/90 to-[#0a1f3d]/95" />
        </>
      )}

      {/* Header */}
      <div ref={headerRef} className="relative z-10 w-full px-6 lg:px-[7vw] py-8 lg:py-12">
        <button onClick={onNavigateHome} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-2">Our Products</h1>
            <p className="text-white/70">Browse our collection of quality products from China & USA</p>
          </div>
          <button
            onClick={onRequestProduct}
            className="flex items-center gap-2 bg-[#E91E8C] hover:bg-[#C41675] text-white px-5 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-[#E91E8C]/20 whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            Can&apos;t Find a Product?
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="relative z-10 w-full px-6 lg:px-[7vw] mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#1E63AF] transition-colors"
            />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none"
          >
            <option value="name" className="text-gray-900">Sort by Name</option>
            <option value="price" className="text-gray-900">Sort by Price</option>
            <option value="rating" className="text-gray-900">Sort by Rating</option>
          </select>
          
          {/* View Mode */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-[#1E63AF] text-white' : 'text-white/70'}`}>
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-[#1E63AF] text-white' : 'text-white/70'}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-4">
          <Filter className="w-5 h-5 text-white/50 flex-shrink-0" />
          <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-[#1E63AF] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            All
          </button>
          {productCategories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-[#1E63AF] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div ref={productsRef} className="relative z-10 w-full px-6 lg:px-[7vw]">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-white/70">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`product-card group bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${viewMode === 'list' ? 'flex' : ''}`} style={{ borderRadius: '24px' }}>
                {/* Media - Video autoplays like billboard, or image */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 lg:w-64 flex-shrink-0' : 'h-56'}`} style={{ borderRadius: '24px', margin: '8px' }}>
                  {product.videoUrl ? (
                    <video
                      src={product.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ borderRadius: '20px' }}
                    />
                  ) : (
                    <img
                      src={product.image_url || product.image || '/images/category_electronics.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ borderRadius: '20px' }}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/category_electronics.jpg'; }}
                    />
                  )}

                  {/* Video indicator badge */}
                  {product.videoUrl && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[#E91E8C] rounded-full flex items-center gap-1">
                      <Play className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wide">Video</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#0B1E3C] rounded-full">{getCategoryName(product.category)}</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E3C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderRadius: '20px' }} />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#0B1E3C] mb-1 group-hover:text-[#1E63AF] transition-colors cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    {product.name}
                  </h3>
                  
                  {/* Rating section removed */}

                  <p className="text-sm text-[#6B7A90] mb-4 line-clamp-3 flex-1">{product.description}</p>
                  
                  {/* Price & Shipping */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#6B7A90]">Product Price</p>
                        <p className="text-xl font-black text-[#1E63AF]">{formatPrice(product.price)}</p>
                      </div>
                      <button onClick={() => onPurchase(product)} className="flex items-center gap-2 px-4 py-2 bg-[#0B1E3C] text-white rounded-2xl text-sm font-medium hover:bg-[#1E63AF] transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Order</span>
                      </button>
                    </div>
                    
                    {/* Shipping Fee */}
                    {hasShippingFee(product.service_fee) && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7A90]">Shipping Fee</span>
                        <span className="text-sm font-semibold text-[#0B1E3C]">{formatPrice(product.service_fee)}</span>
                      </div>
                    )}
                    
                    {/* Delivery Estimate */}
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <Clock className="w-3 h-3" />
                      <span>Delivery: {getDeliveryTime()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onPurchase={onPurchase}
        />
      )}

      {/* Reviews hidden */}
    </div>
  );
}
