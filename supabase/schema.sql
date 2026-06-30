-- IdeaPhase Database Schema
-- Run this in your Supabase SQL Editor

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('admin', 'client')) default 'client',
  full_name text,
  company text,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- CLIENTS
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  email text not null unique,
  full_name text not null,
  company text,
  phone text,
  notes text,
  created_at timestamptz default now() not null
);

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade not null,
  name text not null,
  description text,
  status text not null default 'in_progress'
    check (status in ('active', 'in_progress', 'completed', 'on_hold')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- PROJECT UPDATES
create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  content text,
  created_at timestamptz default now() not null
);

-- INVOICES
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  amount integer not null, -- stored in cents
  status text not null default 'unpaid'
    check (status in ('unpaid', 'paid', 'overdue', 'cancelled')),
  due_date date,
  stripe_checkout_session_id text,
  paid_at timestamptz,
  created_at timestamptz default now() not null
);

-- MOCKUPS
create table if not exists public.mockups (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  file_path text not null,
  share_token text unique not null,
  created_at timestamptz default now() not null
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.updates enable row level security;
alter table public.invoices enable row level security;
alter table public.mockups enable row level security;

-- Helper function to check admin role
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- PROFILES policies
create policy "Admins manage all profiles" on public.profiles for all using (public.is_admin());
create policy "Users view own profile" on public.profiles for select using (id = auth.uid());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid());

-- CLIENTS policies
create policy "Admins manage all clients" on public.clients for all using (public.is_admin());
create policy "Clients view own record" on public.clients for select using (profile_id = auth.uid());

-- PROJECTS policies
create policy "Admins manage all projects" on public.projects for all using (public.is_admin());
create policy "Clients view own projects" on public.projects for select using (
  exists (select 1 from public.clients c where c.id = client_id and c.profile_id = auth.uid())
);

-- UPDATES policies
create policy "Admins manage all updates" on public.updates for all using (public.is_admin());
create policy "Clients view updates on own projects" on public.updates for select using (
  exists (
    select 1 from public.projects p
    join public.clients c on c.id = p.client_id
    where p.id = project_id and c.profile_id = auth.uid()
  )
);

-- INVOICES policies
create policy "Admins manage all invoices" on public.invoices for all using (public.is_admin());
create policy "Clients view own invoices" on public.invoices for select using (
  exists (select 1 from public.clients c where c.id = client_id and c.profile_id = auth.uid())
);

-- MOCKUPS policies
create policy "Admins manage all mockups" on public.mockups for all using (public.is_admin());
create policy "Clients view own mockups" on public.mockups for select using (
  exists (select 1 from public.clients c where c.id = client_id and c.profile_id = auth.uid())
);
create policy "Public share token access" on public.mockups for select using (true);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- STORAGE BUCKET FOR MOCKUPS
-- ============================================
insert into storage.buckets (id, name, public)
values ('mockups', 'mockups', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Admins upload mockups" on storage.objects
  for insert with check (
    bucket_id = 'mockups' and public.is_admin()
  );

create policy "Authenticated users download mockups" on storage.objects
  for select using (
    bucket_id = 'mockups' and auth.role() = 'authenticated'
  );

create policy "Admins delete mockups" on storage.objects
  for delete using (
    bucket_id = 'mockups' and public.is_admin()
  );

-- ============================================
-- SET YOUR ADMIN ACCOUNT
-- After signing up with your email, run this:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-id>';
-- ============================================
