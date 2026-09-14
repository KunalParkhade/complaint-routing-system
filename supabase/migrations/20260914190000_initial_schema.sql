create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'admin', 'department_head');
create type public.complaint_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.complaint_status as enum ('submitted', 'under_review', 'in_progress', 'resolved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  language text,
  detected_language text,
  category text,
  department_id uuid references public.departments(id) on delete set null,
  priority public.complaint_priority not null default 'medium',
  status public.complaint_status not null default 'submitted',
  routing_confidence numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.complaint_updates (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  status public.complaint_status not null,
  note text,
  created_at timestamptz not null default now()
);

create index complaints_user_id_idx on public.complaints(user_id);
create index complaints_department_id_idx on public.complaints(department_id);
create index complaints_status_idx on public.complaints(status);
create index complaint_updates_complaint_id_idx on public.complaint_updates(complaint_id);

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_updates enable row level security;

create or replace function public.is_admin_or_head()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'department_head')
  );
$$;

revoke execute on function public.is_admin_or_head() from anon, authenticated;
grant execute on function public.is_admin_or_head() to authenticated;

create policy "profiles_select_own_or_admin"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin_or_head());

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "departments_read_authenticated"
on public.departments for select to authenticated using (true);

create policy "complaints_insert_own"
on public.complaints for insert to authenticated
with check (user_id = auth.uid());

create policy "complaints_read_own_or_staff"
on public.complaints for select to authenticated
using (user_id = auth.uid() or public.is_admin_or_head());

create policy "complaints_update_staff"
on public.complaints for update to authenticated
using (public.is_admin_or_head())
with check (public.is_admin_or_head());

create policy "updates_read_own_or_staff"
on public.complaint_updates for select to authenticated
using (
  public.is_admin_or_head()
  or exists (
    select 1 from public.complaints c
    where c.id = complaint_id and c.user_id = auth.uid()
  )
);

create policy "updates_insert_staff"
on public.complaint_updates for insert to authenticated
with check (public.is_admin_or_head() and actor_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated;
grant execute on function public.handle_new_user() to service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.departments (name, description) values
  ('Administration', 'General administrative complaints'),
  ('Hostel', 'Hostel, accommodation, and residential issues'),
  ('Library', 'Library facilities and services'),
  ('IT Support', 'Technology, network, and account issues'),
  ('Facilities', 'Maintenance, electrical, sanitation, and campus facilities'),
  ('Academic', 'Academic services and teaching-related issues')
on conflict (name) do nothing;
