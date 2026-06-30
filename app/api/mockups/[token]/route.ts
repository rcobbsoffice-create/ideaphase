import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createClient()

  const { data: mockup } = await supabase
    .from('mockups')
    .select('file_path')
    .eq('share_token', token)
    .single()

  if (!mockup) {
    return new NextResponse('Not found', { status: 404 })
  }

  const { data, error } = await supabase.storage
    .from('mockups')
    .download(mockup.file_path)

  if (error || !data) {
    return new NextResponse('File not found', { status: 404 })
  }

  const html = await data.text()

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  })
}
