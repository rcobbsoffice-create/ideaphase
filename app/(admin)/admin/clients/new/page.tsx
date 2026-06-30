'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientAction } from '@/app/actions/clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function NewClientPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createClientAction(formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Client added and invite sent!')
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/clients" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Client</h1>
          <p className="text-muted-foreground text-sm mt-0.5">An invite email will be sent so they can log in</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" name="full_name" placeholder="John Doe" required className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-input border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" placeholder="Acme Inc." className="bg-input border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-input border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Internal notes about this client..."
              rows={3}
              className="bg-input border-border resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              {loading ? 'Creating...' : 'Add Client & Send Invite'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-border cursor-pointer">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
