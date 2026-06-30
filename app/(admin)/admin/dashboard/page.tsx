import { createClient } from '@/lib/supabase/server'
import { Users, DollarSign, FileText, Image, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

function StatCard({
  label, value, icon: Icon, sub, color = 'text-primary'
}: { label: string; value: string; icon: React.ElementType; sub?: string; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 lg:p-6">
      <div className="flex items-start justify-between mb-3 lg:mb-4">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${color}`} />
        </div>
        <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
      </div>
      <p className="text-xl lg:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs lg:text-sm text-muted-foreground mt-1">{label}</p>
      {sub && <p className="text-xs text-primary mt-1.5">{sub}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: clientCount },
    { data: invoices },
    { count: mockupCount },
    { data: recentClients },
    { data: recentInvoices },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('amount, status'),
    supabase.from('mockups').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('id, full_name, company, email, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('invoices').select('id, title, amount, status, created_at, clients(full_name)').order('created_at', { ascending: false }).limit(5),
  ])

  const totalRevenue = (invoices ?? []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const pendingRevenue = (invoices ?? []).filter(i => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0)

  const statusColor: Record<string, string> = {
    paid: 'bg-primary/10 text-primary',
    unpaid: 'bg-amber-500/10 text-amber-400',
    overdue: 'bg-red-500/10 text-red-400',
    cancelled: 'bg-secondary text-muted-foreground',
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back — here's your overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clients" value={String(clientCount ?? 0)} icon={Users} />
        <StatCard
          label="Revenue Collected"
          value={`$${(totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          sub={`$${(pendingRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} pending`}
        />
        <StatCard label="Total Invoices" value={String((invoices ?? []).length)} icon={FileText} />
        <StatCard label="Mockups Shared" value={String(mockupCount ?? 0)} icon={Image} />
      </div>

      {/* Recent activity grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground">Recent Clients</h2>
            <Link href="/admin/clients" className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {(recentClients ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No clients yet</p>
            ) : (recentClients ?? []).map(client => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {client.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{client.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{client.company ?? client.email}</p>
                </div>
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
          <Link
            href="/admin/clients/new"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            + Add Client
          </Link>
        </div>

        {/* Recent Invoices */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground">Recent Invoices</h2>
            <Link href="/admin/invoices" className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {(recentInvoices ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No invoices yet</p>
            ) : (recentInvoices ?? []).map((inv: any) => (
              <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{inv.title}</p>
                  <p className="text-xs text-muted-foreground">{inv.clients?.full_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">
                    ${(inv.amount / 100).toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inv.status]}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/invoices/new"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            + Create Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}
