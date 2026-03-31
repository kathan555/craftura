import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products' }

async function getProducts(categorySlug?: string, search?: string) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { material: { contains: search } },
          ]
        } : {}),
      },
      include: { images: { where: { isPrimary: true } }, category: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  return { products, categories }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const { products, categories } = await getProducts(searchParams.category, searchParams.search)
  const activeCategory = categories.find(c => c.slug === searchParams.category)

  return (
    <div className="pt-20 bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-charcoal-800 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-wood-400 text-xs tracking-[0.3em] uppercase font-medium mb-3">Our Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white">
            {activeCategory ? activeCategory.name : 'All Products'}
          </h1>
          {activeCategory?.description && (
            <p className="text-stone-400 text-lg mt-3">{activeCategory.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <form className="flex-1 max-w-sm">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                defaultValue={searchParams.search}
                className="form-input pl-10 h-11"
              />
            </div>
          </form>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                !searchParams.category
                  ? 'bg-charcoal-800 text-white border-charcoal-800'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >All</Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  searchParams.category === cat.slug
                    ? 'bg-wood-600 text-white border-wood-600'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-wood-400'
                }`}
              >{cat.name}</Link>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-stone-500 text-sm mb-6">
          {products.length} product{products.length !== 1 ? 's' : ''} found
          {searchParams.search ? ` for "${searchParams.search}"` : ''}
        </p>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🪑</div>
            <h3 className="font-display text-2xl text-charcoal-700 mb-2">No products found</h3>
            <p className="text-stone-400 mb-6">Try a different search or browse all categories</p>
            <Link href="/products" className="btn-primary">View All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm card-hover"
              >
                <div className="relative aspect-[4/3] img-zoom">
                  <Image
                    src={product.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.featured && (
                    <span className="absolute top-3 right-3 bg-wood-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display text-lg text-charcoal-800 leading-tight group-hover:text-wood-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  {product.material && (
                    <p className="text-xs text-stone-400 tracking-wider uppercase mb-2">{product.material}</p>
                  )}
                  <p className="text-stone-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    {product.price ? (
                      <span className="font-display text-wood-600 text-base">₹{product.price.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-stone-400 text-xs">Price on request</span>
                    )}
                    {product.moq && (
                      <span className="text-xs text-stone-400">MOQ: {product.moq}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
