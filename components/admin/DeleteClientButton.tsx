'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteClientAction } from '@/app/actions/clients'
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'

export function DeleteClientButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteClientAction(clientId)
    } catch {
      toast.error('Failed to delete client')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-background px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors cursor-pointer">
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">{clientName}</span>? This will permanently remove their account, projects, invoices, and mockups.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-border cursor-pointer">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
