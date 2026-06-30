'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { LayoutDashboard, FileText, Image, LogOut } from 'lucide-react'
import NextImage from 'next/image'

const nav = [
  { href: '/portal', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/portal/invoices', label: 'Invoices', icon: FileText },
  { href: '/portal/mockups', label: 'Mockups', icon: Image },
]

export function PortalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
  }

  return (
    <header className="fixed top-0 inset-x-0 h-14 bg-sidebar border-b border-sidebar-border z-40 flex items-center px-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-10">
        <NextImage src="/favicon-icon.png" alt="IdeaPhase" width={28} height={28} className="object-contain shrink-0" />
        <span className="text-sm font-bold tracking-widest">
          <span className="text-white">IDEA</span><span style={{ color: '#00C9A7' }}>PHASE</span>
        </span>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Client Portal</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1 flex-1">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={signOut}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </header>
  )
}
