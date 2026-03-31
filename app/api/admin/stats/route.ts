import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [totalOrders, totalInquiries, totalProducts, totalCategories,
    pendingOrders, recentOrders, recentInquiries, ordersByStatus] = await Promise.all([
    prisma.order.count(),
    prisma.inquiry.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ])

  return NextResponse.json({
    totalOrders, totalInquiries, totalProducts, totalCategories,
    pendingOrders, recentOrders, recentInquiries, ordersByStatus,
  })
}
