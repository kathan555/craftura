import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

async function getHomeData() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { images: { where: { isPrimary: true } }, category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ take: 6, orderBy: { name: 'asc' } }),
  ])
  return { featuredProducts, categories }
}

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomeData()

  return (
    <div className="bg-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-charcoal-900">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"
            alt="Craftura showroom"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-2xl">
            <p className="text-wood-300 text-sm tracking-[0.3em] uppercase font-medium mb-6 animate-fade-in">
              Est. 1994 · Ahmedabad, India
            </p>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-semibold text-white leading-[0.95] mb-6 animate-slide-up">
              Crafted<br/>
              <em className="italic font-light">for</em><br/>
              Generations
            </h1>
            <p className="text-stone-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg animate-slide-up stagger-2">
              Premium furniture handcrafted by master artisans. Serving homes, 
              hotels and offices across India with bespoke quality since 1994.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in stagger-3">
              <Link href="/products" className="btn-wood">
                Explore Collection
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/bulk-orders" className="btn-outline" style={{color:'white', borderColor:'rgba(255,255,255,0.4)'}}>
                Bulk Orders (B2B)
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-16 pt-10 border-t border-white/15 animate-fade-in stagger-4">
              {[
                { value: '30+', label: 'Years Experience' },
                { value: '5000+', label: 'Pieces Crafted' },
                { value: '200+', label: 'B2B Clients' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-semibold text-white">{stat.value}</div>
                  <div className="text-stone-400 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse"/>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-wood-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">Our Range</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal-800">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl img-zoom card-hover ${i === 0 ? 'md:col-span-2 row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '16/9' : '4/3' }}
            >
              <Image
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
                alt={cat.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-7">
                <h3 className="font-display text-white text-xl sm:text-2xl font-semibold">{cat.name}</h3>
                {cat.description && (
                  <p className="text-stone-300 text-sm mt-1 hidden sm:block">{cat.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3 text-wood-300 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STRIP BANNER ── */}
      <div className="bg-wood-600 py-5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array(4).fill(['Custom Orders', 'Bulk Manufacturing', 'Premium Materials', '30+ Years Experience', 'Pan-India Delivery', 'B2B Specialists']).flat().map((text, i) => (
            <span key={i} className="text-wood-100 text-sm font-medium tracking-widest uppercase shrink-0">
              {text} <span className="text-wood-300 mx-3">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-wood-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">Handpicked</p>
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal-800">Featured Pieces</h2>
          </div>
          <Link href="/products" className="btn-outline text-sm shrink-0 self-start sm:self-auto">
            View All Products
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product, i) => (
            <Link key={product.id} href={`/products/${product.slug}`}
              className={`group card-hover rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-100 ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative aspect-[4/3] img-zoom">
                <Image
                  src={product.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.category && (
                    <span className="bg-white/90 backdrop-blur-sm text-charcoal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {product.category.name}
                    </span>
                  )}
                  {product.moq && (
                    <span className="bg-wood-600/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      MOQ: {product.moq}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-charcoal-800 mb-1 group-hover:text-wood-600 transition-colors">{product.name}</h3>
                {product.material && (
                  <p className="text-stone-400 text-xs mb-2 tracking-wider uppercase">{product.material}</p>
                )}
                <p className="text-stone-500 text-sm line-clamp-2 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  {product.price ? (
                    <span className="font-display text-wood-600 text-lg">₹{product.price.toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-stone-400 text-sm">Price on request</span>
                  )}
                  <span className="flex items-center gap-1.5 text-charcoal-700 text-sm font-medium group-hover:gap-3 transition-all">
                    View Details
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="py-24 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
                  alt="Craftura workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-wood-600 rounded-2xl -z-10" />
              <div className="absolute -top-5 -left-5 w-28 h-28 bg-charcoal-700 rounded-2xl -z-10" />
              {/* Badge */}
              <div className="absolute top-6 -right-6 bg-wood-600 text-white p-5 rounded-xl shadow-xl">
                <div className="font-display text-4xl font-bold">30+</div>
                <div className="text-wood-200 text-xs tracking-wider uppercase mt-1">Years</div>
              </div>
            </div>

            <div>
              <p className="text-wood-400 text-xs tracking-[0.3em] uppercase font-medium mb-5">Our Story</p>
              <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-6">
                Three Decades of<br/>
                <em className="italic text-wood-300 font-light">Craftsmanship</em>
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-6">
                Since 1994, Craftura has been synonymous with quality furniture manufacturing. Our master craftsmen combine traditional Indian joinery techniques with contemporary design to create pieces that stand the test of time.
              </p>
              <p className="text-stone-400 leading-relaxed mb-8">
                Whether you're furnishing a single room or outfitting an entire hotel chain, our manufacturing capabilities scale to meet your needs. Every joint is mortise and tenon, every finish hand-applied.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: '⚙️', title: 'Bulk Manufacturing', desc: 'Hotels, offices & institutions' },
                  { icon: '✂️', title: 'Custom Design', desc: 'Made-to-measure furniture' },
                  { icon: '🌳', title: 'Premium Materials', desc: 'Teak, oak, sheesham & more' },
                  { icon: '🚚', title: 'Pan-India Delivery', desc: 'Delivered to your door' },
                ].map(f => (
                  <div key={f.title} className="flex gap-3">
                    <span className="text-xl mt-0.5">{f.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm">{f.title}</div>
                      <div className="text-stone-500 text-xs mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/about" className="btn-wood">
                Our Story
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── B2B BANNER ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-wood-600 rounded-3xl px-8 sm:px-14 py-14 sm:py-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="absolute border border-white rounded-full"
                  style={{ width: (i+1)*200, height: (i+1)*200, top: '50%', left: '60%', transform: 'translate(-50%,-50%)' }}
                />
              ))}
            </div>
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-wood-100 text-xs tracking-[0.3em] uppercase font-medium mb-4">For Businesses</p>
                <h2 className="font-display text-4xl sm:text-5xl text-white font-semibold mb-5 leading-tight">
                  Bulk Orders &<br/>Custom Projects
                </h2>
                <p className="text-wood-100 text-lg leading-relaxed mb-8">
                  Supplying furniture to hotels, resorts, corporate offices and educational institutions. 
                  Competitive pricing on bulk orders with guaranteed quality and timely delivery.
                </p>
                <Link href="/bulk-orders" className="inline-flex items-center gap-2 bg-white text-wood-700 font-semibold px-7 py-3.5 rounded-lg hover:bg-wood-50 transition-colors">
                  Request Bulk Quote
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50+', label: 'MOQ Available', sub: 'Minimum order quantity' },
                  { value: '100%', label: 'Customizable', sub: 'Size, finish & material' },
                  { value: '60 days', label: 'Lead Time', sub: 'For bulk orders' },
                  { value: '5★', label: 'Quality Assured', sub: 'ISO manufacturing' },
                ].map(s => (
                  <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-5">
                    <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-white font-semibold text-sm mt-1">{s.label}</div>
                    <div className="text-wood-100 text-xs mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-wood-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">Testimonials</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal-800">What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "Craftura supplied all the furniture for our 80-room boutique hotel. The quality is exceptional and delivery was on time. Highly recommend for bulk orders.", name: "Rajesh Patel", role: "GM, The Heritage Grand Hotel", location: "Ahmedabad" },
            { quote: "We've been ordering office furniture for our 5 branches from Craftura for 6 years. Consistent quality, great service, and the customization options are unmatched.", name: "Priya Mehta", role: "Facilities Manager, TechCorp India", location: "Ahmedabad" },
            { quote: "The bedroom set I ordered is absolutely stunning. The craftsmanship is visible in every joint and finish. Worth every rupee.", name: "Anita Sharma", role: "Homeowner", location: "Surat" },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm card-hover">
              <div className="flex gap-1 mb-5">
                {Array(5).fill(0).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 16 16" fill="#c4783a"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/></svg>
                ))}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-wood-100 flex items-center justify-center text-wood-600 font-semibold font-display">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-charcoal-800">{t.name}</div>
                  <div className="text-stone-400 text-xs">{t.role} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-charcoal-800 rounded-3xl p-10 sm:p-16 text-center">
          <p className="text-wood-400 text-xs tracking-[0.3em] uppercase font-medium mb-4">Ready to Begin?</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-5">Let's Create Something Beautiful</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto mb-10">
            From a single statement piece to furnishing an entire building — we'd love to hear about your project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-wood">Get in Touch</Link>
            <Link href="/products" className="btn-outline" style={{color:'#d6d3d1', borderColor:'rgba(255,255,255,0.3)'}}>Browse Products</Link>
          </div>
        </div>
      </section>
      
    </div>
  )
}
