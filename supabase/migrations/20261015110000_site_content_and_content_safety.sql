-- Add CMS controls without overwriting any existing service/testimonial content.
begin;

create table public.site_settings (
  id boolean primary key default true check (id),
  office_phone text not null default '020 3642 1152',
  mobile_phone text not null default '07777 143488',
  email text not null default 'info@nativeshine.co.uk',
  address text not null default E'9 Roswick Albany street\nLondon nw1 4bj',
  office_hours text not null default 'Mon - Fri: 08:00 - 18:00',
  updated_at timestamptz not null default now(),
  constraint settings_email_valid check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint settings_address_valid check (length(trim(address)) between 1 and 500),
  constraint settings_hours_valid check (length(trim(office_hours)) between 1 and 200),
  constraint settings_phones_valid check (
    office_phone ~ '^\+?[0-9[:space:]().-]{7,30}$'
    and mobile_phone ~ '^\+?[0-9[:space:]().-]{7,30}$'
    and length(regexp_replace(office_phone, '[^0-9]', '', 'g')) >= 7
    and length(regexp_replace(mobile_phone, '[^0-9]', '', 'g')) >= 7
  )
);
insert into public.site_settings (id) values (true);
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

create table public.home_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 250),
  subtitle text not null default '' check (length(subtitle) <= 150),
  description text not null default '' check (length(description) <= 2000),
  image_url text not null check (image_url like 'https://%'),
  storage_path text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger home_slides_set_updated_at before update on public.home_slides
  for each row execute function public.set_updated_at();
create index home_slides_published_order_idx on public.home_slides (is_published, sort_order);

-- Copy current hero photos once into independent slide records. Service slug
-- changes no longer change homepage content. Existing URLs/files stay intact.
insert into public.home_slides (title, subtitle, description, image_url, sort_order)
select content.title, content.subtitle, content.description,
  (
    select i.url from public.service_images i join public.services s on s.id = i.service_id
    where lower(s.slug) = content.service_slug and i.slot = 1
      and i.kind in ('hero', 'thumbnail')
    order by (i.kind = 'hero') desc limit 1
  ), content.position
from (values
  ('BRINGING NEW LIFE TO YOUR FLOORS AND WALLS', 'FLOOR RESTORATION',
   'Our extensive knowledge and experience in floor restoration, combined with advanced tools and modern techniques, ensure your floors and walls look as good as new.', 'carpet-cleaning', 1),
  ('PRESERVING LONDON''S ARCHITECTURAL HERITAGE', 'FACADE CLEANING',
   'Specialist steam cleaning and restoration services for commercial and residential properties across the capital.', 'window-cleaning', 2)
) as content(title, subtitle, description, service_slug, position)
where exists (
  select 1 from public.service_images i join public.services s on s.id = i.service_id
  where lower(s.slug) = content.service_slug and i.slot = 1 and i.kind in ('hero', 'thumbnail')
);

alter table public.site_settings enable row level security;
alter table public.home_slides enable row level security;
revoke all on public.site_settings, public.home_slides from anon, authenticated;
grant select on public.site_settings, public.home_slides to anon, authenticated;
grant update on public.site_settings to authenticated;
grant insert, update, delete on public.home_slides to authenticated;
grant all on public.site_settings, public.home_slides to service_role;
create policy settings_read on public.site_settings for select using (true);
create policy settings_edit on public.site_settings for update
  using (public.can_edit_content()) with check (public.can_edit_content());
create policy slides_read on public.home_slides for select
  using (is_published or public.is_staff());
create policy slides_insert on public.home_slides for insert with check (public.can_edit_content());
create policy slides_update on public.home_slides for update
  using (public.can_edit_content()) with check (public.can_edit_content());
create policy slides_delete on public.home_slides for delete using (public.can_edit_content());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 10485760, array['image/png','image/jpeg','image/webp']);
create policy site_images_read on storage.objects for select using (bucket_id = 'site-images');
create policy site_images_insert on storage.objects for insert
  with check (bucket_id = 'site-images' and public.can_edit_content());
create policy site_images_update on storage.objects for update
  using (bucket_id = 'site-images' and public.can_edit_content())
  with check (bucket_id = 'site-images' and public.can_edit_content());
create policy site_images_delete on storage.objects for delete
  using (bucket_id = 'site-images' and public.can_edit_content());

-- Users cannot choose a privileged role through editable signup metadata.
-- Trusted server APIs explicitly set profiles.role after Auth creation.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'full_name', ''), 'user')
  on conflict (id) do update set email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);
  return new;
end;
$$;

-- Avoid querying the RLS-protected table recursively in its own UPDATE policy.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = public.current_user_role());

-- Preserve at least one super administrator, including direct API updates.
create or replace function public.protect_last_super()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.role = 'super' then
    perform pg_advisory_xact_lock(15102026);
    if (tg_op = 'DELETE' or new.role <> 'super')
      and not exists (select 1 from public.profiles where role = 'super' and id <> old.id) then
      raise exception 'At least one super administrator must remain';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
create trigger profiles_protect_last_super before update or delete on public.profiles
  for each row execute function public.protect_last_super();

notify pgrst, 'reload schema';
commit;
