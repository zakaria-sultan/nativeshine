-- Keep the current logo and styled wordmark until the client replaces them.
begin;
alter table public.site_settings
  add column logo_url text not null default '/logo.jpeg',
  add column logo_storage_path text,
  add column wordmark_url text,
  add column wordmark_storage_path text,
  add constraint branding_logo_url_valid check (logo_url = '/logo.jpeg' or logo_url like 'https://%'),
  add constraint branding_wordmark_url_valid check (wordmark_url is null or wordmark_url like 'https://%');
-- Existing site_settings RLS and grants apply: public reads, admin/super updates.
notify pgrst, 'reload schema';
commit;
