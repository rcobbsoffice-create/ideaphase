'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function PayInvoiceButton({ invoiceId, amount, title }: {
  invoiceId: string
  amount: number
  title: string
}) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, amount, title }),
      })
      const { url, error } = await res.json()
      if (error) { toast.error(error); setLoading(false); return }
      window.location.href = url
    } catch {
      toast.error('Failed to start payment')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="mt-1 text-xs font-semibold bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin inline" /> : `Pay $${(amount / 100).toFixed(2)}`}
    </button>
  )
}
