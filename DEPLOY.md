# NativeShine deployment

## Current database

The linked NativeShine project is `eakdpherlirecfyvwear`.
On 15 October 2026, migration
`20261015110000_site_content_and_content_safety.sql` was applied and verified.
The two older, previously applied migrations and the new migration were
registered in Supabase's migration history. Existing services and testimonials
were preserved. Current contact details and two hero slides were copied into CMS
records once. No runtime or deployment seed is needed.

On another database, apply the migrations in order. The new hero migration copies
existing service hero images when present; an empty new database has no default
slides until the admin adds them. Never rerun seed scripts on this client's
populated database. Bootstrap scripts require `ALLOW_CMS_BOOTSTRAP=true`, and the
service bootstrap refuses a database with existing services.

## Vercel variables

| Name | Usage |
| --- | --- |
| `VITE_SUPABASE_URL` | Browser project URL |
| `VITE_SUPABASE_ANON_KEY` | Browser public/anon key |
| `SUPABASE_URL` | Server URL, same project |
| `SUPABASE_ANON_KEY` | Server anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only; never prefix with `VITE_` |

Run `npm ci`, `npm run lint`, `npm test`, `npm run test:e2e` and
`npm run build`. Deploy the resulting source through the existing Vercel project.
`vercel.json` routes SPA pages to index.html and preserves `/api/` handlers.
This coding session updated the database and local source; it did not deploy the
frontend or change the public domain.

Vite serves `/api/admin-users` locally. Vercel and the optional Supabase Edge
Function share `supabase/functions/_shared/adminUsersCore.js`; the Edge Function
has its own Deno import map. The browser currently calls the Vercel endpoint.
If the Edge Function is in use elsewhere, redeploy it separately after updating.

## Production smoke check after deployment

- Sign in as client admin. Check Homepage slides and Contact & location.
- Edit one testimonial, reload its public service page, then check a new tab.
- Verify all existing hero images and content remain correct.
- Verify address text and map query agree; phone, WhatsApp, email and hours agree.
- Verify read-only users cannot save and admins cannot access user management.
- Confirm no static default quote appears after the last testimonial is deleted.

The enquiry email is also the FormSubmit recipient for both forms. If the client
changes it, the new mailbox must complete FormSubmit activation. Browser tests
intercept email requests; they cannot verify delivery into a real mailbox.

Storage rows are deleted before unused files, and replaced uploads are rolled
back when the database write fails. Files still referenced by homepage slides or
other service images are preserved. Storage cleanup failures are logged; they do
not restore deleted content or break surviving database references.
