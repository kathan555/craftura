'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string; name: string; slug: string; description: string
  dimensions?: string; material?: string; price?: number; moq?: number
  images: { id: string; url: string; altText?: string; isPrimary: boolean }[]
  category: { name: string; slug: string }
}

interface Related {
  id: string; name: string; slug: string
  images: { url: string }[]
}

export default function ProductDetailClient({ product, related }: { product: Product; related: Related[] }) {
  const [activeImg, setActiveImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderType, setOrderType] = useState<'B2C' | 'B2B'>('B2C')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          orderType,
          items: [{ productId: product.id, quantity, notes: form.notes }],
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="pt-20 bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 py-20">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M7 18l7 7 15-15" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 className="font-display text-3xl text-charcoal-800 mb-3">Order Received!</h2>
          <p className="text-stone-500 text-lg mb-2">Thank you for your inquiry.</p>
          <p className="text-stone-500 mb-8">Our team will contact you shortly to confirm your order.</p>
          <Link href="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-charcoal-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-charcoal-700 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-charcoal-700 transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-charcoal-700">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
              <Image
                src={product.images[activeImg]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'}
                alt={product.images[activeImg]?.altText || product.name}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      i === activeImg ? 'border-wood-500' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <Image src={img.url} alt={img.altText || product.name} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info + Form */}
          <div>
            <Link href={`/products?category=${product.category.slug}`} className="inline-block text-xs text-wood-600 bg-wood-50 border border-wood-200 px-3 py-1.5 rounded-full font-medium mb-4">
              {product.category.name}
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal-800 mb-2">{product.name}</h1>

            {product.price && (
              <p className="font-display text-2xl text-wood-600 mb-5">₹{product.price.toLocaleString('en-IN')}</p>
            )}

            <p className="text-stone-600 leading-relaxed mb-7">{product.description}</p>

            {/* Specs */}
            <div className="bg-white rounded-xl border border-stone-100 p-5 mb-7 space-y-3">
              <h3 className="font-semibold text-charcoal-700 text-sm mb-4 uppercase tracking-wider">Specifications</h3>
              {product.dimensions && (
                <div className="flex justify-between text-sm border-b border-stone-50 pb-3">
                  <span className="text-stone-400">Dimensions</span>
                  <span className="font-medium text-charcoal-700">{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between text-sm border-b border-stone-50 pb-3">
                  <span className="text-stone-400">Material</span>
                  <span className="font-medium text-charcoal-700">{product.material}</span>
                </div>
              )}
              {product.moq && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Min. Order Qty (B2B)</span>
                  <span className="font-medium text-charcoal-700">{product.moq} units</span>
                </div>
              )}
            </div>

            {/* Order Type Toggle */}
            <div className="flex rounded-lg border border-stone-200 p-1 mb-6 bg-stone-50">
              {(['B2C', 'B2B'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                    orderType === type ? 'bg-white shadow-sm text-charcoal-800' : 'text-stone-400 hover:text-charcoal-700'
                  }`}
                >
                  {type === 'B2C' ? '🏠 Individual Order' : '🏢 Bulk / Business Order'}
                </button>
              ))}
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Full Name *</label>
                  <input
                    type="text" required
                    className="form-input"
                    placeholder="Raj Patel"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Phone *</label>
                  <input
                    type="tel" required
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Email *</label>
                <input
                  type="email" required
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Delivery Address *</label>
                <input
                  type="text" required
                  className="form-input"
                  placeholder="Your full address"
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1.5">
                  Quantity {orderType === 'B2B' && product.moq ? `(Min. ${product.moq})` : ''}
                </label>
                <input
                  type="number"
                  min={orderType === 'B2B' && product.moq ? product.moq : 1}
                  className="form-input"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Custom Requirements / Notes</label>
                <textarea
                  rows={3}
                  className="form-input resize-none"
                  placeholder="Any special dimensions, finish, color requirements..."
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-wood w-full text-base">
                {submitting ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Placing Inquiry...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Place Inquiry
                  </span>
                )}
              </button>
              <p className="text-center text-xs text-stone-400">No payment required · Our team will contact you to confirm</p>
            </form>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="section-divider" />
            <h2 className="font-display text-3xl text-charcoal-800 text-center mb-10">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group card-hover rounded-xl overflow-hidden bg-white border border-stone-100 shadow-sm">
                  <div className="relative aspect-square img-zoom">
                    <Image
                      src={p.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
                      alt={p.name} fill className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-sm text-charcoal-800 group-hover:text-wood-600 transition-colors">{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
