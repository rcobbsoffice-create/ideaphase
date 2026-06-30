import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ExternalLink, Building2, Mail, Phone } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('*, projects(count), invoices(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{clients?.length ?? 0} total clients</p>
        </div>
        <Link href="/admin/clients/new" className={buttonVariants({ variant: 'default' }) + ' bg-primary hover:bg-primary/90 text-white cursor-pointer'}>
          <Plus className="w-4 h-4 mr-2" /> Add Client
        </Link>
      </div>

      {clients?.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center">
          <p className="text-muted-foreground mb-4">No clients yet. Add your first client to get started.</p>
          <Link href="/admin/clients/new" className={buttonVariants({ variant: 'default' }) + ' bg-primary hover:bg-primary/90 text-white cursor-pointer'}>
            <Plus className="w-4 h-4 mr-2" /> Add First Client
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {clients?.map((client: any) => (
            <Link
              key={client.id}
              href={`/admin/clients/${client.id}`}
              className="group bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {client.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{client.full_name}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {client.company && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="w-3 h-3" /> {client.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" /> {client.email}
                  </span>
                  {client.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" /> {client.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 text-center shrink-0">
                <div>
                  <p className="text-lg font-bold text-foreground">{client.projects?.[0]?.count ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{client.invoices?.[0]?.count ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Invoices</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
