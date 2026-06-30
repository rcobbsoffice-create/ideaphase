import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'IdeaPhase',
  description: 'Client management portal by IdeaPhase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${jakarta.variable}`}>
      <body className="min-h-full bg-background text-foreground font-[family-name:var(--font-jakarta)]">
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  )
}
