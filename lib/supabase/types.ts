export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'client'
          full_name: string | null
          company: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'client'
          full_name?: string | null
          company?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'client'
          full_name?: string | null
          company?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          profile_id: string | null
          email: string
          full_name: string
          company: string | null
          phone: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          email: string
          full_name: string
          company?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          email?: string
          full_name?: string
          company?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          status: 'active' | 'in_progress' | 'completed' | 'on_hold'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          status?: 'active' | 'in_progress' | 'completed' | 'on_hold'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'in_progress' | 'completed' | 'on_hold'
          created_at?: string
          updated_at?: string
        }
      }
      updates: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          project_id: string | null
          title: string
          description: string | null
          amount: number
          status: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
          due_date: string | null
          stripe_checkout_session_id: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          project_id?: string | null
          title: string
          description?: string | null
          amount: number
          status?: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          stripe_checkout_session_id?: string | null
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          amount?: number
          status?: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          stripe_checkout_session_id?: string | null
          paid_at?: string | null
          created_at?: string
        }
      }
      mockups: {
        Row: {
          id: string
          client_id: string
          project_id: string | null
          name: string
          file_path: string
          share_token: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          project_id?: string | null
          name: string
          file_path: string
          share_token: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          project_id?: string | null
          name?: string
          file_path?: string
          share_token?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
