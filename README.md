# NativeShine

React/Vite website with Supabase Auth, PostgreSQL and Storage, plus a client CMS.

## Local development

```sh
npm ci
cp .env.example .env
# Fill the Supabase settings in .env, then:
npm run dev
```

Public pages: `/`, `/about`, `/contact`, `/services/:slug`.
Client CMS: `/admin/login`, `/admin/services`, `/admin/homepage`, `/admin/settings`.
Super administrators also manage `/admin/users`. The Vite dev server includes the
same `/api/admin-users` handler used on Vercel; `vercel dev` is optional.

Services, testimonials, galleries, homepage slides and shared contact details use
Supabase as the source of truth. Empty records stay empty. Failed reads retain
only the last confirmed database content and show a retry message. Open public
tabs refresh on focus, reconnect, local admin changes and every 60 seconds.

## Verification

```sh
npm run lint
npm test
npm run build
npm run test:e2e
```

Browser tests use a mock database and intercept email requests. They do not
change production content or send real enquiries. Chrome is auto-detected on
Linux; otherwise install Playwright Chromium (`npx playwright install chromium`)
or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Optional real-project checks (requires the server-only key in `.env`):

```sh
npm run test:live
supabase db query --linked --file tests/database.sql
```

The live script creates temporary private services, testimonials, slides and
confirmed test accounts, exercises actual login/token refresh/user management,
then deletes the fixtures. It checks that existing testimonials and contact
settings are unchanged. The SQL suite runs entirely inside a rolled-back
transaction. Run these deliberately against the intended project.

See [DEPLOY.md](DEPLOY.md) for migrations and deployment, and
[CMS-CHANGES.md](CMS-CHANGES.md) for the implemented changes and verification.
