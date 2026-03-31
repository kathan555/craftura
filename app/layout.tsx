import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Craftura Furniture',
    default: 'Craftura Furniture – Handcrafted Premium Furniture',
  },
  description: 'Premium handcrafted furniture for homes, hotels and offices. B2B bulk orders and custom manufacturing. Located in Ahmedabad, Gujarat.',
  keywords: ['furniture', 'handcrafted', 'custom furniture', 'bulk furniture', 'B2B furniture', 'Ahmedabad', 'Gujarat'],
  openGraph: {
    type: 'website',
    siteName: 'Craftura Furniture',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain-overlay">{children}</body>
    </html>
  )
}
