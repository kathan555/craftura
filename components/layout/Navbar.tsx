'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/bulk-orders', label: 'Bulk Orders' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-wood-600 rounded flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="14" width="14" height="2" rx="1" fill="white"/>
                <rect x="5" y="6" width="10" height="8" rx="1" fill="white" opacity="0.7"/>
                <rect x="7" y="3" width="6" height="3" rx="1" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <span className={`font-display font-semibold text-xl tracking-tight transition-colors ${
                scrolled || !isHome ? 'text-charcoal-800' : 'text-white'
              }`}>Craftura</span>
              <span className={`block text-[10px] tracking-[0.2em] uppercase font-body transition-colors ${
                scrolled || !isHome ? 'text-wood-500' : 'text-wood-200'
              }`}>Fine Furniture</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium animated-underline transition-colors ${
                  pathname === link.href
                    ? scrolled || !isHome ? 'text-wood-600' : 'text-wood-200'
                    : scrolled || !isHome ? 'text-charcoal-700 hover:text-charcoal-900' : 'text-white/80 hover:text-white'
                }`}
              >{link.label}</Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/products" className={`hidden sm:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-md transition-all ${
              scrolled || !isHome
                ? 'bg-charcoal-800 text-white hover:bg-charcoal-900'
                : 'bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm'
            }`}>
              Get Quote
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>

            <button
              className={`md:hidden p-2 rounded-md transition-colors ${scrolled || !isHome ? 'text-charcoal-700' : 'text-white'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-wood-600 bg-wood-50' : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-stone-50'
                }`}
              >{link.label}</Link>
            ))}
            <div className="pt-2 px-4">
              <Link href="/products" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
