-- NativeShine CMS: profiles, services, service_images, storage, RLS

create extension if not exists "pgcrypto";

-- Roles enum
do $$ begin
  create type public.user_role as enum ('super', 'admin', 'user');
exception
  when duplicate_object then null;
end $$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_published_sort_idx
  on public.services (is_published, sort_order);

-- Service images
do $$ begin
  create type public.image_kind as enum ('thumbnail', 'hero', 'recent');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.service_images (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  kind public.image_kind not null,
  slot int not null default 1,
  url text not null,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_images_slot_check check (slot >= 1 and slot <= 6),
  constraint service_images_unique unique (service_id, kind, slot)
);

create index if not exists service_images_service_idx
  on public.service_images (service_id);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists service_images_set_updated_at on public.service_images;
create trigger service_images_set_updated_at
  before update on public.service_images
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'user')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers (security definer to avoid RLS recursion)
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super', 'admin', 'user')
  );
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super', 'admin')
  );
$$;

create or replace function public.is_super()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super'
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.service_images enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "profiles_super_all" on public.profiles;
create policy "profiles_super_all"
  on public.profiles for all
  using (public.is_super())
  with check (public.is_super());

-- Services policies
drop policy if exists "services_public_read_published" on public.services;
create policy "services_public_read_published"
  on public.services for select
  using (is_published = true or public.is_staff());

drop policy if exists "services_staff_insert" on public.services;
create policy "services_staff_insert"
  on public.services for insert
  with check (public.can_edit_content());

drop policy if exists "services_staff_update" on public.services;
create policy "services_staff_update"
  on public.services for update
  using (public.can_edit_content())
  with check (public.can_edit_content());

drop policy if exists "services_staff_delete" on public.services;
create policy "services_staff_delete"
  on public.services for delete
  using (public.can_edit_content());

-- Service images policies
drop policy if exists "service_images_public_read" on public.service_images;
create policy "service_images_public_read"
  on public.service_images for select
  using (
    public.is_staff()
    or exists (
      select 1 from public.services s
      where s.id = service_id and s.is_published = true
    )
  );

drop policy if exists "service_images_staff_insert" on public.service_images;
create policy "service_images_staff_insert"
  on public.service_images for insert
  with check (public.can_edit_content());

drop policy if exists "service_images_staff_update" on public.service_images;
create policy "service_images_staff_update"
  on public.service_images for update
  using (public.can_edit_content())
  with check (public.can_edit_content());

drop policy if exists "service_images_staff_delete" on public.service_images;
create policy "service_images_staff_delete"
  on public.service_images for delete
  using (public.can_edit_content());

-- Storage bucket (public read for site images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-images',
  'service-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "service_images_storage_public_read" on storage.objects;
create policy "service_images_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'service-images');

drop policy if exists "service_images_storage_staff_insert" on storage.objects;
create policy "service_images_storage_staff_insert"
  on storage.objects for insert
  with check (bucket_id = 'service-images' and public.can_edit_content());

drop policy if exists "service_images_storage_staff_update" on storage.objects;
create policy "service_images_storage_staff_update"
  on storage.objects for update
  using (bucket_id = 'service-images' and public.can_edit_content())
  with check (bucket_id = 'service-images' and public.can_edit_content());

drop policy if exists "service_images_storage_staff_delete" on storage.objects;
create policy "service_images_storage_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'service-images' and public.can_edit_content());
