'use server'

import { createClient } from '@/lib/supabase/server'
import { sendInvoiceEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient()

  const amountDollars = parseFloat(formData.get('amount') as string)
  const amountCents = Math.round(amountDollars * 100)
  const clientId = formData.get('client_id') as string
  const title = formData.get('title') as string
  const dueDate = (formData.get('due_date') as string) || null

  const { error } = await supabase.from('invoices').insert({
    client_id: clientId,
    project_id: (formData.get('project_id') as string) || null,
    title,
    description: (formData.get('description') as string) || null,
    amount: amountCents,
    due_date: dueDate,
    status: 'unpaid',
  })

  if (error) return { error: error.message }

  // Send invoice notification email
  const { data: client } = await supabase
    .from('clients')
    .select('email, full_name')
    .eq('id', clientId)
    .single()

  if (client) {
    await sendInvoiceEmail({
      to: client.email,
      clientName: client.full_name,
      invoiceTitle: title,
      amountDollars: amountDollars.toFixed(2),
      dueDate,
      invoiceId: clientId,
    }).catch(() => null)
  }

  revalidatePath('/admin/invoices')
  redirect('/admin/invoices')
}

export async function updateInvoiceStatusAction(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('invoices').update({
    status,
    paid_at: status === 'paid' ? new Date().toISOString() : null,
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/invoices')
  return { success: true }
}
