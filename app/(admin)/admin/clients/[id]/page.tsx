import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, FileText, Image, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddProjectDialog } from '@/components/admin/AddProjectDialog'
import { AddUpdateDialog } from '@/components/admin/AddUpdateDialog'

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-secondary text-muted-foreground border-border',
  on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const [{ data: projects }, { data: invoices }, { data: mockups }] = await Promise.all([
    supabase.from('projects').select('*, updates(*)').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('mockups').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  const totalPaid = (invoices ?? []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = (invoices ?? []).filter(i => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href="/admin/clients" className="mt-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {client.full_name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-foreground">{client.full_name}</h1>
            </div>
            <div className="flex items-center gap-3 mt-1 ml-13">
              <p className="text-muted-foreground text-sm">{client.email}</p>
              {client.company && <span className="text-muted-foreground text-sm">· {client.company}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Collected</p>
            <p className="text-lg font-bold text-emerald-400">${(totalPaid / 100).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-lg font-bold text-amber-400">${(totalPending / 100).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground">Projects</h2>
              <AddProjectDialog clientId={id} />
            </div>
            {(projects ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No projects yet</p>
            ) : (
              <div className="space-y-4">
                {(projects ?? []).map((proj: any) => (
                  <div key={proj.id} className="border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{proj.name}</p>
                        {proj.description && <p className="text-sm text-muted-foreground mt-0.5">{proj.description}</p>}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[proj.status]}`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>
                    {/* Updates */}
                    {proj.updates?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updates</p>
                        {proj.updates.map((upd: any) => (
                          <div key={upd.id} className="bg-secondary rounded-lg p-3">
                            <p className="text-sm font-medium text-foreground">{upd.title}</p>
                            {upd.content && <p className="text-xs text-muted-foreground mt-1">{upd.content}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3">
                      <AddUpdateDialog projectId={proj.id} clientId={id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Invoices */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Invoices</h2>
              <Link href={`/admin/invoices/new?client=${id}`} className="cursor-pointer">
                <Button size="sm" variant="outline" className="border-border text-xs cursor-pointer">
                  <Plus className="w-3 h-3 mr-1" /> New
                </Button>
              </Link>
            </div>
            {(invoices ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No invoices yet</p>
            ) : (
              <div className="space-y-2">
                {(invoices ?? []).map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{inv.title}</p>
                      <p className="text-xs text-muted-foreground">${(inv.amount / 100).toFixed(2)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      inv.status === 'unpaid' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mockups */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Mockups</h2>
              <Link href={`/admin/mockups?client=${id}`} className="cursor-pointer">
                <Button size="sm" variant="outline" className="border-border text-xs cursor-pointer">
                  <Plus className="w-3 h-3 mr-1" /> Upload
                </Button>
              </Link>
            </div>
            {(mockups ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No mockups shared yet</p>
            ) : (
              <div className="space-y-2">
                {(mockups ?? []).map((m: any) => (
                  <div key={m.id} className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                    <Image className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-foreground flex-1 truncate">{m.name}</p>
                    <Link
                      href={`/view/${m.share_token}`}
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-3">Notes</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{client.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
