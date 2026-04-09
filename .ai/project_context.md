# Craftura Fine Furniture — AI Project Context

> **AI instructions:** Read this file first every session. Use it to understand the project
> and decide which files you actually need to open. Update the "Recent Changes" section
> before finishing any session with meaningful edits. Keep total size under 2000 tokens.

---

## 1. Project Goal

Full-stack furniture manufacturing website for a B2B/B2C furniture business in Ahmedabad,
India. Customers browse/order furniture; admin manages products, orders, content, and team.

**Stack:** Next.js 14 (App Router) · Prisma 5 · SQLite (PostgreSQL-ready) · Tailwind CSS 3
· TypeScript · JWT auth · Nodemailer · No UI library

**Pinned versions (do not upgrade):**
`next@14.2.35` · `react@18.3.1` · `prisma@5.22.0` · `tailwindcss@3.4.4` · `typescript@^5.4.5`

---

## 2. Architecture Overview

> For every individual file with a one-line summary, see `.ai/architecture.md`.

```
craftura/
├── app/
│   ├── (store)/          → Customer-facing pages (Server Components + Client shells)
│   ├── (admin)/admin/    → Admin panel (JWT protected via layout + x-pathname header trick)
│   └── api/              → REST API routes — no auth library, manual session checks
├── components/
│   ├── admin/            → Admin-only UI components (all 'use client')
│   ├── store/            → Customer-facing client components (all 'use client')
│   ├── layout/           → Navbar (receives navSettings props), Footer, WhatsAppFloat
│   └── ui/               → CartContext, ThemeProvider, AddToCartButton, WhatsAppButton
├── lib/                  → prisma (singleton), auth (JWT+bcrypt), email (Nodemailer),
│                           seo (metadata+JSON-LD), whatsapp (wa.me link builders)
├── prisma/               → schema.prisma (11 models) + seed.ts
├── middleware.ts          → Edge Runtime — ZERO lib/ imports. Cookie check + x-pathname header.
└── .ai/                  → AI context (project_context.md + architecture.md)
```

**Critical architecture rule:** `middleware.ts` must have ZERO imports from `lib/` or
`next/headers` — those don't run in Edge Runtime and crash every request. Only use
`req.cookies` and `NextResponse` directly in middleware.

---

## 3. Auth System

**Flow:** JWT cookie (`admin_token`, httpOnly, 7d) → `getAdminSession()` in `lib/auth.ts`
checks cookie + DB (`isActive` must be true) → returns session or null.

**Roles:** `isSuperAdmin: boolean` + `role: 'superadmin' | 'admin'`

**Public admin routes** (no auth): `/admin/login`, `/admin/register`
Both need their own `layout.tsx` (passthrough) AND the admin layout checks `x-pathname`
header (set by middleware) to skip the redirect for these paths.

**Admin layout pattern** (`app/(admin)/admin/layout.tsx`):
1. Read `x-pathname` from headers (set by middleware)
2. If path is login or register → `return <>{children}</>` (no auth check)
3. Otherwise → `getAdminSession()` → redirect to login if null

**Registration flow:**
`/admin/register` → `POST /api/auth/register` → creates `isActive=false` → emails all
super admins → success screen. Super admin approves at `/admin/users` →
`PATCH /api/admin/users/[id]` with `action: 'approve'` → sets `isActive=true` → emails user.

---

## 4. Database Models (prisma/schema.prisma)

| Model | Key fields | Notes |
|-------|-----------|-------|
| `Product` | name, slug, price, moq, featured, inStock | Has many ProductImages |
| `Category` | name, slug, imageUrl | Has many Products |
| `ProductImage` | url, isPrimary, order | Cascade delete with Product |
| `Order` | orderNumber (CRF-xxx), status, orderType (B2B/B2C), email | Has many OrderItems |
| `OrderItem` | quantity, notes | Links Order ↔ Product |
| `Inquiry` | name, email, message, isRead | Contact form submissions |
| `Admin` | email, isActive, isSuperAdmin, role | isActive=false until approved |
| `SiteContent` | key, value | Key-value CMS store |
| `GalleryItem` | title, imageUrl, category, featured | |
| `Testimonial` | name, role, quote, rating, featured, order | Shown on homepage when featured=true |
| `BlogPost` | title, slug, content, published, readTime, views | publishedAt set on first publish |

**Order statuses:** `PENDING → CONFIRMED → IN_PRODUCTION → DELIVERED` · also `CANCELLED`
Customer can self-cancel PENDING only (requires email verification in cancel API).

---

## 5. Navigation Visibility (CMS-controlled)

Admin can toggle nav items at `/admin/content`. Settings stored in `SiteContent` table.

| Key | Controls | Default |
|-----|----------|---------|
| `nav_show_gallery` | Gallery page link | true |
| `nav_show_bulk_orders` | "Order Details" dropdown | true |
| `nav_show_blog` | Blog link | true |
| `nav_show_about` | About Us link | true |
| `nav_show_contact` | Contact link | true |

**Parent auto-hide rule:** "Order Details" dropdown (`showOrderDetails` in Navbar) is computed
from its children — currently `navSettings.nav_show_bulk_orders`. When Order Tracking is added,
extend this with `|| navSettings.nav_show_order_tracking`.

Nav settings are fetched in `app/(store)/layout.tsx` (server component) and passed as props
to `Navbar` and `Footer`. **Never fetch nav settings client-side.**

---

## 6. Key Patterns

**Server + Client shell pattern** (used for all complex store pages):
```
app/(store)/contact/page.tsx        ← server, exports metadata, renders:
components/store/ContactClient.tsx  ← 'use client', all interactivity
```

**Admin pages** are mostly server components that fetch data and pass to client components.
Exception: analytics (`/admin/analytics`) is fully client-side — fetches from API on mount.

**Image uploads:** `POST /api/upload` saves to `public/uploads/`. Returns `{ urls: string[] }`.
Works locally. For Vercel/serverless: must migrate to Cloudinary/S3 (only upload route changes).

**Email:** `lib/email.ts` uses Nodemailer. If SMTP env vars are missing, emails silently skip.
Never await email sends in critical paths — always `.catch(err => console.error(...))`.

**WhatsApp links:** `lib/whatsapp.ts` generates pre-filled `wa.me` URLs.
`NEXT_PUBLIC_WHATSAPP_NUMBER` in env.

**SEO:** `lib/seo.ts` exports `buildMetadata()`, `productJsonLd()`, `breadcrumbJsonLd()`,
`faqJsonLd()`, `localBusinessJsonLd()`, `articleJsonLd()`. Use these on all public pages.

**Dark mode:** CSS variables in `globals.css` under `[data-theme="dark"]`. `ThemeProvider`
(client) reads localStorage and sets `data-theme` on `<html>`. All colors use `var(--*)`.

**Analytics charts:** Pure SVG — no chart library. Fixed coordinate system: `CW=460`, `CH=140`,
`ML=36` (Y-axis margin), `MB=24` (X-axis margin). `yTicks()` computes clean round numbers.
`skipEvery()` avoids label overlap at 12 months.

**Export (CSV/XLSX):** Pure Node.js ZIP + OOXML builder in `app/api/admin/export/route.ts`.
No library. Supports orders, inquiries, products with date range filter.

---

## 7. All Pages Reference

### Customer (public)
| URL | File | Notes |
|-----|------|-------|
| `/` | `(store)/page.tsx` | Server. Fetches featured products, categories, testimonials (featured=true), 3 blog posts |
| `/products` | `(store)/products/page.tsx` | Server. Search + category filter |
| `/products/[slug]` | `(store)/products/[slug]/page.tsx` | Server + `generateMetadata` + Product JSON-LD |
| `/gallery` | `(store)/gallery/page.tsx` | Shell → `GalleryClient` (masonry + lightbox) |
| `/blog` | `(store)/blog/page.tsx` | Server. Featured hero + grid + category filter |
| `/blog/[slug]` | `(store)/blog/[slug]/page.tsx` | Server + Article JSON-LD + view counter + prev/next |
| `/bulk-orders` | `(store)/bulk-orders/page.tsx` | Shell → `BulkOrdersClient` + FAQ JSON-LD |
| `/inquiry-cart` | `(store)/inquiry-cart/page.tsx` | Shell → `InquiryCartClient`. noIndex. |
| `/track-order` | `(store)/track-order/page.tsx` | Shell → `TrackOrderClient`. Animated tracker + cancel |
| `/about` | `(store)/about/page.tsx` | Server |
| `/contact` | `(store)/contact/page.tsx` | Shell → `ContactClient` |

### Admin (protected — all behind JWT + isActive check)
| URL | Notes |
|-----|-------|
| `/admin` | Dashboard stats |
| `/admin/analytics` | Charts (client) + data table + CSV/XLSX export |
| `/admin/products` | List/create/edit/delete products with image upload |
| `/admin/categories` | CRUD categories |
| `/admin/orders` | Status updater (PENDING/CONFIRMED/IN_PRODUCTION/DELIVERED/CANCELLED) |
| `/admin/inquiries` | Mark read/unread |
| `/admin/gallery` | Upload gallery images |
| `/admin/testimonials` | CRUD + star rating + featured toggle → homepage |
| `/admin/blog` | List posts (published/draft) |
| `/admin/blog/new` | `BlogEditor` component (markdown, cover upload, publish) |
| `/admin/blog/[slug]/edit` | Edit existing post |
| `/admin/content` | CMS text + nav visibility toggles |
| `/admin/users` | **Super admin only.** Approve/deactivate/promote/demote/delete |
| `/admin/login` | Public. Amber banner for pending_approval state |
| `/admin/register` | Public. Password strength meter + reason field |

---

## 8. API Routes Reference

```
/api/auth/login          POST   — returns admin_token cookie
/api/auth/logout         POST   — clears cookie
/api/auth/register       POST   — creates isActive=false, emails super admins

/api/products            GET/POST
/api/products/[id]       GET/PATCH/DELETE
/api/categories          GET/POST
/api/categories/[id]     PATCH/DELETE
/api/orders              GET/POST
/api/orders/[id]         GET/PATCH (admin status update)
/api/inquiries           GET/POST
/api/inquiries/[id]      PATCH/DELETE
/api/gallery             GET/POST
/api/gallery/[id]        PATCH/DELETE
/api/testimonials        GET/POST
/api/testimonials/[id]   PATCH/DELETE
/api/blog                GET/POST  (?admin=true for drafts)
/api/blog/[slug]         GET/PATCH/DELETE (GET increments views for public)
/api/upload              POST  — saves to public/uploads/, returns { urls }

/api/track-order         GET   — public, search by orderNumber or email (masked response)
/api/track-order/cancel  POST  — public, requires orderNumber + email match, PENDING only

/api/admin/analytics     GET   — ?months=3|6|12, returns chart data
/api/admin/export        GET   — ?type=orders|inquiries|products&format=csv|xlsx&from=&to=
/api/admin/content       GET/PUT — site content key-value pairs
/api/admin/stats         GET   — dashboard summary stats
/api/admin/users         GET   — super admin only, list all admins
/api/admin/users/[id]    PATCH/DELETE — actions: approve|deactivate|promote|demote
```

---

## 9. Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+919876543210"
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS   ← optional, emails skip if missing
ADMIN_EMAIL="admin@craftura.com"
```

---

## 10. Recent Changes (newest first)

1. **Admin registration + approval system** — `/admin/register` (public), `/admin/users`
   (super admin), `UsersManager.tsx`, `api/auth/register`, `api/admin/users/[id]`.
   Admin layout reads `x-pathname` header from middleware to skip auth on login/register.
2. **Middleware fixed** — removed `verifyToken` import (crashes Edge Runtime). Now cookie-only
   check. Middleware sets `x-pathname` header for admin layout.
3. **Testimonials (#16)** — `Testimonial` DB model, `TestimonialsManager.tsx`, `/admin/testimonials`.
   Homepage pulls from DB (featured=true only). Hardcoded testimonials removed.
4. **Blog (#17)** — `BlogPost` DB model, `BlogEditor.tsx`, public `/blog` + `/blog/[slug]`,
   admin `/admin/blog`. Article JSON-LD, view counter, prev/next. Blog toggle in nav settings.
5. **Analytics (#11) + Export (#12)** — `AnalyticsDashboard.tsx` (pure SVG charts, Charts/Table
   toggle), `api/admin/export` (pure OOXML XLSX + CSV, no library).
6. **Order tracking (#4)** — `/track-order` with animated 4-step progress tracker. Customer
   self-cancel (PENDING only, email verification). Admin notified on cancel.
7. **Nav visibility control** — Admin toggles per-page nav items in CMS. Parent "Order Details"
   auto-hides when all children hidden. `nav_show_*` keys in SiteContent.
8. **Inquiry cart** — `CartContext`, `CartIcon`, `AddToCartButton`. Multi-item cart, single
   order submission. Success screen links to order tracking.
9. **SEO** — `lib/seo.ts`, dynamic sitemap, robots.txt, JSON-LD on all key pages.
10. **Dark mode** — CSS variable system, `ThemeProvider`, `ThemeToggle`, warm brown dark theme.

---

## 11. Open TODOs

- [ ] Deploy to Vercel + migrate DB to PostgreSQL (Neon/Supabase)
- [ ] Cloudinary/S3 for image uploads (only `api/upload/route.ts` needs changing)
- [ ] Image optimization — convert uploads to WebP on save
- [ ] Homepage gallery preview section (gallery exists, not previewed on homepage)
- [ ] Product comparison tool
- [ ] Downloadable PDF product catalogue
- [ ] Inventory / stock management
- [ ] B2B account registration + order history portal
- [ ] Click-to-call floating button (mobile)
- [ ] Online payment (Razorpay)
- [ ] PWA manifest + service worker
- [ ] Multi-language (Hindi / Gujarati) with `next-intl`
- [ ] Rate limiting on public APIs (track-order, orders, inquiries)
