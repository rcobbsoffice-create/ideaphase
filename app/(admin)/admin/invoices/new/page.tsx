'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createInvoiceAction } from '@/app/actions/invoices'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

function NewInvoiceForm() {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.from('clients').select('id, full_name').then(({ data }) => setClients(data ?? []))
    const preselect = searchParams.get('client')
    if (preselect) setSelectedClient(preselect)
  }, [])

  useEffect(() => {
    if (!selectedClient) { setProjects([]); return }
    supabase.from('projects').select('id, name').eq('client_id', selectedClient)
      .then(({ data }) => setProjects(data ?? []))
  }, [selectedClient])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedClient) { toast.error('Please select a client'); return }
    setLoading(true)
    const data = new FormData(e.currentTarget)
    data.set('client_id', selectedClient)
    data.set('project_id', selectedProject)
    const result = await createInvoiceAction(data)
    if (result?.error) { toast.error(result.error); setLoading(false) }
    else toast.success('Invoice created!')
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-7">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Client *</Label>
          <Select value={selectedClient} onValueChange={(v) => setSelectedClient(v ?? '')}>
            <SelectTrigger className="bg-input border-border cursor-pointer">
              <SelectValue placeholder="Select a client..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {projects.length > 0 && (
          <div className="space-y-2">
            <Label>Project (optional)</Label>
            <Select value={selectedProject} onValueChange={(v) => setSelectedProject(v ?? '')}>
              <SelectTrigger className="bg-input border-border cursor-pointer">
                <SelectValue placeholder="Link to a project..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id} className="cursor-pointer">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Invoice Title *</Label>
          <Input name="title" placeholder="Website Design — Phase 1" required className="bg-input border-border" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Amount (USD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input name="amount" type="number" min="1" step="0.01" placeholder="500.00" required className="bg-input border-border pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input name="due_date" type="date" className="bg-input border-border" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea name="description" placeholder="What this invoice covers..." rows={3} className="bg-input border-border resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white cursor-pointer">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Creating...' : 'Create Invoice'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-border cursor-pointer">Cancel</Button>
        </div>
      </form>
    </div>
  )
}

export default function NewInvoicePage() {
  return (
    <div className="p-4 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/invoices" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
      </div>
      <Suspense fallback={<div className="bg-card border border-border rounded-2xl p-7 h-64 animate-pulse" />}>
        <NewInvoiceForm />
      </Suspense>
    </div>
  )
}
