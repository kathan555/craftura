import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-wood-600 rounded flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="14" width="14" height="2" rx="1" fill="white"/>
                  <rect x="5" y="6" width="10" height="8" rx="1" fill="white" opacity="0.7"/>
                  <rect x="7" y="3" width="6" height="3" rx="1" fill="white" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <span className="font-display font-semibold text-xl text-white">Craftura</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-wood-400">Fine Furniture</span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-5">
              Three decades of crafting premium furniture for homes, hotels and institutions across India.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'linkedin'].map(s => (
                <a key={s} href="#" className="w-9 h-9 rounded-full bg-white/8 hover:bg-wood-600 flex items-center justify-center transition-colors">
                  <span className="sr-only">{s}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="white" opacity="0.7">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/bulk-orders', label: 'Bulk Orders' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-stone-400 hover:text-wood-300 transition-colors animated-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">Categories</h4>
            <ul className="space-y-3">
              {['Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Storage'].map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${cat.toLowerCase().replace(' ', '-')}`} className="text-sm text-stone-400 hover:text-wood-300 transition-colors animated-underline">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <svg className="w-4 h-4 text-wood-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-sm text-stone-400">Plot 42, GIDC Industrial Estate,<br/>Ahmedabad, Gujarat 380025</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-4 h-4 text-wood-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span className="text-sm text-stone-400">+91 98765 43210</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-4 h-4 text-wood-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span className="text-sm text-stone-400">info@craftura.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">© {new Date().getFullYear()} Craftura Fine Furniture. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="text-xs text-stone-500 hover:text-stone-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-stone-500 hover:text-stone-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
