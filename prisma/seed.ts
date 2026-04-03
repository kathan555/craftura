import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@craftura.com' },
    update: {},
    create: {
      email: 'admin@craftura.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  // Create categories
  const categories = [
    { name: 'Living Room', slug: 'living-room', description: 'Sofas, coffee tables, TV units and more', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
    { name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, dressers and nightstands', imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600' },
    { name: 'Dining', slug: 'dining', description: 'Dining tables, chairs and sideboards', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600' },
    { name: 'Office', slug: 'office', description: 'Desks, office chairs and storage solutions', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600' },
    { name: 'Outdoor', slug: 'outdoor', description: 'Garden furniture and outdoor seating', imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600' },
    { name: 'Storage', slug: 'storage', description: 'Bookshelves, cabinets and storage units', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Get category ids
  const livingRoom = await prisma.category.findUnique({ where: { slug: 'living-room' } })
  const bedroom = await prisma.category.findUnique({ where: { slug: 'bedroom' } })
  const dining = await prisma.category.findUnique({ where: { slug: 'dining' } })
  const office = await prisma.category.findUnique({ where: { slug: 'office' } })

  // Create products
  const products = [
    {
      name: 'Artisan Oak Sofa',
      slug: 'artisan-oak-sofa',
      description: 'Handcrafted solid oak sofa with premium fabric upholstery. Perfect for modern and traditional homes alike.',
      dimensions: 'W220 x D85 x H85 cm',
      material: 'Solid Oak, Premium Fabric',
      price: 45000,
      moq: 10,
      featured: true,
      categoryId: livingRoom!.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', isPrimary: true, order: 0 },
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', isPrimary: false, order: 1 },
      ],
    },
    {
      name: 'Heritage King Bed',
      slug: 'heritage-king-bed',
      description: 'Majestic king-sized bed with hand-carved headboard. Made from premium teak wood with mortise and tenon joints.',
      dimensions: 'W200 x D220 x H140 cm',
      material: 'Premium Teak Wood',
      price: 65000,
      moq: 5,
      featured: true,
      categoryId: bedroom!.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', isPrimary: true, order: 0 },
      ],
    },
    {
      name: 'Manor Dining Table',
      slug: 'manor-dining-table',
      description: '8-seater dining table crafted from reclaimed wood. Each piece is unique with natural character marks.',
      dimensions: 'W240 x D100 x H76 cm',
      material: 'Reclaimed Mango Wood',
      price: 38000,
      moq: 8,
      featured: true,
      categoryId: dining!.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800', isPrimary: true, order: 0 },
      ],
    },
    {
      name: 'Executive Work Desk',
      slug: 'executive-work-desk',
      description: 'Spacious executive desk with built-in cable management and modesty panel. Ideal for corporate offices.',
      dimensions: 'W180 x D80 x H76 cm',
      material: 'Solid Sheesham Wood',
      price: 28000,
      moq: 20,
      featured: false,
      categoryId: office!.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800', isPrimary: true, order: 0 },
      ],
    },
    {
      name: 'Rajwada Wardrobe',
      slug: 'rajwada-wardrobe',
      description: 'Grand 6-door wardrobe with intricate brass inlay work. Combines traditional craftsmanship with modern storage solutions.',
      dimensions: 'W250 x D60 x H220 cm',
      material: 'Solid Teak, Brass Fittings',
      price: 85000,
      moq: 3,
      featured: true,
      categoryId: bedroom!.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', isPrimary: true, order: 0 },
      ],
    },
    {
      name: 'Lotus Coffee Table',
      slug: 'lotus-coffee-table',
      description: 'Low-profile coffee table with hand-carved lotus motif. Perfect centerpiece for any living room.',
      dimensions: 'W120 x D60 x H45 cm',
      material: 'Solid Rosewood',
      price: 18000,
      moq: 15,
      featured: false,
      categoryId: livingRoom!.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800', isPrimary: true, order: 0 },
      ],
    },
  ]

  for (const product of products) {
    const { images, ...productData } = product
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } })
    if (!existing) {
      const created = await prisma.product.create({ data: productData })
      for (const img of images) {
        await prisma.productImage.create({ data: { ...img, productId: created.id, altText: productData.name } })
      }
    }
  }

  // Site content
  const siteContents = [
    { key: 'hero_title', value: 'Crafted for Generations' },
    { key: 'hero_subtitle', value: 'Premium furniture handcrafted by master artisans. Serving homes, hotels, and offices across India.' },
    { key: 'about_title', value: 'Three Decades of Craftsmanship' },
    { key: 'about_text', value: 'Since 1994, Craftura has been synonymous with quality furniture manufacturing. Our master craftsmen combine traditional Indian joinery techniques with contemporary design sensibilities to create pieces that stand the test of time.' },
    { key: 'phone', value: '+91 98765 43210' },
    { key: 'email', value: 'info@craftura.com' },
    { key: 'address', value: 'Plot 42, GIDC Industrial Estate, Ahmedabad, Gujarat 380025' },
    { key: 'whatsapp', value: '+919876543210' },
    // Navigation visibility — all enabled by default
    { key: 'nav_show_gallery',     value: 'true' },
    { key: 'nav_show_bulk_orders', value: 'true' },
    { key: 'nav_show_about',       value: 'true' },
    { key: 'nav_show_contact',     value: 'true' },
  ]

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: {},
      create: content,
    })
  }

  console.log('✅ Database seeded successfully')
  console.log('👤 Admin: admin@craftura.com / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
