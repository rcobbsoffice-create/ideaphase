import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PayInvoiceButton } from '@/components/portal/PayInvoiceButton'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default async function PortalInvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase.from('clients').select('id').eq('profile_id', user.id).single()
  if (!client) redirect('/portal')

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  const totalPaid = (invoices ?? []).filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalDue = (invoices ?? []).filter(i => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
        <p className="text-muted-foreground text-sm mt-1">Your billing history with IdeaPhase</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
          <p className="text-xl font-bold text-primary">${(totalPaid / 100).toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Amount Due</p>
          <p className="text-xl font-bold text-amber-400">${(totalDue / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Invoices list */}
      <div className="space-y-3">
        {(invoices ?? []).length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center">
            <p className="text-muted-foreground text-sm">No invoices yet</p>
          </div>
        ) : (
          (invoices ?? []).map((inv: any) => (
            <div key={inv.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                inv.status === 'paid' ? 'bg-primary/10' :
                inv.status === 'unpaid' ? 'bg-amber-500/10' : 'bg-red-500/10'
              }`}>
                {inv.status === 'paid' ? <CheckCircle2 className="w-4 h-4 text-primary" /> :
                 inv.status === 'unpaid' ? <Clock className="w-4 h-4 text-amber-400" /> :
                 <AlertCircle className="w-4 h-4 text-red-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{inv.title}</p>
                {inv.description && <p className="text-sm text-muted-foreground mt-0.5 truncate">{inv.description}</p>}
                <div className="flex items-center gap-3 mt-1">
                  {inv.due_date && (
                    <p className="text-xs text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                  )}
                  {inv.paid_at && (
                    <p className="text-xs text-primary">Paid {new Date(inv.paid_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-foreground">${(inv.amount / 100).toFixed(2)}</p>
                {inv.status === 'unpaid' && (
                  <PayInvoiceButton invoiceId={inv.id} amount={inv.amount} title={inv.title} />
                )}
                {inv.status === 'paid' && (
                  <span className="text-xs text-primary font-medium">Paid ✓</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
