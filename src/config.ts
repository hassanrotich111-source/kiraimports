// KIRA IMPORTS - Site Configuration
// EDIT THIS FILE TO UPDATE WEBSITE CONTENT

// ============================================
// BASE URL FOR GITHUB PAGES
// ============================================
// Use relative paths for GitHub Pages compatibility
const BASE_URL = import.meta.env.BASE_URL || '/';

// ============================================
// BRAND COLORS (From Logo)
// ============================================
// Primary Navy Blue: #0a1f3d (Background)
// Pink/Magenta: #E91E8C (KIRA text)
// Yellow/Gold: #F5C518 (IMPORTS text)
// Teal/Cyan: #00D4AA (Accents)
// Light Background: #F0F4F8

export interface SiteConfig {
  language: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

// ============================================
// EDITABLE: SITE SETTINGS
// ============================================
export const siteConfig: SiteConfig = {
  language: "en",
  title: "KIRA IMPORTS - Global Sourcing. Kenya Delivered.",
  description: "KIRA IMPORTS is an importation and sourcing company dedicated to helping businesses and entrepreneurs access high-quality products from international markets. We import from China and USA to Kenya.",
};

// ============================================
// EDITABLE: COMPANY INFORMATION
// ============================================
export const companyInfo = {
  name: "KIRA IMPORTS",
  tagline: "be your own boss",
  phone: "+254792821836",
  whatsapp: "+254792821836",
  email: "kiraimports6@gmail.com",
  address: "Nairobi, Kenya",
  hours: "Mon–Sat, 8:00–18:00 EAT",
  social: {
    instagram: "kira_imports_",
    tiktok: "kira.imports_",
    facebook: "Kira Imports",
  },
  vision: "To be a trusted sourcing partner that connects businesses to quality products around the world.",
  mission: "Our mission is to make global trade simple, safe, and profitable for our clients. Through professionalism, transparency, and strong supplier networks, we help businesses grow by connecting them to the right products at the right price.",
};

// ============================================
// EDITABLE: HERO SECTION
// ============================================
export const heroConfig = {
  brandLeft: "KIRA",
  brandRight: "IMPORTS",
  tagline: "Your trusted partner for importing quality products from China & USA to Kenya",
  badge: "China • USA → Kenya",
  since: "Since 2020",
  email: companyInfo.email,
  heroImage: `${BASE_URL}images/hero_container_yard.jpg`,
  heroImageAlt: "Global Shipping Containers",
  scrollText: "Scroll to explore",
  copyrightText: `© ${new Date().getFullYear()} KIRA IMPORTS`,
  navLinks: [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "Categories", href: "#categories" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { label: "Instagram", href: `https://instagram.com/${companyInfo.social.instagram}` },
    { label: "TikTok", href: `https://tiktok.com/@${companyInfo.social.tiktok}` },
    { label: "Facebook", href: `https://facebook.com/${companyInfo.social.facebook}` },
  ],
};

// ============================================
// EDITABLE: WEBSITE IMAGES
// ============================================
// NOTE: Admin must upload all images via the admin panel
// These are placeholder paths - images will be loaded from backend
export const websiteImages = {
  // Logo Image - admin must upload
  logo: `${BASE_URL}images/logo.jpeg`,
  // Hero Section Images - admin must upload
  hero: {
    leftCard: "", // Will be loaded from backend
    rightCard: "", // Will be loaded from backend
  },
  // Background Images for sections
  backgrounds: {
    hero: "",
    about: "",
    services: "",
    categories: "",
    testimonials: "",
    contact: "",
  },
};

// ============================================
// EDITABLE: ABOUT SECTION
// ============================================
export const aboutConfig = {
  label: "ABOUT US",
  headline: "Connecting Kenya to Global Markets",
  vision: {
    title: "🌍 Vision",
    text: "To be a trusted sourcing partner that connects businesses to quality products around the world.",
  },
  mission: {
    title: "🎯 Mission",
    text: "Our mission is to make global trade simple, safe, and profitable for our clients. Through professionalism, transparency, and strong supplier networks, we help businesses grow by connecting them to the right products at the right price.",
  },
  description: "KIRA IMPORTS is an importation and sourcing company dedicated to helping businesses and entrepreneurs access high-quality products from international markets.\n\nWe specialize in sourcing reliable suppliers, negotiating competitive prices, and managing the importation process from purchase to delivery. Our team works closely with trusted manufacturers and suppliers to ensure that our clients receive genuine products that meet their expectations.\n\nAt KIRA IMPORTS, we believe that access to global markets should be easy and efficient. We are here to support our clients every step of the way.",
  services: [
    "Sourcing of All Items",
    "Machines & Equipments",
    "Kitchenware",
    "Clothing and accessories",
    "Bags & Shoes",
    "Phones & Electronics",
    "Furniture & Televisions",
    "& More",
  ],
  whyChooseUs: [
    { title: "WORLDWIDE SOURCING", description: "Direct connections to manufacturers worldwide" },
    { title: "REAL TIME UPDATES", description: "Track your orders from source to delivery" },
    { title: "QUALITY GUARANTEED", description: "Rigorous quality checks before shipment" },
    { title: "STRESS FREE IMPORTATION", description: "We handle customs, logistics, and delivery" },
  ],
  galleryImages: [
    { src: `${BASE_URL}images/sourcing_factory_line.jpg`, alt: "Factory Production", label: "Sourcing" },
    { src: `${BASE_URL}images/quality_inspection.jpg`, alt: "Quality Control", label: "Quality" },
    { src: `${BASE_URL}images/shipping_truck_road.jpg`, alt: "Shipping", label: "Delivery" },
    { src: `${BASE_URL}images/service_support_desk.jpg`, alt: "Customer Support", label: "Support" },
    { src: `${BASE_URL}images/import_cargo_plane.jpg`, alt: "Air Freight", label: "Air Freight" },
    { src: `${BASE_URL}images/sourcing_warehouse_aisle.jpg`, alt: "Warehousing", label: "Storage" },
  ],
  stats: [
    { value: "500+", label: "Products Sourced" },
    { value: "200+", label: "Happy Clients" },
    { value: "4+", label: "Years Experience" },
    { value: "99%", label: "Satisfaction Rate" },
  ],
};

// ============================================
// EDITABLE: SERVICES SECTION
// ============================================
export const servicesConfig = {
  label: "OUR SERVICES",
  headline: "What We Offer",
  ctaText: "Learn More",
  services: [
    {
      id: 1,
      title: "Sourcing of All Items",
      description: "We connect you to verified manufacturers and wholesalers in China and USA.",
      image: `${BASE_URL}images/sourcing_factory_line.jpg`,
      date: "From China & USA",
    },
    {
      id: 2,
      title: "Machines & Equipment",
      description: "Industrial tools, farm equipment, and workshop machinery.",
      image: `${BASE_URL}images/category_machines.jpg`,
      date: "Industrial & Farm",
    },
    {
      id: 3,
      title: "Electronics & Phones",
      description: "Latest smartphones, gadgets, and electronic accessories.",
      image: `${BASE_URL}images/category_electronics.jpg`,
      date: "Latest Gadgets",
    },
    {
      id: 4,
      title: "Furniture & Home",
      description: "Quality furniture and home décor products.",
      image: `${BASE_URL}images/category_furniture.jpg`,
      date: "Quality Living",
    },
  ],
};

// ============================================
// EDITABLE: PRODUCT CATEGORIES
// ============================================
export const productCategories = [
  {
    id: "machines",
    name: "Machines & Equipment",
    description: "Industrial tools, farm equipment, workshop machines",
    image: `${BASE_URL}images/category_machines.jpg`,
  },
  {
    id: "electronics",
    name: "Electronics & Phones",
    description: "Smartphones, accessories, gadgets, audio",
    image: `${BASE_URL}images/category_electronics.jpg`,
  },
  {
    id: "kitchenware",
    name: "Kitchenware",
    description: "Cookware, appliances, utensils, storage",
    image: `${BASE_URL}images/category_kitchenware.jpg`,
  },
  {
    id: "furniture",
    name: "Furniture & Home",
    description: "Sofas, beds, tables, décor, lighting",
    image: `${BASE_URL}images/category_furniture.jpg`,
  },
  {
    id: "clothing",
    name: "Clothing & Shoes",
    description: "Men's, women's, kids fashion & footwear",
    image: `${BASE_URL}images/category_clothing.jpg`,
  },
  {
    id: "bags",
    name: "Bags & Accessories",
    description: "Handbags, luggage, belts, watches, jewelry",
    image: `${BASE_URL}images/category_bags.jpg`,
  },
];

// ============================================
// EDITABLE: COLLECTIONS/CATEGORIES DISPLAY
// ============================================
export const collectionsConfig = {
  label: "CATEGORIES",
  headline: "What We Can Source For You",
  ctaText: "Request Quote",
  collections: [
    {
      id: 1,
      title: "Machines & Equipment",
      year: "Industrial",
      description: "Industrial tools, farm equipment, workshop machines, and heavy machinery sourced from trusted manufacturers.",
      image: `${BASE_URL}images/category_machines.jpg`,
    },
    {
      id: 2,
      title: "Electronics & Phones",
      year: "Tech",
      description: "Smartphones, laptops, accessories, gadgets, and audio equipment at competitive prices.",
      image: `${BASE_URL}images/category_electronics.jpg`,
    },
    {
      id: 3,
      title: "Kitchenware",
      year: "Home",
      description: "Cookware, appliances, utensils, storage solutions, and modern kitchen essentials.",
      image: `${BASE_URL}images/category_kitchenware.jpg`,
    },
    {
      id: 4,
      title: "Furniture & Home",
      year: "Living",
      description: "Sofas, beds, tables, décor, lighting, and home improvement products.",
      image: `${BASE_URL}images/category_furniture.jpg`,
    },
    {
      id: 5,
      title: "Clothing & Shoes",
      year: "Fashion",
      description: "Men's, women's, and kids' fashion, footwear, and seasonal collections.",
      image: `${BASE_URL}images/category_clothing.jpg`,
    },
    {
      id: 6,
      title: "Bags & Accessories",
      year: "Style",
      description: "Handbags, luggage, belts, watches, jewelry, and fashion accessories.",
      image: `${BASE_URL}images/category_bags.jpg`,
    },
  ],
};

// ============================================
// EDITABLE: TESTIMONIALS
// ============================================
export const testimonialsConfig = {
  mainTestimonial: {
    quote: "Kira Imports made everything feel simple—quotes were clear, delivery was on time. They've become our go-to sourcing partner for all our business needs.",
    authorName: "James Ochieng",
    authorTitle: "Retailer, Nairobi",
    authorImage: `${BASE_URL}images/testimonial_james.jpg`,
    rating: 5,
  },
  testimonials: [
    {
      id: 1,
      quote: "I've worked with other agents before. This team actually follows up and solves problems fast. Highly recommended!",
      authorName: "Amina Njoroge",
      authorTitle: "Boutique Owner, Mombasa",
      authorImage: `${BASE_URL}images/testimonial_amina.jpg`,
      rating: 5,
    },
    {
      id: 2,
      quote: "We've scaled our stock without flying to China. That's real value. KIRA IMPORTS handles everything professionally.",
      authorName: "David Kimani",
      authorTitle: "E-commerce Seller",
      authorImage: `${BASE_URL}images/testimonial_david.jpg`,
      rating: 5,
    },
    {
      id: 3,
      quote: "The quality of products is always top-notch. I highly recommend KIRA IMPORTS to anyone looking for reliable sourcing.",
      authorName: "Sarah Wanjiku",
      authorTitle: "Shop Owner, Kisumu",
      authorImage: `${BASE_URL}images/testimonial_james.jpg`,
      rating: 5,
    },
  ],
  trustBadges: [
    { value: "4.9/5", label: "Average Rating" },
    { value: "200+", label: "Happy Clients" },
    { value: "500+", label: "Orders Delivered" },
    { value: "99%", label: "Satisfaction Rate" },
  ],
};

// ============================================
// EDITABLE: CONTACT SECTION
// ============================================
export const visitConfig = {
  label: "CONTACT US",
  headline: "Let's Bring It Home",
  description: "Tell us what you need. We'll reply with pricing, timelines, and next steps—usually within 24 hours. Your global sourcing journey starts here.",
  ctaText: "Send Inquiry",
  infoCards: [
    {
      icon: "Phone",
      title: "WhatsApp",
      content: companyInfo.whatsapp,
    },
    {
      icon: "Mail",
      title: "Email",
      content: companyInfo.email,
    },
    {
      icon: "Clock",
      title: "Business Hours",
      content: companyInfo.hours,
    },
    {
      icon: "MapPin",
      title: "Location",
      content: companyInfo.address,
    },
  ],
};

// ============================================
// EDITABLE: FOOTER
// ============================================
export const footerConfig = {
  marqueeText: "GLOBAL SOURCING • KENYA DELIVERED • CHINA • USA • QUALITY GUARANTEED • WORLDWIDE NETWORK •",
  brandName: companyInfo.name,
  brandDescription: "Your trusted partner for importing quality products from China & USA to Kenya. We make global trade simple, safe, and profitable.",
  socialLinks: [
    { label: "Instagram", href: `https://instagram.com/${companyInfo.social.instagram}` },
    { label: "TikTok", href: `https://tiktok.com/@${companyInfo.social.tiktok}` },
    { label: "Facebook", href: `https://facebook.com/${companyInfo.social.facebook}` },
  ],
  quickLinks: [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "Categories", href: "#categories" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ],
  quickLinksTitle: "Quick Links",
  contactTitle: "Contact",
  contactItems: [
    `WhatsApp: ${companyInfo.whatsapp}`,
    `Phone: ${companyInfo.phone}`,
    `Email: ${companyInfo.email}`,
    `Hours: ${companyInfo.hours}`,
    `Location: ${companyInfo.address}`,
  ],
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

// ============================================
// THEME COLORS (Matching Logo)
// ============================================
export const themeColors = {
  // Primary Colors
  navy: "#0a1f3d",
  navyLight: "#1a3a5c",
  navyDark: "#051224",
  
  // Accent Colors
  pink: "#E91E8C",
  pinkLight: "#FF4DA6",
  pinkDark: "#C41675",
  
  yellow: "#F5C518",
  yellowLight: "#FFD54F",
  yellowDark: "#C79400",
  
  teal: "#00D4AA",
  tealLight: "#4DEDCC",
  tealDark: "#00A884",
  
  // Background Colors
  bgLight: "#F0F4F8",
  bgWhite: "#FFFFFF",
  
  // Text Colors
  textDark: "#0a1f3d",
  textGray: "#5a6a7a",
  textLight: "#8a9aaa",
};

// ============================================
// ADMIN SETTINGS
// ============================================
export const adminConfig = {
  password: "kira2024",
  logo: `${BASE_URL}images/logo.jpeg`,
};
