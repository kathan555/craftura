import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(inquiries)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    })
    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
  }
}
