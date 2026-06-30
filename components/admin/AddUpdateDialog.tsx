'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addUpdateAction } from '@/app/actions/clients'
import { toast } from 'sonner'
import { MessageSquarePlus, Loader2 } from 'lucide-react'

export function AddUpdateDialog({ projectId, clientId }: { projectId: string; clientId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    data.set('project_id', projectId)
    data.set('client_id', clientId)
    const result = await addUpdateAction(data)
    setLoading(false)
    if (result?.error) { toast.error(result.error) } else {
      toast.success('Update posted')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-transparent border-0 p-0">
        <MessageSquarePlus className="w-3.5 h-3.5" /> Post Update
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Post Update</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input name="title" placeholder="Design review complete" required className="bg-input border-border" />
          </div>
          <div className="space-y-2">
            <Label>Details</Label>
            <Textarea name="content" placeholder="More details for the client..." rows={3} className="bg-input border-border resize-none" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white cursor-pointer">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Posting...' : 'Post Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
