import { createClient } from '@/lib/supabase/server'
import { UploadMockupForm } from '@/components/admin/UploadMockupForm'
import { MockupCard } from '@/components/admin/MockupCard'
import { Upload } from 'lucide-react'

export default async function MockupsPage() {
  const supabase = await createClient()

  const [{ data: mockups }, { data: clients }] = await Promise.all([
    supabase.from('mockups').select('*, clients(full_name)').order('created_at', { ascending: false }),
    supabase.from('clients').select('id, full_name'),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mockups</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload HTML files and share preview links with clients</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload panel */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-5">
              <Upload className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Upload Mockup</h2>
            </div>
            <UploadMockupForm clients={clients ?? []} />
          </div>
        </div>

        {/* Mockup grid */}
        <div className="lg:col-span-2">
          {(mockups ?? []).length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No mockups uploaded yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {(mockups ?? []).map((m: any) => (
                <MockupCard key={m.id} mockup={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
