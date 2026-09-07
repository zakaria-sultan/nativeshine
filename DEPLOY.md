# Deploy checklist — NativeShine Admin CMS

## Already done on Supabase project `eakdpherlirecfyvwear`
- Migration applied (tables + `service-images` bucket)
- Seeded 10 services + 80 images
- Created `super@nativeshine.co.uk` and `admin@nativeshine.co.uk`
- User admin API lives at Vercel `/api/admin-users` (service role stays on the server)

## Vercel environment variables (Preview + Production)
Add in Vercel → Project → Settings → Environment Variables:

| Name | Notes |
|------|--------|
| `VITE_SUPABASE_URL` | `https://eakdpherlirecfyvwear.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon JWT |
| `SUPABASE_URL` | same as VITE URL |
| `SUPABASE_ANON_KEY` | same as anon JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role JWT — server only, never `VITE_` |

Redeploy after saving env vars.

## Local
```bash
npm run dev
# Admin: http://localhost:5173/admin/login
# Services/images work locally via Supabase.
# Users page needs: npx vercel dev  (so /api/admin-users runs)
```

## Production cutover
1. Merge `feature/admin-cms` after Preview OK
2. Confirm `/` and `/admin` with seeded content
3. Give client **admin** login; keep **super** for yourself
4. Change passwords in `/admin/account` after first login
