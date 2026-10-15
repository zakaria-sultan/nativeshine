# CMS changes — 15 October 2026

## Waxa la beddelay

- Testimonials-ka public-ka hadda waxay isticmaalaan database rows oo keliya.
  Default quotes iyo service/gallery fallbacks waa laga saaray waddada public-ka.
  Marka quote/sawir/adeeg la tirtiro ama la unpublish-gareeyo, static content
  dib uguma buuxsamo booskaas.
- Save/delete waxaa la xaqiijiyaa iyadoo database-ku soo celinayo row-ga uu
  beddelay. Edit duug ah oo lagu sameeyo record qof kale beddelay waa la diidaa,
  waxaana la muujiyaa fariin reload ah. Settings iyo slides-na sidaas ayay yihiin.
- Auth profile queries waxaa dib loogu dhigay marka auth callback-ku dhammaado,
  si token refresh uusan ugu dhegin auth lock. Requests hore ma beddeli karaan
  natiijo cusub. Editor initial-load races waa la xannibay.
- Public tabs waxay xogta dib u akhriyaan focus/reconnect, 60-second polling iyo
  admin saves ee isla browser-ka. Network failure ma soo celiyo defaults.
- `/admin/homepage`: add/edit/delete, title/subtitle/description, background image
  URL ama upload, order iyo published/draft. Sawirrada iyo qoraallada hadda jira
  waxaa database-ka lagu geliyey hal mar.
- `/admin/settings`: office phone, mobile/WhatsApp, enquiry email, address iyo
  office hours. Contact page, mobile header, footer WhatsApp iyo labada enquiry
  form waxay wada isticmaalaan isla settings-ka. Google Map query-gu wuxuu ka
  samaysmaa isla address-ka; looma baahna embed code gaar ah.
- FastImage hadda wuu raacaa URL cusub marka props-ku beddelmaan. Image file
  cleanup-ku database writes ayuu ka dambeeyaa; files wali slide/service kale
  isticmaalo lama tirtiro. Failed upload save wuxuu isku dayaa rollback cleanup.
- Signup metadata kama dhigi karto qof admin/super. Database-ku wuxuu ilaaliyaa
  super-kii ugu dambeeyey. Own-profile RLS recursion waa la saaray. User API-ga
  wuxuu hubiyaa profile setup iyo own-super protection; Vercel/Vite/Edge waxay
  wadaagaan implementation.
- Lint errors waa la saxay. CMS routes iyo image compression waxaa la kala
  raray si public bundle-ku u yaraado. Dependencies waxaa lagu sameeyey
  compatible security updates. About paragraph-kii soo noqnoqday waa la saaray.
- Seed scripts-ka waxaa laga ilaaliyey inay si kama' ah u overwrite-gareeyaan
  client content. Setup-ku ma overwrite-gareeyo .env hore u jira.

## Xaqiijinta

Natiijada ugu dambaysa: lint iyo production build way gudbeen; 8 unit tests,
18 Chrome tests, live persistence/API checks iyo SQL permissions checks way
gudbeen. `npm audit fix` kadib npm wuxuu soo sheegay 0 vulnerabilities. Browser
bundle-ka waxaa laga xaqiijiyey inuusan ku jirin server service-role key.

- Unit checks: mapping, empty data, validation, map/phone/WhatsApp URLs,
  configured email, email-service failures iyo basic API authorization.
- Chrome regression suite: testimonial edit/delete, reload, simulated elapsed
  time iyo expired-token refresh, outage recovery, gallery deletion, shared
  contact settings, mobile layout, map query, both enquiry forms, hero CRUD,
  hero uploads, cross-tab refresh, read-only roles iyo stale-write rejection.
- Real Supabase test: temporary admin, private service/slide/testimonial,
  create/edit/delete, fresh-session reads, actual token refresh, optimistic-write
  conflict, image uploads in both buckets iyo shared user-management API.
  Fixtures-ka waa la tirtiraa; existing testimonials/settings waa la barbar
  dhigaa snapshot-koodii hore.
- `tests/database.sql`: signup role safety, last-super protection, own-profile
  update, admin edits/deletes iyo anonymous/read-only RLS; rollback-only.
- SQL migration waxaa marka hore lagu tijaabiyey transaction rollback leh,
  kadibna waa la apply-gareeyey. Existing client content lama seed-gareyn.

## Xadka

Code-ku wuxuu u baahan yahay deployment-ka Vercel si website-ka production-ku u
isticmaalo sixitaannada. Session-kan frontend deploy ma samayn. Email delivery
mailbox dhab ah looma dirin; new recipient wuxuu u baahan karaa FormSubmit
activation. Saacadda browser-ka waa la dedejiyey oo token expiry waa la
simulate-gareeyey; lama sugin saacad dhab ah. File cleanup-ku waa best effort
haddii Storage uu fashilmo; database content-ku dib uguma soo noqdo arrintaas.

Warbixintii hore ee `WEBSITE-AUDIT.md` waa snapshot ka hor sixitaannadan.

## Company branding

`/admin/branding` wuxuu client admin-ka siinayaa laba upload: company icon iyo
company wordmark (magaca/hal-ku-dhegga oo dhan). Save wuxuu wada beddelaa header,
mobile drawer iyo footer; icon-ku sidoo kale wuxuu beddelaa favicon-ka.
`Restore original` wuxuu soo celiyaa icon-kii hore ama SVG wordmark-ka hadda la
habeeyey. Default-ka jira lama beddelin ilaa client-ku save sameeyo.

PNG, JPEG iyo WebP ilaa 5 MB ayaa la aqbalaa; PNG/WebP transparency iyo original
quality waa la ilaaliyaa. Sawir dhaawacmay waa la diidaa kahor upload.
Save-ku wuxuu beddelaa branding fields oo keliya, wuxuuna isticmaalaa
`updated_at` si aanu edit duug ahi u overwrite-gareyn mid cusub. Failed writes
waxay nadiifiyaan uploads-ka aan la isticmaalin; haddii response-ku lumo kadib
commit, file wali database-ku tixraacayo lama tirtiro. Files slide ama service
kale isticmaalo sidoo kale waa la ilaaliyaa.

Migration `20261015123000_company_branding.sql` wuxuu ku daraa `logo_url`,
`logo_storage_path`, `wordmark_url`, `wordmark_storage_path` isla `site_settings`.
Wuxuu adeegsadaa RLS-ka hadda jira iyo `site-images` bucket-ka.
`tests/branding-database.sql` wuxuu tijaabiyaa admin save/reset, public reads,
read-only/anonymous restrictions iyo URL validation, dhammaantood rollback leh.
Browser tests-ku waxay hubiyaan upload bytes, shared rendering, cross-tab refresh,
reload, mobile layout, reset, invalid files, stale/failed saves iyo lost responses.

## Admin notifications iyo delete confirmation

Admin-ku wuxuu wada isticmaalaa success/error toasts oo la xiri karo, mid walbana
wuxuu leeyahay waqti u gaar ah (success 5 seconds, error 8 seconds). Toast cusub
ma kordhiyo waqtiga kuwii hore. Login iyo logout sidoo kale waxay muujiyaan
natiijada hawsha; logout failure ma muujiyo success.

Services, testimonials, service images, homepage slides iyo users waxay wada
isticmaalaan confirmation dialog leh Cancel/Delete. Cancel ayaa focus-ka hela,
Escape iyo bannaanka dialog-ka waxay kansalaan, focus-kuna wuxuu ku noqdaa
button-kii furay haddii uu weli jiro. Browser modal-ku wuxuu xaddidaa keyboard
focus-ka, background scrolling-na waa la joojiyaa. Delete requests-ka waxaa laga
ilaaliyey clicks kale inta ay socdaan; failure-ku wuxuu muujiyaa error toast.

Browser regression tests waxay daboolaan delete/cancel, keyboard iyo mobile
layout, failed delete iyo retry, user delete request pending, toast timing iyo
logout. Tests-ku waxay isticmaalaan database/API mocks; live client data lama
tirtirin tijaabooyinkan.

Company icon-ka wuxuu hadda circular uga muuqdaa header, mobile drawer, footer
iyo admin preview; wordmark-ka silver border-kiisa sidoo kale waa la xoojiyey.
