'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { sendClientInviteEmail, sendProjectUpdateEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const admin = await createAdminClient()

  const email = formData.get('email') as string
  const full_name = formData.get('full_name') as string
  const company = formData.get('company') as string
  const phone = formData.get('phone') as string
  const notes = formData.get('notes') as string

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Invite user via Supabase Auth
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role: 'client', full_name },
    redirectTo: `${appUrl}/portal`,
  })

  if (inviteError) return { error: inviteError.message }

  // Create client record
  const { error: clientError } = await supabase.from('clients').insert({
    profile_id: invited.user.id,
    email,
    full_name,
    company: company || null,
    phone: phone || null,
    notes: notes || null,
  })

  if (clientError) return { error: clientError.message }

  // Send branded invite email (in addition to Supabase's auth email)
  const inviteUrl = `${appUrl}/portal`
  await sendClientInviteEmail({ to: email, name: full_name, inviteUrl }).catch(() => null)

  revalidatePath('/admin/clients')
  redirect('/admin/clients')
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('clients').update({
    full_name: formData.get('full_name') as string,
    company: (formData.get('company') as string) || null,
    phone: (formData.get('phone') as string) || null,
    notes: (formData.get('notes') as string) || null,
  }).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/clients/${id}`)
  return { success: true }
}

export async function addProjectAction(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').insert({
    client_id: formData.get('client_id') as string,
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    status: (formData.get('status') as string) || 'in_progress',
  })
  if (error) return { error: error.message }
  revalidatePath(`/admin/clients/${formData.get('client_id')}`)
  return { success: true }
}

export async function addUpdateAction(formData: FormData) {
  const supabase = await createClient()

  const projectId = formData.get('project_id') as string
  const clientId = formData.get('client_id') as string
  const title = formData.get('title') as string
  const content = (formData.get('content') as string) || null

  const { error } = await supabase.from('updates').insert({ project_id: projectId, title, content })
  if (error) return { error: error.message }

  // Fetch client email + project name to send notification
  const [{ data: client }, { data: project }] = await Promise.all([
    supabase.from('clients').select('email, full_name').eq('id', clientId).single(),
    supabase.from('projects').select('name').eq('id', projectId).single(),
  ])

  if (client && project) {
    await sendProjectUpdateEmail({
      to: client.email,
      clientName: client.full_name,
      projectName: project.name,
      updateTitle: title,
      updateContent: content,
    }).catch(() => null)
  }

  revalidatePath(`/admin/clients/${clientId}`)
  return { success: true }
}
