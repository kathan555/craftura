import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us' }

export default function AboutPage() {
  return (
    <div className="pt-20 bg-cream">
      {/* Hero */}
      <div className="relative bg-charcoal-900 py-24">
        <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920" alt="Workshop" fill className="object-cover opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-wood-400 text-xs tracking-[0.3em] uppercase font-medium mb-4">Our Story</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">Three Decades of<br/><em className="italic font-light text-wood-300">Craftsmanship</em></h1>
          <p className="text-stone-400 text-xl max-w-2xl mx-auto">Making beautiful, lasting furniture since 1994 — one joint at a time.</p>
        </div>
      </div>

      {/* Origin Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-display text-4xl text-charcoal-800 mb-6">How It All Began</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>Craftura was founded in 1994 by master craftsman Suresh Patel in a small workshop in Ahmedabad's industrial district. Starting with just three carpenters and a passion for quality, Suresh built the business on one principle: every piece of furniture should outlast its owner.</p>
              <p>Over three decades, that small workshop has grown into a 15,000 sq ft manufacturing facility employing 120 skilled artisans. We've supplied furniture to over 200 hotels, furnished thousands of homes, and equipped hundreds of corporate offices across India.</p>
              <p>Today, the second generation of the Patel family leads Craftura, combining modern design sensibilities with the time-honoured joinery traditions that built our reputation.</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" alt="Craftsman at work" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-wood-600 text-white p-6 rounded-xl">
              <div className="font-display text-4xl font-bold">120+</div>
              <div className="text-wood-200 text-sm tracking-wide uppercase mt-1">Skilled Artisans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-wood-400 text-xs tracking-[0.3em] uppercase font-medium mb-3">What We Stand For</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🪵', title: 'Quality Materials', desc: 'We source only the finest teak, oak, sheesham, and rosewood from certified sustainable forests.' },
              { icon: '🔨', title: 'Traditional Craftsmanship', desc: 'Mortise and tenon joints, hand-carved details, and hand-applied finishes — no shortcuts.' },
              { icon: '📐', title: 'Precision Design', desc: 'Every dimension is measured, every angle is true. Form follows function without compromise.' },
              { icon: '🤝', title: 'Customer Partnership', desc: "We don't just sell furniture — we collaborate with clients to realise their vision." },
            ].map(v => (
              <div key={v.title} className="bg-white/5 rounded-2xl p-7 border border-white/8">
                <div className="text-4xl mb-5">{v.icon}</div>
                <h3 className="font-display text-xl text-white mb-3">{v.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-wood-500 text-xs tracking-[0.3em] uppercase font-medium mb-4">Our Facility</p>
            <h2 className="font-display text-4xl text-charcoal-800 mb-6">Manufacturing Capabilities</h2>
            <div className="space-y-5">
              {[
                { title: 'State-of-Art Machinery', desc: 'CNC routing, precision cutting, and finishing equipment for consistent quality at scale.' },
                { title: 'Skilled Artisan Workforce', desc: '120+ craftspeople with an average of 12 years experience in furniture manufacturing.' },
                { title: 'Custom Orders Welcome', desc: 'Bespoke dimensions, materials, finishes — we build exactly what you envision.' },
                { title: 'Quality Control', desc: 'Multi-stage QC inspection before dispatch. Every piece is signed off by a senior craftsman.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-wood-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-wood-600 font-display font-bold text-sm">{i+1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-800 mb-1">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
              'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600',
              'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <Image src={src} alt={`Manufacturing ${i+1}`} width={300} height={300} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-wood-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1994', label: 'Founded' },
              { value: '15,000 sqft', label: 'Facility' },
              { value: '200+', label: 'B2B Clients' },
              { value: '5000+', label: 'Homes Furnished' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-4xl sm:text-5xl font-semibold text-white">{s.value}</div>
                <div className="text-wood-200 text-sm tracking-widest uppercase mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4">
        <h2 className="font-display text-4xl text-charcoal-800 mb-5">Ready to Work Together?</h2>
        <p className="text-stone-500 text-lg mb-8">Whether you need a single piece or a complete commercial fit-out, we're here to help.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-wood">Get in Touch</Link>
          <Link href="/products" className="btn-outline">Browse Products</Link>
        </div>
      </section>
    </div>
  )
}
