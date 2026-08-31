import { ArrowLeft, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { companyInfo } from '../config';

interface LegalPageProps {
  page: 'privacy' | 'terms';
  onNavigateHome: () => void;
}

const content = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: August 31, 2026',
    intro: 'KIRA IMPORTS respects your privacy. This policy explains what information we collect, why we collect it, and how customers can contact us about their data.',
    sections: [
      {
        heading: 'Information We Collect',
        text: 'We may collect your name, phone number, email address, delivery location, product request details, order information, and messages you send through WhatsApp, email, or website forms.',
      },
      {
        heading: 'How We Use Information',
        text: 'We use customer information to respond to inquiries, prepare quotes, process orders, coordinate sourcing and delivery, provide support, prevent fraud, and improve our services.',
      },
      {
        heading: 'Sharing Information',
        text: 'We only share information when needed to complete your request, such as with suppliers, shipping partners, payment providers, or service providers that help us operate the website and order process.',
      },
      {
        heading: 'Security',
        text: 'We use reasonable safeguards to protect customer information and limit access to authorized business use. Do not send passwords, card PINs, or sensitive identity documents through public forms.',
      },
      {
        heading: 'Your Choices',
        text: 'You can request corrections or deletion of your customer information by contacting us. Some records may be kept when required for order history, dispute handling, accounting, or legal compliance.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: August 31, 2026',
    intro: 'These terms explain how KIRA IMPORTS handles product sourcing, quotes, orders, payments, delivery expectations, and customer responsibilities.',
    sections: [
      {
        heading: 'Quotes and Product Requests',
        text: 'Quotes are based on supplier availability, exchange rates, freight costs, taxes, and delivery requirements at the time they are prepared. Prices and timelines may change before payment is confirmed.',
      },
      {
        heading: 'Orders and Payments',
        text: 'An order starts after the customer confirms the product details and payment terms. Customers are responsible for reviewing item names, specifications, quantities, colors, sizes, and delivery details before confirming.',
      },
      {
        heading: 'Delivery Timelines',
        text: 'Delivery estimates are provided in good faith and may be affected by supplier delays, customs processing, freight schedules, public holidays, weather, or other logistics events outside our control.',
      },
      {
        heading: 'Returns and Refunds',
        text: 'Returns or refunds depend on the supplier policy, item condition, proof of issue, and whether the delivered product differs materially from the confirmed order details. Custom or specially sourced items may not be returnable.',
      },
      {
        heading: 'Customer Responsibility',
        text: 'Customers must provide accurate contact information, delivery details, and product requirements. KIRA IMPORTS is not responsible for delays or extra costs caused by incorrect or incomplete customer information.',
      },
    ],
  },
};

export default function LegalPage({ page, onNavigateHome }: LegalPageProps) {
  const details = content[page];
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp.replace(/\s/g, '').replace('+', '')}`;

  return (
    <main className="min-h-screen bg-[#0a1f3d] text-white px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={onNavigateHome}
          className="mb-8 flex items-center gap-2 text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <section className="rounded-2xl bg-white p-6 text-[#0a1f3d] shadow-2xl sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase text-[#E91E8C]">{details.updated}</p>
          <h1 className="mb-4 text-3xl font-black sm:text-4xl">{details.title}</h1>
          <p className="mb-8 text-base leading-7 text-slate-600">{details.intro}</p>

          <div className="space-y-6">
            {details.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="mb-2 text-lg font-bold">{section.heading}</h2>
                <p className="leading-7 text-slate-600">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="mb-3 text-lg font-bold">Contact KIRA IMPORTS</h2>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <a className="flex items-center gap-2 hover:text-[#E91E8C]" href={`tel:${companyInfo.phone}`}>
                <Phone className="h-4 w-4" />
                {companyInfo.phone}
              </a>
              <a className="flex items-center gap-2 hover:text-[#E91E8C]" href={`mailto:${companyInfo.email}`}>
                <Mail className="h-4 w-4" />
                {companyInfo.email}
              </a>
              <a className="flex items-center gap-2 hover:text-[#E91E8C]" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp {companyInfo.whatsapp}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {companyInfo.address}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
