import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: { include: { images: { where: { isPrimary: true } } } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, notes, orderType, items } = body

    if (!name || !email || !phone || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes?.trim() || null,
        orderType: orderType || 'B2C',
        status: 'PENDING',
        items: {
          create: items.map((item: { productId: string; quantity: number; notes?: string }) => ({
            productId: item.productId,
            quantity: item.quantity || 1,
            notes: item.notes?.trim() || null,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ success: true, orderNumber: order.orderNumber }, { status: 201 })
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
