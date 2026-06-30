'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteMockupAction } from '@/app/actions/mockups'
import { toast } from 'sonner'
import { ExternalLink, Copy, Trash2, CheckCircle2, FileCode } from 'lucide-react'

export function MockupCard({ mockup }: { mockup: any }) {
  const [copied, setCopied] = useState(false)
  const shareLink = `${window.location.origin}/view/${mockup.share_token}`

  async function copyLink() {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!confirm(`Delete "${mockup.name}"?`)) return
    const result = await deleteMockupAction(mockup.id, mockup.file_path)
    if (result?.error) toast.error(result.error)
    else toast.success('Mockup deleted')
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <FileCode className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{mockup.name}</p>
          <p className="text-xs text-muted-foreground">{mockup.clients?.full_name}</p>
        </div>
      </div>

      <div className="bg-secondary rounded-lg p-2.5 mb-4">
        <p className="text-xs text-muted-foreground font-mono truncate">/view/{mockup.share_token}</p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/view/${mockup.share_token}`}
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Preview
        </Link>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-3"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
