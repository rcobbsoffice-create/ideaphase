import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Zap, ExternalLink } from 'lucide-react'

export default async function MockupViewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: mockup } = await supabase
    .from('mockups')
    .select('name, clients(full_name)')
    .eq('share_token', token)
    .single()

  if (!mockup) notFound()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="h-12 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-5 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-sm font-semibold text-foreground">IdeaPhase</span>
          <span className="text-muted-foreground text-sm mx-1">·</span>
          <span className="text-sm text-muted-foreground">{(mockup as any).name}</span>
        </div>
        <a
          href={`/api/mockups/${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open in tab
        </a>
      </div>

      {/* Iframe */}
      <iframe
        src={`/api/mockups/${token}`}
        className="flex-1 w-full border-0"
        title={(mockup as any).name}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  )
}
