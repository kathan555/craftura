# Craftura Fine Furniture 🪑

A full-stack furniture manufacturing website with B2B/B2C ordering, admin panel, and CMS — built with Next.js 14, Prisma ORM, and SQLite (PostgreSQL-ready).

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your settings

# 3. Generate Prisma client & push schema
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma db push

# 4. Seed the database with sample data
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)

**Default Admin Credentials:**
- Email: `admin@craftura.com`
- Password: `admin123`

---

## 📁 Project Structure

```
craftura/
├── app/
│   ├── (store)/              # Customer-facing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Products listing + detail
│   │   ├── about/            # About Us
│   │   ├── contact/          # Contact
│   │   └── bulk-orders/      # B2B orders
│   ├── (admin)/admin/        # Admin panel (protected)
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # Product management
│   │   ├── categories/       # Category management
│   │   ├── orders/           # Order management
│   │   ├── inquiries/        # Inquiry management
│   │   ├── content/          # CMS / site content
│   │   └── login/            # Admin login
│   └── api/                  # API routes
│       ├── auth/             # Login / logout
│       ├── products/         # Products CRUD
│       ├── categories/       # Categories CRUD
│       ├── orders/           # Orders CRUD
│       ├── inquiries/        # Inquiries CRUD
│       └── admin/            # Stats + content
├── components/
│   ├── layout/               # Navbar, Footer, WhatsApp
│   ├── admin/                # Admin-specific components
│   └── store/                # Customer-facing components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── auth.ts               # JWT auth utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── middleware.ts             # Auth protection middleware
└── .env                      # Environment variables
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:migrate` | Run migrations (production) |

---

## 🗄️ Migrating to PostgreSQL

1. Install PostgreSQL adapter:
   ```bash
   npm install pg
   ```

2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   # ← change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/craftura"
   ```

4. Run migration:
   ```bash
   npx prisma migrate dev --name init
   ```

That's it — **no other code changes required.**

---

## 🔒 Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"          # SQLite (change for PostgreSQL)

# Auth
JWT_SECRET="your-super-secret-key"    # Change in production!
NEXTAUTH_SECRET="your-nextauth-key"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+919876543210"

# Email (optional — for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="your-app-password"
ADMIN_EMAIL="admin@craftura.com"
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| ORM | Prisma 5 |
| Database | SQLite → PostgreSQL |
| Auth | JWT + bcryptjs |
| Language | TypeScript |
| Fonts | Playfair Display + DM Sans |

---

## 🎨 Design System

- **Primary font:** Playfair Display (headings)
- **Body font:** DM Sans
- **Accent font:** Cormorant Garamond
- **Colors:** Wood tones (#c4783a), Charcoal (#1c1917), Cream (#fdfaf5)
- **Neutral palette:** Stone-50 → Stone-900

---

## 📱 Pages

### Customer (Public)
| Page | URL |
|------|-----|
| Homepage | `/` |
| Products | `/products` |
| Product Detail | `/products/[slug]` |
| About Us | `/about` |
| Contact | `/contact` |
| Bulk Orders | `/bulk-orders` |

### Admin (Protected)
| Page | URL |
|------|-----|
| Login | `/admin/login` |
| Dashboard | `/admin` |
| Products | `/admin/products` |
| New Product | `/admin/products/new` |
| Edit Product | `/admin/products/[id]/edit` |
| Categories | `/admin/categories` |
| Orders | `/admin/orders` |
| Inquiries | `/admin/inquiries` |
| Site Content | `/admin/content` |

---

## 🚀 Deployment

### Vercel (Recommended for MVP)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### With PostgreSQL (Production)
1. Create a PostgreSQL database (Supabase, Neon, Railway, or self-hosted)
2. Update `DATABASE_URL` in environment
3. Update `schema.prisma` provider to `postgresql`
4. Run `npx prisma migrate deploy`
5. Run seed script once

---

## 📈 Future Roadmap

- [ ] Online payment integration (Razorpay / Stripe)
- [ ] User accounts & order tracking portal
- [ ] Product image upload (Cloudinary / S3)
- [ ] Email notifications (Nodemailer)
- [ ] Multi-language support (Hindi / Gujarati)
- [ ] Inventory management
- [ ] Role-based admin access
- [ ] Product reviews system
- [ ] Analytics dashboard

---

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Set `NODE_ENV=production` for secure cookies
- Consider rate limiting for API routes
- Keep `admin123` password only for development

---

## 📄 License

Private — All rights reserved, Craftura Fine Furniture

---

## ▶️ To Quick Run

unzip craftura.zip && cd craftura
npm install
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma db push
npm run db:seed
npm run dev

___

Admin: admin@craftura.com / admin123
To migrate to PostgreSQL: change 2 lines in schema.prisma and .env — nothing else.