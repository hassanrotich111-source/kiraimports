import { useState } from 'react';
import { X, ShoppingCart, MessageCircle, Mail, Minus, Plus, CheckCircle, Copy, User, Phone } from 'lucide-react';
import type { Product } from '../App';
import { companyInfo } from '../config';

interface PurchaseModalProps {
  product: Product;
  onClose: () => void;
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  // Order fields (existing)
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Customer details fields (Name + Phone only)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});

  const [showCopied, setShowCopied] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Validate customer details
  const validateCustomerDetails = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.name = 'Please enter your name';
    if (!customerPhone.trim()) errors.phone = 'Please enter your phone number';
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format WhatsApp number
  const whatsappNumber = companyInfo.whatsapp.replace(/\s/g, '').replace('+', '');

  // Format price helper
  const formatPrice = (price: string | number | null | undefined): string => {
    if (!price || price === 'null' || price === '' || price === '0' || Number(price) === 0) return '';
    const num = typeof price === 'string' ? parseFloat(price.toString().replace(/[Kk]sh|[,\s]/g, '')) : Number(price);
    if (isNaN(num) || num === 0) return '';
    return 'Ksh ' + num.toLocaleString('en-KE');
  };

  // Generate order message
  const generateOrderMessage = () => {
    const productPrice = formatPrice(product.price);
    const shippingFee = formatPrice(product.service_fee);

    let message = `*NEW ORDER FROM KIRA IMPORTS WEBSITE*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n\n` +
      `*Product Details:*\n` +
      `Product: ${product.name}\n` +
      `Product Price: ${productPrice}\n`;

    if (shippingFee) {
      message += `Shipping Fee: ${shippingFee}\n`;
    }

    message += `Quantity: ${quantity}\n` +
      `Notes: ${notes || 'None'}\n\n` +
      `Please contact me to confirm this order.`;

    return message;
  };

  // Direct WhatsApp purchase
  const handleWhatsAppDirect = () => {
    if (!validateCustomerDetails()) return;

    const message = generateOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      if (confirm('WhatsApp could not open automatically. Copy message to clipboard?')) {
        copyToClipboard(message);
      }
    }
    setOrderSent(true);
  };

  // Send Order via Email
  const handleEmailOrder = () => {
    if (!validateCustomerDetails()) return;

    const message = generateOrderMessage();
    const subject = encodeURIComponent(`New Order - ${product.name} from ${customerName}`);
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    setOrderSent(true);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  // If order was sent, show confirmation
  if (orderSent) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#0a1f3d]/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0a1f3d] mb-2">Order Request Sent!</h2>
          <p className="text-[#5a6a7a] mb-4">Thank you {customerName}, we will contact you within 24 hours.</p>
          <p className="text-sm text-[#5a6a7a] mb-6">Phone: {customerPhone}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#E91E8C] text-white rounded-xl font-semibold hover:bg-[#C41675] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a1f3d]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E91E8C] to-[#C41675] px-6 py-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Complete Your Order</h2>
              <p className="text-white/80 text-sm">{product.name}</p>
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="px-5 py-3 bg-gray-50 border-b">
          <div className="flex gap-3">
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/category_electronics.jpg'; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0a1f3d] truncate">{product.name}</p>
              <p className="text-xs text-[#5a6a7a] line-clamp-1">{product.description}</p>
              <div className="flex gap-3 mt-1">
                <span className="text-sm font-bold text-[#E91E8C]">{formatPrice(product.price)}</span>
                {formatPrice(product.service_fee) && (
                  <span className="text-xs text-[#5a6a7a]">Shipping: {formatPrice(product.service_fee)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">

          {/* === CUSTOMER DETAILS SECTION (NEW) === */}
          <div className="bg-[#0B1E3C]/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#0B1E3C] flex items-center gap-2">
              <User className="w-4 h-4 text-[#E91E8C]" />
              Your Details
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-1">Full Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setCustomerErrors(p => ({ ...p, name: '' })); }}
                placeholder="John Doe"
                className={`w-full px-3 py-2.5 border rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${customerErrors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {customerErrors.name && <p className="text-xs text-red-500 mt-0.5">{customerErrors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A90]" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => { setCustomerPhone(e.target.value); setCustomerErrors(p => ({ ...p, phone: '' })); }}
                  placeholder="+254 7XX XXX XXX"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${customerErrors.phone ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {customerErrors.phone && <p className="text-xs text-red-500 mt-0.5">{customerErrors.phone}</p>}
            </div>

          </div>

          {/* === ORDER DETAILS SECTION (EXISTING) === */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#0B1E3C]">Order Details</h3>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => handleQuantityChange(-1)} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-colors bg-white">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold text-[#0a1f3d]">{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange(1)} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-white transition-colors bg-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-1">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Color preference, delivery instructions, etc..."
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] resize-none"
              />
            </div>
          </div>

          {/* === ACTION BUTTONS === */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleWhatsAppDirect}
              className="w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleEmailOrder}
              className="w-full py-3.5 bg-[#1E63AF] text-white rounded-xl font-semibold hover:bg-[#154a85] transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              <span>Send Order via Email</span>
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(generateOrderMessage())}
              className="w-full py-2.5 border-2 border-gray-200 text-[#5a6a7a] rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              {showCopied ? (
                <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-500">Copied!</span></>
              ) : (
                <><Copy className="w-4 h-4" /><span>Copy Order Details</span></>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-[#5a6a7a] pt-1">
            We will get back to you within 24 hours with availability and delivery timeline.
          </p>
        </div>
      </div>
    </div>
  );
}
