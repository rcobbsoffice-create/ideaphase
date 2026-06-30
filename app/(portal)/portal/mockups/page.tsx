import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, FileCode } from 'lucide-react'

export default async function PortalMockupsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase.from('clients').select('id').eq('profile_id', user.id).single()
  if (!client) redirect('/portal')

  const { data: mockups } = await supabase
    .from('mockups')
    .select('*, projects(name)')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mockups & Previews</h1>
        <p className="text-muted-foreground text-sm mt-1">Website designs and mockups shared with you</p>
      </div>

      {(mockups ?? []).length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center">
          <FileCode className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No mockups shared yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {(mockups ?? []).map((m: any) => (
            <div key={m.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileCode className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{m.name}</p>
                  {m.projects?.name && (
                    <p className="text-xs text-muted-foreground mt-0.5">{m.projects.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <Link
                href={`/view/${m.share_token}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" /> View Mockup
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
