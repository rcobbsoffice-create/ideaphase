'use client'

import { useState } from 'react'
import { updateInvoiceStatusAction } from '@/app/actions/invoices'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

export function InvoiceStatusUpdate({ invoiceId, currentStatus }: { invoiceId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(value: string) {
    setLoading(true)
    const result = await updateInvoiceStatusAction(invoiceId, value)
    setLoading(false)
    if (result?.error) toast.error(result.error)
    else toast.success('Status updated')
  }

  if (loading) return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />

  return (
    <Select defaultValue={currentStatus} onValueChange={(v) => v && handleChange(v)}>
      <SelectTrigger className="w-28 h-7 text-xs bg-secondary border-border cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        <SelectItem value="unpaid" className="text-xs cursor-pointer">Unpaid</SelectItem>
        <SelectItem value="paid" className="text-xs cursor-pointer">Paid</SelectItem>
        <SelectItem value="overdue" className="text-xs cursor-pointer">Overdue</SelectItem>
        <SelectItem value="cancelled" className="text-xs cursor-pointer">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
}
