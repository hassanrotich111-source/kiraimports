import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Search, CheckCircle, User, Phone, Tag, FileText } from 'lucide-react';
import { companyInfo } from '../config';

interface RequestProductModalProps {
  onClose: () => void;
}

export default function RequestProductModal({ onClose }: RequestProductModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestSent, setRequestSent] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = 'Enter your name';
    if (!customerPhone.trim()) errs.phone = 'Enter your phone number';
    if (!productName.trim()) errs.product = 'Enter product name';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleWhatsAppRequest = () => {
    if (!validate()) return;

    const message = `*PRODUCT REQUEST - KIRA IMPORTS*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${customerName}\n` +
      `Phone: ${customerPhone}\n\n` +
      `*Product Requested:*\n` +
      `Product Name: ${productName}\n` +
      `Description: ${productDescription || 'No additional details'}\n\n` +
      `I could not find this product in your shop. Please let me know if you can source it.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${companyInfo.whatsapp.replace(/\s/g, '').replace('+', '')}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    setRequestSent(true);
  };

  if (requestSent) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[#0a1f3d]/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0a1f3d] mb-2">Request Sent!</h2>
          <p className="text-[#5a6a7a] mb-6">We will look for "{productName}" and get back to you within 24 hours.</p>
          <button onClick={onClose} className="w-full py-3 bg-[#E91E8C] text-white rounded-xl font-semibold hover:bg-[#C41675] transition-colors">
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a1f3d]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E63AF] to-[#00BFA6] px-6 py-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Request a Product</h2>
              <p className="text-white/80 text-sm">Can&apos;t find what you need? Tell us!</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
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
                onChange={(e) => { setCustomerName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                placeholder="John Doe"
                className={`w-full px-3 py-2.5 border rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A90]" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => { setCustomerPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                  placeholder="+254 7XX XXX XXX"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          <div className="bg-[#0B1E3C]/5 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-[#0B1E3C] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#E91E8C]" />
              Product Details
            </h3>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-1">Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => { setProductName(e.target.value); setErrors(p => ({ ...p, product: '' })); }}
                placeholder="What product are you looking for?"
                className={`w-full px-3 py-2.5 border rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] ${errors.product ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.product && <p className="text-xs text-red-500 mt-0.5">{errors.product}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-[#0a1f3d] mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Additional Details (Optional)
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Brand, model, specifications, quantity needed, preferred country of origin..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-[#0a1f3d] text-sm placeholder-[#5a6a7a]/40 focus:outline-none focus:ring-2 focus:ring-[#E91E8C] resize-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppRequest}
            className="w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Request via WhatsApp</span>
          </button>

          <p className="text-center text-xs text-[#5a6a7a]">
            We will search for this product and contact you within 24 hours with pricing and availability.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
