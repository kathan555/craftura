import Link from 'next/link'

interface NavSettings {
  nav_show_gallery:     boolean
  nav_show_bulk_orders: boolean
  nav_show_about:       boolean
  nav_show_contact:     boolean
}

export default function Footer({ navSettings }: { navSettings: NavSettings }) {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded flex items-center justify-center"
                style={{ background: 'var(--accent)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="14" width="14" height="2" rx="1" fill="white"/>
                  <rect x="5" y="6" width="10" height="8" rx="1" fill="white" opacity="0.7"/>
                  <rect x="7" y="3" width="6" height="3" rx="1" fill="white" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <span className="font-display font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>Craftura</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--accent-text)' }}>Fine Furniture</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              Three decades of crafting premium furniture for homes, hotels and institutions across India.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'linkedin'].map(s => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
                  <span className="sr-only">{s}</span>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/',            label: 'Home',        show: true },
                { href: '/products',    label: 'Products',    show: true },
                { href: '/gallery',     label: 'Gallery',     show: navSettings.nav_show_gallery },
                { href: '/bulk-orders', label: 'Bulk Orders', show: navSettings.nav_show_bulk_orders },
                { href: '/about',       label: 'About Us',    show: navSettings.nav_show_about },
                { href: '/contact',     label: 'Contact',     show: navSettings.nav_show_contact },
              ].filter(l => l.show).map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm animated-underline transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
              Categories
            </h4>
            <ul className="space-y-3">
              {['Living Room','Bedroom','Dining','Office','Outdoor','Storage'].map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${cat.toLowerCase().replace(' ','-')}`}
                    className="text-sm animated-underline transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>,
                  text: 'Plot 42, GIDC Industrial Estate,\nAhmedabad, Gujarat 380025',
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>,
                  text: '+91 98765 43210',
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>,
                  text: 'info@craftura.com',
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" style={{ color: 'var(--accent-text)' }}>
                    {item.icon}
                  </svg>
                  <span className="text-sm whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            © {new Date().getFullYear()} Craftura Fine Furniture. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy','Terms of Service'].map(t => (
              <Link key={t} href="#" className="text-xs transition-colors" style={{ color: 'var(--text-faint)' }}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
