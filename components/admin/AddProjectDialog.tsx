'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProjectAction } from '@/app/actions/clients'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'

export function AddProjectDialog({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('in_progress')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)
    data.set('client_id', clientId)
    data.set('status', status)
    const result = await addProjectAction(data)
    setLoading(false)
    if (result?.error) { toast.error(result.error) } else {
      toast.success('Project added')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
        <Plus className="w-3 h-3" /> Add Project
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Project Name *</Label>
            <Input name="name" placeholder="Website Redesign" required className="bg-input border-border" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" placeholder="Brief description..." rows={2} className="bg-input border-border resize-none" />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v ?? 'in_progress')}>
              <SelectTrigger className="bg-input border-border cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="in_progress" className="cursor-pointer">In Progress</SelectItem>
                <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
                <SelectItem value="on_hold" className="cursor-pointer">On Hold</SelectItem>
                <SelectItem value="completed" className="cursor-pointer">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white cursor-pointer">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Adding...' : 'Add Project'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
