-- Per-service testimonials for NativeShine CMS

create table if not exists public.service_testimonials (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  quote_text text not null,
  client_name text not null,
  initials text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_testimonials_service_idx
  on public.service_testimonials (service_id, sort_order);

drop trigger if exists service_testimonials_set_updated_at on public.service_testimonials;
create trigger service_testimonials_set_updated_at
  before update on public.service_testimonials
  for each row execute function public.set_updated_at();

alter table public.service_testimonials enable row level security;

drop policy if exists "service_testimonials_public_read" on public.service_testimonials;
create policy "service_testimonials_public_read"
  on public.service_testimonials for select
  using (
    public.is_staff()
    or exists (
      select 1 from public.services s
      where s.id = service_id and s.is_published = true
    )
  );

drop policy if exists "service_testimonials_staff_insert" on public.service_testimonials;
create policy "service_testimonials_staff_insert"
  on public.service_testimonials for insert
  with check (public.can_edit_content());

drop policy if exists "service_testimonials_staff_update" on public.service_testimonials;
create policy "service_testimonials_staff_update"
  on public.service_testimonials for update
  using (public.can_edit_content())
  with check (public.can_edit_content());

drop policy if exists "service_testimonials_staff_delete" on public.service_testimonials;
create policy "service_testimonials_staff_delete"
  on public.service_testimonials for delete
  using (public.can_edit_content());
