'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '../../components/ui/ThemeToggle'

const navLinks = [
  { href: '/',            label: 'Home' },
  { href: '/products',    label: 'Products' },
  { href: '/gallery',     label: 'Gallery' },
  { href: '/bulk-orders', label: 'Bulk Orders' },
  { href: '/about',       label: 'About' },
  { href: '/contact',     label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || !isHome

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: solid ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? '1px solid var(--border-subtle)' : 'none',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="14" width="14" height="2" rx="1" fill="white"/>
                <rect x="5" y="6" width="10" height="8" rx="1" fill="white" opacity="0.7"/>
                <rect x="7" y="3" width="6" height="3" rx="1" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-semibold text-xl tracking-tight"
                style={{ color: solid ? 'var(--text-primary)' : 'white' }}>
                Craftura
              </span>
              <span className="block text-[10px] tracking-[0.2em] uppercase font-body"
                style={{ color: solid ? 'var(--accent-text)' : 'rgba(255,255,255,0.65)' }}>
                Fine Furniture
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2 rounded-md text-sm font-medium animated-underline transition-colors"
                  style={{
                    color: active
                      ? (solid ? 'var(--accent-text)' : 'var(--color-wood-200)')
                      : (solid ? 'var(--text-secondary)' : 'rgba(255,255,255,0.8)'),
                  }}
                >{link.label}</Link>
              )
            })}
          </div>

          {/* Right side: toggle + CTA + hamburger */}
          <div className="flex items-center gap-3">
            {/* Theme toggle — always visible on desktop */}
            <div className="hidden sm:flex items-center"
              style={{ color: solid ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)' }}>
              <ThemeToggle />
            </div>

            <Link href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-md transition-all"
              style={solid
                ? { background: 'var(--text-primary)', color: 'var(--bg-base)' }
                : { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }
              }>
              Get Quote
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <button
              className="md:hidden p-2 rounded-md transition-colors"
              style={{ color: solid ? 'var(--text-primary)' : 'white' }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen
                ? <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                : <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-base)' }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: pathname === link.href ? 'var(--accent-text)' : 'var(--text-secondary)',
                  background: pathname === link.href ? 'var(--accent-soft)' : 'transparent',
                }}
              >{link.label}</Link>
            ))}
            {/* Theme toggle in mobile menu */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <span className="text-sm">Dark Mode</span>
              <ThemeToggle />
            </div>
            <div className="pt-2 px-4">
              <Link href="/products" onClick={() => setMenuOpen(false)}
                className="btn-primary w-full text-sm">
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}