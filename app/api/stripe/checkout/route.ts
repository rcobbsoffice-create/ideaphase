import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { invoiceId, amount, title } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: title, description: 'IdeaPhase Invoice' },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      metadata: { invoiceId },
      success_url: `${appUrl}/portal/invoices?paid=true`,
      cancel_url: `${appUrl}/portal/invoices`,
    })

    await supabase.from('invoices').update({
      stripe_checkout_session_id: session.id,
    }).eq('id', invoiceId)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
