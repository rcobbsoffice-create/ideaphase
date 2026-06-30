'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

export async function uploadMockupAction(formData: FormData) {
  const supabase = await createClient()

  const file = formData.get('file') as File
  const clientId = formData.get('client_id') as string
  const projectId = (formData.get('project_id') as string) || null
  const name = formData.get('name') as string

  if (!file || file.size === 0) return { error: 'No file provided' }
  if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
    return { error: 'Only HTML files are supported' }
  }
  if (file.size > 5 * 1024 * 1024) return { error: 'File too large (max 5MB)' }

  const shareToken = nanoid(16)
  const filePath = `mockups/${clientId}/${shareToken}.html`

  const { error: uploadError } = await supabase.storage
    .from('mockups')
    .upload(filePath, file, { contentType: 'text/html', upsert: false })

  if (uploadError) return { error: uploadError.message }

  const { error: dbError } = await supabase.from('mockups').insert({
    client_id: clientId,
    project_id: projectId,
    name,
    file_path: filePath,
    share_token: shareToken,
  })

  if (dbError) {
    await supabase.storage.from('mockups').remove([filePath])
    return { error: dbError.message }
  }

  revalidatePath('/admin/mockups')
  return { success: true, shareToken }
}

export async function deleteMockupAction(id: string, filePath: string) {
  const supabase = await createClient()
  await supabase.storage.from('mockups').remove([filePath])
  const { error } = await supabase.from('mockups').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/mockups')
  return { success: true }
}
