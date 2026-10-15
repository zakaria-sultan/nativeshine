-- Branding tests run without publishing any temporary logo: always roll back.
begin;
insert into auth.users (id,email,raw_user_meta_data) values
 ('15102026-1000-4000-8000-000000000001','branding-reader@example.invalid','{}'),
 ('15102026-1000-4000-8000-000000000002','branding-admin@example.invalid','{}');
update public.profiles set role='admin' where id='15102026-1000-4000-8000-000000000002';
set local role authenticated;
set local request.jwt.claim.sub='15102026-1000-4000-8000-000000000001';
do $$ declare changed integer; begin
 update public.site_settings set logo_url='https://example.invalid/denied.png' where id;
 get diagnostics changed=row_count;
 if changed<>0 then raise exception 'Read-only user changed logo'; end if;
end $$;
set local request.jwt.claim.sub='15102026-1000-4000-8000-000000000002';
update public.site_settings set
 logo_url='https://example.invalid/company.png', logo_storage_path='branding/test-logo.png',
 wordmark_url='https://example.invalid/wordmark.png', wordmark_storage_path='branding/test-wordmark.png'
where id;
do $$ begin
 if not exists(select 1 from public.site_settings where logo_url='https://example.invalid/company.png'
   and wordmark_url='https://example.invalid/wordmark.png') then raise exception 'Admin branding save failed'; end if;
end $$;
reset role;
set local role anon;
set local request.jwt.claim.sub='';
do $$ begin
 if not exists(select 1 from public.site_settings where logo_url='https://example.invalid/company.png') then
  raise exception 'Public cannot read branding';
 end if;
 begin
  update public.site_settings set logo_url='/logo.jpeg' where id;
  raise exception 'Anonymous user changed branding';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role authenticated;
set local request.jwt.claim.sub='15102026-1000-4000-8000-000000000002';
update public.site_settings set logo_url='/logo.jpeg',logo_storage_path=null,wordmark_url=null,wordmark_storage_path=null where id;
do $$ begin
 if not exists(select 1 from public.site_settings where logo_url='/logo.jpeg' and wordmark_url is null) then
  raise exception 'Branding reset failed';
 end if;
 begin
  update public.site_settings set logo_url='javascript:alert(1)' where id;
  raise exception 'Unsafe logo URL accepted';
 exception when check_violation then null; end;
end $$;
reset role;
rollback;
select 'PASS: branding admin save/reset, public reads, read-only/anonymous restrictions and URL constraints; all changes rolled back' as result;
