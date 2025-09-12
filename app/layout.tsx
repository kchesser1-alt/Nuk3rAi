import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import ClientProviders from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NUKER AI - Advanced AI Interface',
  description: 'NUKER AI - Advanced artificial intelligence with uncensored capabilities for honest, direct responses. Get weather information, news updates, and engage in open discussions.',
  keywords: ['AI', 'artificial intelligence', 'chat', 'weather', 'news', 'NUKER'],
  authors: [{ name: 'NUKER AI' }],
  creator: 'NUKER AI',
  publisher: 'NUKER AI',
  openGraph: {
    title: 'NUKER AI - Advanced AI Interface',
    description: 'Advanced artificial intelligence with uncensored capabilities for honest, direct responses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NUKER AI - Advanced AI Interface',
    description: 'Advanced artificial intelligence with uncensored capabilities for honest, direct responses.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: 'hsl(180, 100%, 50%)',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClientProviders>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </ClientProviders>
      </body>
    </html>
  )
}