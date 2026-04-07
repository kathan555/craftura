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
    { key: 'nav_show_blog',        value: 'true' },
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


  // ── Testimonials (moved from hardcoded homepage) ────────────
  const testimonials = [
    {
      name: 'Rajesh Patel',
      role: 'GM, The Heritage Grand Hotel',
      location: 'Ahmedabad',
      quote: 'Craftura supplied all the furniture for our 80-room boutique hotel. The quality is exceptional and delivery was on time. Highly recommend for bulk orders.',
      rating: 5, featured: true, order: 0,
    },
    {
      name: 'Priya Mehta',
      role: 'Facilities Manager, TechCorp India',
      location: 'Ahmedabad',
      quote: 'We have been ordering office furniture for our 5 branches from Craftura for 6 years. Consistent quality, great service, and the customization options are unmatched.',
      rating: 5, featured: true, order: 1,
    },
    {
      name: 'Anita Sharma',
      role: 'Homeowner',
      location: 'Surat',
      quote: 'The bedroom set I ordered is absolutely stunning. The craftsmanship is visible in every joint and finish. Worth every rupee.',
      rating: 5, featured: true, order: 2,
    },
  ]

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, role: t.role } })
    if (!existing) await prisma.testimonial.create({ data: t })
  }

  // ── Blog posts (sample craft stories) ────────────────────────
  const blogPosts = [
    {
      title: 'How We Source Our Teak: A Journey from Forest to Furniture',
      slug: 'how-we-source-our-teak',
      excerpt: 'Teak is the backbone of premium Indian furniture. At Craftura, we only source from certified sustainable plantations. Here is exactly how that process works.',
      content: `# How We Source Our Teak

At Craftura, teak is not just a material — it is a commitment. Every beam, plank, and joint that leaves our workshop in Ahmedabad tells a story that begins hundreds of kilometres away in the sustainably managed forests of South India.

## Why Teak?

Teak (Tectona grandis) has been the gold standard for fine furniture for over 400 years. Its natural oils make it resistant to moisture, insects, and warping. A well-crafted teak piece does not just last a lifetime — it lasts generations.

## Our Sourcing Process

**Step 1: Certified Plantation Partners**

We work exclusively with Forest Stewardship Council (FSC) certified plantations in Karnataka and Kerala. These plantations operate on 25-year growth cycles, ensuring that for every tree harvested, three more are planted.

**Step 2: On-Site Inspection**

Our master craftsman Ramesh Patel personally visits our suppliers twice a year. He inspects the grain, density, and moisture content of each batch before a single log is purchased.

**Step 3: Seasoning**

Raw teak must be seasoned — slowly dried — before it can be worked. We air-dry our timber for a minimum of 18 months in our open yards. Kiln-drying shortcuts this process but compromises the wood's stability. We never cut corners here.

**Step 4: Milling**

Once seasoned, the timber is milled in our own facility. This gives us complete control over plank dimensions and quality, rather than accepting whatever a third-party mill provides.

## The Result

A piece of Craftura furniture made from our teak will not crack, warp, or lose its finish under normal Indian conditions — including the humidity of monsoon season. We stand behind this with our 10-year structural warranty.

*Next time you run your hand across a Craftura surface, you are touching wood that was a living tree not so long ago — and was handled with respect every step of the way.*`,
      coverImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200',
      category: 'Craft & Materials',
      tags: 'teak,sourcing,sustainability,materials',
      published: true,
      readTime: 5,
      publishedAt: new Date('2024-09-15'),
    },
    {
      title: '5 Questions to Ask Before Buying a Sofa',
      slug: '5-questions-before-buying-sofa',
      excerpt: 'A sofa is a 10-year commitment. Most buyers focus on colour and price. Here are the five questions that actually determine whether you will love it a decade from now.',
      content: `# 5 Questions to Ask Before Buying a Sofa

A sofa is one of the most important purchases in a home. Most people spend more time choosing a phone than a sofa — despite the fact that the sofa will be in their living room for the next decade. Here are the five questions we always encourage our customers to ask.

## 1. What Is the Frame Made Of?

This is the single most important question. A sofa frame made from engineered wood or MDF will sag and creak within 2-3 years. Look for solid hardwood frames — sal, teak, or sheesham. At Craftura, all our sofa frames are solid wood, mortise-and-tenon jointed. Ask to see the joinery before you buy.

## 2. What Is the Spring and Cushion Construction?

**Springs:** Eight-way hand-tied springs are the gold standard. Sinuous (S-shaped) springs are acceptable. Avoid sofas with no springs at all — they are essentially just foam on a frame.

**Foam density:** The cushion foam density should be at least 32 kg/m³ for the seat. Lower density foam will compress and never recover within a few years.

## 3. Does It Fit Your Space — Really?

Measure twice. Then measure again. Consider:
- The sofa dimensions with cushions at full depth
- The pathway into your home (many sofas cannot navigate narrow hallways)
- The visual weight — a large sectional in a small room makes both look wrong

Our design team offers free space planning consultations. Use them.

## 4. How Is the Fabric or Leather Graded?

Fabric is graded A through F based on its rub count — how many times it can be rubbed before it shows wear. Grade A starts at 15,000 rubs. For a family home, you want Grade C or above (30,000+ rubs). Full-grain leather will last 15-20 years. Bonded leather (leather scraps glued to fabric) will start peeling in 3-5 years.

## 5. What Is the Warranty — and What Does It Actually Cover?

A confident manufacturer backs their product. Our sofas come with:
- 10-year warranty on the frame
- 3-year warranty on springs
- 1-year warranty on fabric/leather (fair wear excluded)

Ask for the warranty in writing, and read what is and is not covered.

---

*The right sofa, chosen with care, will be in your home long enough that your children will remember it. Take your time. We are happy to answer every question.*`,
      coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
      category: 'Buying Guide',
      tags: 'sofa,buying guide,tips,living room',
      published: true,
      readTime: 6,
      publishedAt: new Date('2024-10-03'),
    },
  ]

  for (const post of blogPosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (!existing) await prisma.blogPost.create({ data: post })
  }

  console.log('✅ Database seeded successfully')
  console.log('👤 Admin: admin@craftura.com / admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
