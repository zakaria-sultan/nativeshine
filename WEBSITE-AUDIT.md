# NativeShine — khariidadda website-ka iyo baaritaanka

Warbixintani waa baaritaankii hore, ka hor sixitaanka. Shaqada hadda la hirgeliyey iyo tests-ka ka eeg [CMS-CHANGES.md](CMS-CHANGES.md).

Taariikh: 15 October 2026. Baaritaankan wuxuu ku salaysan yahay source code-ka, SQL migrations-ka iyo checks maxalli ah. Waa tixraaca isbeddellada xiga; dib ha loo cusboonaysiiyo marka qaabku isbeddelo.

## Xadka xaqiijinta

- `npm run build`: gudbay. JS bundle qiyaastii 745 kB (222 kB gzip); warning chunk ka weyn 500 kB. Sawirro badan waa 2–3 MB; kuwani waa assets la dhisay, mana aha in browser-ku wada soo dejinayo mar keliya.
- `npm run lint`: fashilmay, 25 errors. Waxaa ku jira Node globals aan ESLint aqoonsan, `motion`/variables unused loo arko, Fast Refresh exports iyo state update effect ku jira Header. Qaar waa lint configuration; dhammaantood runtime bugs ma aha.
- Supabase public read-only count requests: dhammaan waxay heleen `fetch failed`. Tirada records-ka, migrations-ka live-ka, RLS-ka live-ka iyo production connectivity lama xaqiijin.
- Browser/mobile muuqaal, login roles, upload/delete iyo email delivery wali lama tijaabin. Ma jiro test script ku jira package.json.
- App code, database iyo credentials lama beddelin. Seeds/migrations lama fulin, email-na lama dirin. Warbixintan keliya ayaa lagu daray.

## Qaab-dhismeedka

React 19 + Vite 8 single-page app, React Router 7, Tailwind 4, Framer Motion iyo Lucide. Backend-ku waa Supabase (PostgreSQL, Auth, Storage, RLS); maamulka users-ku wuxuu leeyahay Vercel serverless API. Ma aha WordPress ama CMS guud: waa CMS gaar ah oo hadda diiradda saaraya services.

`src/main.jsx` wuxuu isku xiraa ServicesProvider → AuthProvider → QuoteProvider → ToastProvider → App. `src/App.jsx` wuxuu qeexaa routes-ka.

| Route | Shaqada |
| --- | --- |
| `/` | Hero laba slide leh iyo services grid |
| `/services` | Isla HomePage; ma aha page gaar ah |
| `/services/:slug` | Service template: hero, content, testimonials, recent works |
| `/about` | About content ku qoran code-ka |
| `/contact` | Contact form iyo contact details |
| `/admin/login` | Supabase email/password login |
| `/admin` | Dashboard, published count iyo data source |
| `/admin/services` | List, create, edit iyo delete |
| `/admin/services/:id` | Service editor; `new` waxaa loo adeegsadaa abuurista |
| `/admin/users` | Super-only user management |
| `/admin/account` | Magaca iyo password-ka qofka galay |

Public Layout wuxuu leeyahay Header, Footer iyo `components/common/QuoteModal.jsx`. Modal-kan ayaa ah midka firfircoon. `components/ui/QuoteModal.jsx` iyo QuoteContext waa waddo kale oo jirta; ha lagu khaldin modal-ka Layout-ku isticmaalo.

## Sida xogtu u socoto

1. `src/lib/supabase.js` wuxuu client-ka ka sameeyaa labada `VITE_SUPABASE_*` variables.
2. `ServicesContext.jsx` wuxuu marka hore hayaa `src/data/servicesData.js` static data.
3. `servicesApi.js` wuxuu codsadaa published services iyo nested `service_images`, `service_testimonials`, sort_order ahaan.
4. `mapServiceRow` wuxuu database rows u rogaa shape ay components-ku isticmaalaan: imageHero, imageThumbnail, recentImages iyo testimonials.
5. Header, Footer, Home, Contact iyo quote form waxay isticmaalaan ServicesContext. Sidaas darteed hal service change wuxuu saameyn karaa meelo badan.
6. Admin-ku wuxuu si toos ah Supabase ugu qoraa iyadoo RLS ay tahay xannibaadda server-ka. Save kadib public context-ka isla tab-ka waa la refresh-gareeyaa. Realtime subscription/polling ma jiro; tab kale refresh ayuu u baahan karaa.

Service content waa plain text leh line breaks; ma aha HTML/rich-text editor. Slug wuxuu qeexaa URL-ka. Homepage hero images waxay si gaar ah ugu xiran yihiin slugs-ka carpet-cleaning, window-cleaning, specialist-services iyo front-of-house; hero text-ku waa static.

## Database-ka sida migrations-ku qeexayaan

| Table | Columns muhiim ah | Xiriir |
| --- | --- | --- |
| `profiles` | id, email, full_name, role, timestamps | id → auth.users; user delete wuxuu tirtiraa profile |
| `services` | id, unique slug, title, content, sort_order, is_published, timestamps | Parent-ka service content |
| `service_images` | id, service_id, kind, slot, url, storage_path, timestamps | service delete → cascade; unique(service_id,kind,slot) |
| `service_testimonials` | id, service_id, quote_text, client_name, initials, sort_order, timestamps | service delete → cascade |

`user_role`: super/admin/user. `image_kind`: thumbnail/hero/recent. Image slot waxaa SQL-ku xaddidayaa 1–6. `set_updated_at` triggers ayaa timestamps cusboonaysiiya. Auth signup trigger ayaa profile abuura.

Storage bucket: `service-images`, public, 10 MiB file limit, image MIME allowlist. Public bucket URL lama qariyo marka service draft noqdo; published visibility-ka database-ka iyo helitaanka URL-ka sawirka waa laba arrimood.

## Awoodaha client-ka ee hadda

| Qaybta | Waxa la beddeli karo |
| --- | --- |
| Services | Add/delete, title, slug, plain-text content, order, published/draft |
| Marketing images | Thumbnail iyo service hero upload/replace/remove |
| Recent works | Ilaa 16 sawir upload/replace/remove |
| Testimonials | Add/edit/delete, quote, client name, initials, order |
| Account | Own full name iyo password |
| Users | Super oo keliya: create, email/name/role/password update, delete others |

16 gallery images waxaa lagu helay recent slots 1–6 + hero slots 2–6 + thumbnail slots 2–6 (`imageSlots.js`). Waa heshiis muhiim ah oo code-ka ku jira: hero/thumbnail slot 2+ dhab ahaan waa gallery. Migration kasta oo images beddelaya waa inuu records-kan ilaaliyaa.

Waxyaabaha aan admin-ka laga beddeli karin: Home slide text iyo slide management madax-bannaan, Home section headings, About paragraphs/mission/values, contact details, enquiry recipient, WhatsApp/social links, logo/branding, office hours, footer text/copyright, service template labels/CTA iyo SEO metadata per page.

## Authentication iyo permissions

- `super`: content edit + user management.
- `admin`: content edit; ma maamulo users.
- `user`: read-only staff; magaca user ma aha customer account caadi ah.
- `AdminLayout` session ayuu hubiyaa; profile/role sax ah si gaar ah uguma xannibo shell-ka. Content controls waxay isticmaalaan canEdit; database RLS iyo server API ayaa ah enforcement-ka muhiimka ah.
- Migrations-ku waxay public u oggol yihiin published service reads; staff wuxuu arki karaa drafts. Profiles select policy waxay staff u oggolaanaysaa inay akhriyaan profiles-ka kale.
- `/api/admin-users` → `api/adminUsersCore.js`: token waxaa lagu xaqiijiyaa Auth, kadib profile role super ayaa server-ka laga hubiyaa. Service-role key wuxuu ku shaqeeyaa server-ka.
- Vite config wuxuu leeyahay middleware isla API-kan local u shaqaysiiya. DEPLOY.md sheegashadiisa ah users page inuu mar walba u baahan yahay vercel dev waa duug marka code-kan la eego.
- `supabase/functions/admin-users/index.ts` waa implementation kale oo Edge ah; frontend-ku hadda wuxuu wacaa Vercel route. Labada implementation way kala duwanaan karaan haddii mid keliya la saxo.
- `.env` iyo `.admin-credentials.local` Git tracking kuma jiraan hadda, gitignore-na wuu daboolaa. Qiimayaashooda warbixintan laguma qorin.

## Contact iyo quotes

Contact iyo modal-ka shaqaynaya waxay wada isticmaalaan `contactFormValidation.js` iyo `submitEnquiryEmail.js`. Browser-ka ayaa JSON u dira FormSubmit, recipient-kuna code ayuu ku qoran yahay. SQL-ka jira ma laha enquiries table; dashboard inbox ma jiro. Contact phone waa optional, quote phone waa required. FormSubmit activation iyo inbox delivery lama xaqiijin. Ha la samayn test submission dhab ah iyadoo aan la qorshayn cidda helaysa.

## Arrimaha mudnaanta leh

1. **Role-ka signup metadata laga qaadanayo:** `handle_new_user()` wuxuu role ka akhriyaa `raw_user_meta_data`. Haddii public signup live-ka ka furan yahay, qofku wuxuu isku dayi karaa inuu metadata ku dalbado admin/super. Tani waa khatar ku muuqata SQL-ka; live exploit lama tijaabin. Default role ha noqdo user, promotion-na ha maro trusted server. Xaaladda signup live-ka ha la xaqiijiyo.
2. **Empty published list wuxuu keenayaa static fallback:** haddii services oo dhan la unpublish/delete gareeyo, ServicesContext wuxuu dib u soo bandhigayaa static services. Error kasta, xitaa testimonials migration maqnaanshihiisu, wuxuu sidoo kale qarin karaa content-ka live-ka isagoo soo celinaya kii hore.
3. **Empty gallery/testimonials ma aha empty:** recent images la wada saaro waxay dib u keenayaan static gallery; testimonials la wada saaro waxay soo keenayaan default quotes. Client-ku hadda si cad uma dhihi karo qaybtan madhnaan/qarsoomi ha noqoto.
4. **Files iyo rows ma wada aha transaction:** image upload kadib DB write fail wuxuu reebi karaa orphan file. Image removal wuxuu storage ka bilaabaa; DB delete fail wuxuu reebi karaa row tilmaamaya file maqan. Storage remove errors meelo waa la iska dhaafaa. Service delete wuxuu cascade ku saaraa rows, bucket files-na ma nadiifiyo.
5. **Users updates qayb ahaan way guulaysan karaan:** auth email/password iyo profile updates waa tallaabooyin kala duwan. Create profile update error lama hubiyo. Super wuxuu beddeli karaa role-kiisa; last-super protection ma jiro, inkastoo own-account delete la mamnuucay.
6. **Slug iyo homepage coupling:** slug change wuxuu jebin karaa links hore iyo hero selection. Redirect history iyo independent hero settings ma jiraan.
7. **Performance:** images waaweyn iyo hal JS bundle ayaa jira; public/admin lazy loading ma jiro. Compression-ku upload-ka cusub ayuu khuseeyaa, assets hore oo dhan ma hagaajiyo. Image renderer failure wuxuu leeyahay original URL fallback.
8. **Content iyo maintenance:** About wuxuu leeyahay laba paragraph oo isku macne ah; static data iyo seed data waa nuqullo kala madax-bannaan. `src/data/services.js` wuxuu leeyahay slugs ka duwan primary data; references ha la hubiyo kahor isticmaal. README waa Vite template; setup script wuxuu overwrite-gareeyaa .env oo kuma filna deployment-ka hadda. Seeds waxay upsert ku beddeli karaan client edits; ha loo adeegsan hawl joogto ah.
9. **SEO iyo validation:** index.html wuxuu leeyahay title guud; ma jiro metadata management per service. Slug input-ku required ayuu yahay laakiin format validation cad ma laha. Live SEO, accessibility iyo mobile checks wali waa shaqo bannaan.

## Habka lagu ballaarin karo CMS-ka

1. Marka hore sax role assignment, empty/fallback semantics, storage consistency iyo lint baseline. Ku xaqiiji roles iyo published/draft behavior staging.
2. Ku dar singleton `site_settings`: company details, contact/WhatsApp/social, office hours, logo iyo footer. Hal source ha isticmaalaan Header, Footer, Contact iyo quote recipient configuration.
3. Ku dar `home_slides`: title/subtitle/description, image, order iyo published. Ka saar ku-tiirsanaanta service slugs.
4. Ku dar content fields/sections si cad loo qeexay oo Home/About/Contact iyo service template headings ah, leh validation iyo defaults migration lagu geliyey. Client-ka sii controls la fahmi karo.
5. Ku dar metadata per page/service iyo image alt text; haddii loo baahdo enquiry inbox, database records iyo delivery status si gaar ah u naqshadee.
6. Ku dar draft preview, unsaved-change protection iyo change history marka baaxadda content-ku korodho.

Isbeddel walba: qeex source-ka xogta → migration additive ah → RLS → API mapping → admin controls → public rendering → xaqiiji role/publish/failure behavior. Ha la rename/delete-gareyn columns ama dib ha loo seed-gareyn live content iyadoo aan backup iyo migration plan jirin. Data migration-ku ha ilaaliyo IDs, slugs iyo gallery slots hadda jira.

## Files-ka shaqada dambe laga bilaabayo

- Routes/providers: `src/App.jsx`, `src/main.jsx`, `src/context/`.
- Public content: `src/pages/`, `src/components/layout/`, `src/components/services/RecentWorks.jsx`.
- CMS editors: `src/pages/admin/`, `src/components/admin/`.
- Data contracts: `src/lib/servicesApi.js`, `src/lib/adminApi.js`, `src/lib/imageSlots.js`.
- Auth/server: `src/context/AuthContext.jsx`, `api/adminUsersCore.js`, `vite.config.js`.
- Schema/security: `supabase/migrations/`.
- Fallback assets/data: `src/data/`, `src/config/recentWorksAssetFolders.js`, `src/lib/resolve*Images.js`.
- Deployment/setup: `vercel.json`, `DEPLOY.md`, `scripts/`.
