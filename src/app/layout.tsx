import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { brand } from '@/data/site'
import { TransitionProvider } from '@/components/TransitionProvider'

/* Three typefaces, three jobs: a friendly geometric sans for UI and body, a heavy
   condensed display face for the oversized statements, a marker script for asides. */
const figtree = localFont({ src: '../../public/fonts/Figtree-var.woff2', weight: '300 900', variable: '--font-figtree', display: 'swap' })
const anton = localFont({ src: '../../public/fonts/Anton-400.woff2', weight: '400', variable: '--font-anton', display: 'swap' })
const caveat = localFont({ src: '../../public/fonts/Caveat-var.woff2', weight: '400 700', variable: '--font-caveat', display: 'swap' })

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  openGraph: { title: `${brand.name} — ${brand.tagline}`, description: brand.description, type: 'website' },
  twitter: { card: 'summary_large_image', title: brand.name, description: brand.description },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffd24a' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-page-theme="light" className={`${figtree.variable} ${anton.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body data-scrolling-started="false" data-page-theme="light" suppressHydrationWarning>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  )
}
