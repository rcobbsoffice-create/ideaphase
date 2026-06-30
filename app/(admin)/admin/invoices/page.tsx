import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, DollarSign } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { InvoiceStatusUpdate } from '@/components/admin/InvoiceStatusUpdate'

const statusColor: Record<string, string> = {
  paid: 'bg-primary/10 text-primary',
  unpaid: 'bg-amber-500/10 text-amber-400',
  overdue: 'bg-red-500/10 text-red-400',
  cancelled: 'bg-secondary text-muted-foreground',
}

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(full_name, email)')
    .order('created_at', { ascending: false })

  const totalPaid = (invoices ?? []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = (invoices ?? []).filter(i => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">{invoices?.length ?? 0} total invoices</p>
        </div>
        <Link href="/admin/invoices/new" className={buttonVariants({ variant: 'default' }) + ' bg-primary hover:bg-primary/90 text-white cursor-pointer'}>
          <Plus className="w-4 h-4 mr-2" /> Create Invoice
        </Link>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Collected</p>
          </div>
          <p className="text-xl font-bold text-primary">${(totalPaid / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <p className="text-xl font-bold text-amber-400">${(totalPending / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 border-b border-border bg-secondary/50">
          <span>Invoice</span>
          <span>Client</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {(invoices ?? []).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No invoices yet</div>
        ) : (
          <div className="divide-y divide-border">
            {(invoices ?? []).map((inv: any) => (
              <div key={inv.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center px-5 py-4 hover:bg-secondary/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.title}</p>
                  {inv.description && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{inv.description}</p>}
                  {inv.due_date && <p className="text-xs text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString()}</p>}
                </div>
                <div>
                  <p className="text-sm text-foreground">{inv.clients?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{inv.clients?.email}</p>
                </div>
                <p className="text-sm font-semibold text-foreground pr-8">${(inv.amount / 100).toFixed(2)}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium mr-4 ${statusColor[inv.status]}`}>
                  {inv.status}
                </span>
                <InvoiceStatusUpdate invoiceId={inv.id} currentStatus={inv.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
