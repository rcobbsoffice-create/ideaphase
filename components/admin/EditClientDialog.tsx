'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateClientAction } from '@/app/actions/clients'
import { toast } from 'sonner'
import { Pencil, Loader2 } from 'lucide-react'

interface Props {
  client: {
    id: string
    full_name: string
    email: string
    company?: string | null
    phone?: string | null
    notes?: string | null
  }
}

export function EditClientDialog({ client }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const result = await updateClientAction(client.id, data)
    setLoading(false)
    if (result?.error) { toast.error(result.error) } else {
      toast.success('Client updated')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
        <Pencil className="w-3.5 h-3.5" /> Edit
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input name="full_name" defaultValue={client.full_name} required className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input name="company" defaultValue={client.company ?? ''} className="bg-input border-border" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input name="phone" type="tel" defaultValue={client.phone ?? ''} className="bg-input border-border" />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea name="notes" defaultValue={client.notes ?? ''} rows={3} className="bg-input border-border resize-none" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white cursor-pointer">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
