import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPaymentConfirmedEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const invoiceId = session.metadata?.invoiceId

    if (invoiceId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase.from('invoices').update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      }).eq('id', invoiceId)

      // Fetch invoice + client to send receipt
      const { data: invoice } = await supabase
        .from('invoices')
        .select('title, amount, clients(email, full_name)')
        .eq('id', invoiceId)
        .single()

      if (invoice) {
        const client = (invoice as any).clients
        if (client) {
          await sendPaymentConfirmedEmail({
            to: client.email,
            clientName: client.full_name,
            invoiceTitle: invoice.title,
            amountDollars: (invoice.amount / 100).toFixed(2),
          }).catch(() => null)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
