import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { status } = await req.json()
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'DELIVERED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
// Updates an order status for an authenticated admin.

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch nested item, product, and primary image details for order review screens.
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } } },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}
// Returns one order with nested item and product metadata.
