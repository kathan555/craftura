import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../components/ui/ThemeProvider'

export const metadata: Metadata = {
  title: {
    template: '%s | Craftura Furniture',
    default: 'Craftura Furniture – Handcrafted Premium Furniture',
  },
  description: 'Premium handcrafted furniture for homes, hotels and offices. B2B bulk orders and custom manufacturing. Located in Ahmedabad, Gujarat.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem('craftura-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&p)){document.documentElement.classList.add('dark');}}catch(e){}})();`
        }} />
      </head>
      <body className="grain-overlay">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}