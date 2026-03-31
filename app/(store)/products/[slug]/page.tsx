// Server component wrapper
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/store/ProductDetailClient'

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } })
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
    },
  })

  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { images: { where: { isPrimary: true } } },
    take: 4,
  })

  return <ProductDetailClient product={JSON.parse(JSON.stringify(product))} related={JSON.parse(JSON.stringify(related))} />
}
