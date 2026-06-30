import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Image, CheckCircle2, Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function PortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('*, projects(*, updates(*))')
    .eq('profile_id', user.id)
    .single()

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Your account is being set up. Check back soon.</p>
        </div>
      </div>
    )
  }

  const [{ data: invoices }, { data: mockups }] = await Promise.all([
    supabase.from('invoices').select('*').eq('client_id', client.id).order('created_at', { ascending: false }),
    supabase.from('mockups').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(4),
  ])

  const unpaidInvoices = (invoices ?? []).filter(i => i.status === 'unpaid')
  const totalOwed = unpaidInvoices.reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {client.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's a summary of your work with IdeaPhase</p>
      </div>

      {/* Unpaid banner */}
      {unpaidInvoices.length > 0 && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-400">
              You have {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-amber-400/70 mt-0.5">Total due: ${(totalOwed / 100).toFixed(2)}</p>
          </div>
          <Link
            href="/portal/invoices"
            className="text-xs font-semibold bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Pay Now
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-foreground">Your Projects</h2>
          {(client.projects ?? []).length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center">
              <p className="text-muted-foreground text-sm">No projects yet. Your team will add them soon.</p>
            </div>
          ) : (
            (client.projects as any[]).map((proj: any) => (
              <div key={proj.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-foreground">{proj.name}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    proj.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                    proj.status === 'on_hold' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>
                {proj.description && <p className="text-sm text-muted-foreground mb-3">{proj.description}</p>}
                {(proj.updates as any[])?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" /> Updates
                    </p>
                    {(proj.updates as any[]).slice(0, 3).map((upd: any) => (
                      <div key={upd.id} className="flex gap-3 p-3 bg-secondary rounded-xl">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{upd.title}</p>
                          {upd.content && <p className="text-xs text-muted-foreground mt-0.5">{upd.content}</p>}
                          <p className="text-xs text-muted-foreground mt-1">{new Date(upd.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick stats */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{(invoices ?? []).length}</p>
                <p className="text-xs text-muted-foreground">Total Invoices</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {(invoices ?? []).filter(i => i.status === 'paid').length}
                </p>
                <p className="text-xs text-muted-foreground">Paid</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <Image className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{(mockups ?? []).length}</p>
                <p className="text-xs text-muted-foreground">Mockups Shared</p>
              </div>
            </div>
          </div>

          {/* Recent mockups */}
          {(mockups ?? []).length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Recent Mockups</h3>
                <Link href="/portal/mockups" className="text-xs text-primary cursor-pointer">View all</Link>
              </div>
              <div className="space-y-2">
                {(mockups ?? []).slice(0, 3).map((m: any) => (
                  <Link
                    key={m.id}
                    href={`/view/${m.share_token}`}
                    target="_blank"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-foreground flex-1 truncate">{m.name}</p>
                    <span className="text-xs text-primary">View →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
