import { PortalNav } from '@/components/portal/PortalNav'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PortalNav />
      <main className="pt-14">
        {children}
      </main>
    </div>
  )
}
