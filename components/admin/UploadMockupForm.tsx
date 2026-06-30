'use client'

import { useState, useRef } from 'react'
import { uploadMockupAction } from '@/app/actions/mockups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, FileCode, Copy, CheckCircle2 } from 'lucide-react'

export function UploadMockupForm({ clients }: { clients: { id: string; full_name: string }[] }) {
  const [loading, setLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedClient) { toast.error('Select a client'); return }
    if (!file) { toast.error('Select an HTML file'); return }
    setLoading(true)
    setShareLink('')
    const data = new FormData(e.currentTarget)
    data.set('client_id', selectedClient)
    data.set('file', file)
    const result = await uploadMockupAction(data)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.shareToken) {
      const link = `${window.location.origin}/view/${result.shareToken}`
      setShareLink(link)
      toast.success('Mockup uploaded! Share link ready.')
      formRef.current?.reset()
      setFile(null)
      setSelectedClient('')
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Client *</Label>
          <Select value={selectedClient} onValueChange={(v) => setSelectedClient(v ?? '')}>
            <SelectTrigger className="bg-input border-border cursor-pointer">
              <SelectValue placeholder="Select client..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Display Name *</Label>
          <Input name="name" placeholder="Homepage Mockup v2" required className="bg-input border-border" />
        </div>

        <div className="space-y-2">
          <Label>HTML File *</Label>
          <div
            onClick={() => document.getElementById('file-input')?.click()}
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            {file ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <FileCode className="w-5 h-5" />
                <span className="text-sm font-medium truncate max-w-[160px]">{file.name}</span>
              </div>
            ) : (
              <div>
                <FileCode className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to select .html file</p>
                <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept=".html,.htm"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white cursor-pointer">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? 'Uploading...' : 'Upload & Get Link'}
        </Button>
      </form>

      {shareLink && (
        <div className="mt-5 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Share Link Ready</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-foreground flex-1 truncate font-mono">{shareLink}</p>
            <button
              onClick={copyLink}
              className="shrink-0 text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
