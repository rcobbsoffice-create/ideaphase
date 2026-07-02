'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteMockupAction, toggleMockupPrivacyAction } from '@/app/actions/mockups'
import { toast } from 'sonner'
import { ExternalLink, Copy, Trash2, CheckCircle2, FileCode, Lock, Globe, Unlock } from 'lucide-react'

export function MockupCard({ mockup }: { mockup: any }) {
  const [copied, setCopied] = useState(false)
  const [updating, setUpdating] = useState(false)
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

  async function handleTogglePrivacy() {
    setUpdating(true)
    const result = await toggleMockupPrivacyAction(mockup.id, !mockup.is_private)
    setUpdating(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(mockup.is_private ? 'Mockup is now public' : 'Mockup is now private')
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <FileCode className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-foreground truncate">{mockup.name}</p>
            {mockup.is_private ? (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium shrink-0">
                <Lock className="w-2.5 h-2.5" /> Private
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium shrink-0">
                <Globe className="w-2.5 h-2.5" /> Public
              </span>
            )}
          </div>
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
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button
          onClick={handleTogglePrivacy}
          disabled={updating}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-3 disabled:opacity-50"
          title={mockup.is_private ? "Make Public" : "Make Private"}
        >
          {mockup.is_private ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {mockup.is_private ? 'Make Public' : 'Make Private'}
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
