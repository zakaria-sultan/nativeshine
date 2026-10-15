-- Run against the linked project using `supabase db query --linked --file ...`.
-- All changes, including test identities and edits to settings, are rolled back.
begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('15102026-0000-4000-8000-000000000001', 'cms-readonly-test@example.invalid', '{"role":"super"}'),
  ('15102026-0000-4000-8000-000000000002', 'cms-editor-test@example.invalid', '{}');
do $$ begin
  if (select role from public.profiles where id = '15102026-0000-4000-8000-000000000001') <> 'user' then
    raise exception 'Signup metadata granted a privileged role';
  end if;
end $$;
update public.profiles set role = 'admin' where id = '15102026-0000-4000-8000-000000000002';

-- Last-super protection, within a nested transaction that undoes the attempt.
do $$ begin
  if not exists (select 1 from public.profiles where role = 'super') then raise exception 'No super exists'; end if;
  begin
    update public.profiles set role = 'admin' where role = 'super';
    raise exception 'Last super protection failed';
  exception when raise_exception then
    if sqlerrm <> 'At least one super administrator must remain' then raise; end if;
  end;
end $$;

set local role authenticated;
set local request.jwt.claim.sub = '15102026-0000-4000-8000-000000000001';
do $$ declare changed integer; begin
  update public.site_settings set email = 'denied@example.invalid' where id = true;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Read-only user changed settings'; end if;
  begin
    insert into public.home_slides(title, image_url) values ('Denied', 'https://example.invalid/test.jpg');
    raise exception 'Read-only user inserted slide';
  exception when insufficient_privilege then null; end;
  begin
    update public.profiles set role = 'super' where id = auth.uid();
    raise exception 'Read-only user escalated role';
  exception when insufficient_privilege then null; end;
  update public.profiles set full_name = 'Own profile edit works' where id = auth.uid();
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'Own profile update failed'; end if;
end $$;

set local request.jwt.claim.sub = '15102026-0000-4000-8000-000000000002';
update public.site_settings set address = E'2 Test & Co\nMogadishu, Somalia',
  office_phone = '+252 61 111 2222', mobile_phone = '+252 61 333 4444', email = 'new-office@example.invalid'
where id = true;
insert into public.home_slides(id, title, image_url, is_published) values
  ('15102026-0000-4000-8000-000000000003', 'Test slide', 'https://example.invalid/test.jpg', false);
update public.home_slides set title = 'Edited slide' where id = '15102026-0000-4000-8000-000000000003';
insert into public.services(id, title, slug, is_published) values
  ('15102026-0000-4000-8000-000000000004', 'CMS regression test', 'cms-regression-test-15102026', false);
insert into public.service_testimonials(id, service_id, quote_text, client_name) values
  ('15102026-0000-4000-8000-000000000005', '15102026-0000-4000-8000-000000000004', 'Original test quote', 'Test client');
update public.service_testimonials set quote_text = 'Persisted edit' where id = '15102026-0000-4000-8000-000000000005';
do $$ begin
  if (select email from public.site_settings where id) <> 'new-office@example.invalid' then raise exception 'Settings edit failed'; end if;
  if (select title from public.home_slides where id = '15102026-0000-4000-8000-000000000003') <> 'Edited slide' then raise exception 'Slide edit failed'; end if;
  if (select quote_text from public.service_testimonials where id = '15102026-0000-4000-8000-000000000005') <> 'Persisted edit' then raise exception 'Testimonial edit failed'; end if;
end $$;

reset role;
set local role anon;
set local request.jwt.claim.sub = '';
do $$ begin
  if exists (select 1 from public.home_slides where id = '15102026-0000-4000-8000-000000000003') then raise exception 'Public can see a draft slide'; end if;
  if exists (select 1 from public.services where id = '15102026-0000-4000-8000-000000000004') then raise exception 'Public can see a draft service'; end if;
  if exists (select 1 from public.service_testimonials where id = '15102026-0000-4000-8000-000000000005') then raise exception 'Public can see a draft testimonial'; end if;
  if not exists (select 1 from public.site_settings where id) then raise exception 'Public cannot read contact settings'; end if;
  begin
    update public.site_settings set email = 'anonymous@example.invalid' where id;
    raise exception 'Anonymous user changed settings';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
set local role authenticated;
set local request.jwt.claim.sub = '15102026-0000-4000-8000-000000000002';
delete from public.service_testimonials where id = '15102026-0000-4000-8000-000000000005';
delete from public.home_slides where id = '15102026-0000-4000-8000-000000000003';
do $$ begin
  if exists (select 1 from public.service_testimonials where id = '15102026-0000-4000-8000-000000000005') then raise exception 'Testimonial deletion failed'; end if;
  if exists (select 1 from public.home_slides where id = '15102026-0000-4000-8000-000000000003') then raise exception 'Slide deletion failed'; end if;
end $$;
reset role;
rollback;
select 'PASS: signup, last-super, own profile, admin edits/deletes and public/read-only RLS; all changes rolled back' as result;
