# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page "dark luxury" portfolio + online-booking site for a hairstylist/make-up artist (Александр Якунин, Saint Petersburg), with an in-page admin panel where the owner edits *everything* (bookings, schedule, services, portfolio, texts, contacts, reviews, music, accent colour, sections, logo/favicon, SEO, privacy policy, backup). All UI text is Russian. No build step, no dependencies, no test suite — plain HTML/CSS/vanilla JS served as static files, backed by Google Apps Script + Google Sheets. README.md is the owner-facing deployment guide (Russian).

Design constraint from the owner: the admin should never need to touch code — any new visible content must be editable from the admin panel (usually via a key in `settings`).

## Running

```bash
python -m http.server 5173
```
Open http://localhost:5173 (also `site` in `.claude/launch.json`). Admin: footer «Вход для мастера» or `#admin`.

`js/config.js` currently points at the **live** Apps Script deployment. Do not submit bookings/emails against it while testing; blank `API_URL` (or intercept `config.js` in a headless browser) to get demo mode.

Syntax check: `node --check js/app.js` (copy `Code.gs` to a `.js` file to check it the same way).

## Architecture

**Two backends behind one API (`js/core.js` → `Y.api`).** Empty `SITE_CONFIG.API_URL` → **demo mode**: `local.handle()` in `core.js` emulates the Apps Script backend in `localStorage` (key `yakunin_demo_db_v2`, admin password `admin`, seeded fake bookings, emails not sent). **Any backend behaviour change must be made in both `core.js` (`local`) and `apps-script/Code.gs`.** Public calls: `Y.api.publicData()` (GET), `Y.api.call(action)` for `book` / `bookingInfo` / `clientCancel`; admin calls: `Y.api.admin(action)` (adds the password from `sessionStorage`).

**Apps Script transport:** public data is `GET ?action=public`; everything else is `POST` with a JSON body sent as `text/plain` (avoids a CORS preflight). Handlers live in `HANDLERS` in `Code.gs`; `PUBLIC_ACTIONS` lists unauthenticated ones; admin password is Script Property `ADMIN_PASSWORD`. After editing `Code.gs` the owner must redeploy a **new version** of the same deployment.

**Performance:** Apps Script is slow (~5–10 s cold). `getPublic_()` serves a 15-minute `CacheService` entry rebuilt by the `warmCache` time trigger (every 10 min) and invalidated by every write (`clearCache_()`). The browser additionally caches the last public payload in `localStorage` (`yakunin_pub_v1`) and renders it instantly; booking availability from a cache older than 30 min waits for fresh data. Server always re-validates the slot on `book`.

**Slot/availability logic is duplicated** in `core.js` (`Y.dayHours`, `Y.dayBusy`, `Y.daySlots`) and `Code.gs` (`dayHours_`, `daySlots_`) — keep in sync. Inputs: weekly `schedule.days` (keys `0`–`6`, 0 = Sunday), `step`, `horizon`, `leadHours`, daily break, `exceptions` (`type`: `off` date range / `busy` time block / `hours` custom hours for one date), and `busy` intervals `{d, s, e}` (date, start/end minutes). Times `"HH:mm"`, dates `"YYYY-MM-DD"`, timezone Europe/Moscow. Busy sources on the server: non-cancelled bookings + Google Calendar events (tagged `bookingId` events are skipped to avoid double counting).

**Settings model:** one object deep-merged over `Y.DEFAULT_SETTINGS` by `Y.mergeSettings` (which also repairs `site.sections`, default music tracks, `facts`/`awards` arrays). Top-level keys: `profile`, `site` (accent, cursor, parallax, music, sections order/labels/toggles, `texts.*`, SEO, `siteUrl`, privacy, logo, favicon, map provider, gallery options, `bookingOn`), `music`, `reviews`, `schedule`, `notify` (server-only; stripped from public data). Stored in the «Настройки» sheet as key → JSON rows; `Code.gs` has its own `DEFAULT_SCHEDULE`/`DEFAULT_NOTIFY`/`DEFAULT_SERVICES` (used when the services sheet is empty).

**Sheets storage (`Code.gs`):** column schemas in `COLS` (internal key ↔ Russian header). `sheet_()` migrates headers of existing sheets when columns are appended (never reorder columns). Statuses / exception types stored as Russian labels via `STATUS_RU` / `EX_RU` in `norm_`/`denorm_`. Date/time columns are text-formatted (`TEXT_COLS`).

**Owner email actions:** `ownerLink_(kind, id, op)` builds HMAC-signed GET links (`LINK_SECRET` script property) to `?action=owner`; `ownerPage_` renders an HtmlService page that first asks, then executes with `&do=1` (confirm/reject bookings, approve/hide reviews). **Client reviews:** sheet «Отзывы» (`rstatus` pending/approved/rejected), public actions `reviewInfo`/`submitReview` via `#review=<id>.<token>` links; approved ones are returned as `clientReviews` and merged with manual `settings.reviews`.

**Client emails:** `sendClientMail_(b, settings, kind)` with `kind` = `new | confirm | cancel | reminder | custom`, wrapped in the branded `emailHtml_` layout; confirmation attaches an `.ics`. Each booking has a random `token`; emails link to `siteUrl + '#cancel=<id>.<token>'`, handled by `checkCancelLink()` in `app.js` → `bookingInfo` / `clientCancel`. Notification history is appended to the booking's `log` column (`addLog_`) and shown in the admin card. SMS is either the owner's own phone (`sms:` link from the admin message modal) or optional paid SMS.ru. WhatsApp was deliberately removed.

**Server version check:** `VERSION` in `Code.gs` must equal `Y.SERVER_VERSION` in `core.js`; public data and `?action=version` expose it. The site treats a missing `version` as an outdated deployment (`S.serverOld`: booking shows a phone fallback; admin shows a red banner and explains login failures). Bump both when the API changes. `checkAuth_` falls back to `DEFAULT_PASSWORD` if `setup()` never ran.

**Front end (`app.js`):** sections are full-screen `.panel`s shown one at a time (router `go(id)` with hash + `history.pushState`; every section opens scrolled to top; clip-path "wipe" transitions with the leaving panel scaling back; wheel at panel edge / horizontal swipe move between sections). Content reveals via a per-panel `IntersectionObserver` (`startReveal`/`resetReveal`, classes `.a-up`, `.js-split` = per-letter headings via `splitText`, `.js-count` counters) and re-animates on every visit. Effects are toggled in admin (`site.animations`, `cursor`, `tilt`, `parallax`, `particles`, `grain`, `intro`) and applied by `applyEffects()` as `fx-*` classes on <html>; CSS must gate every effect on those classes. The cursor is the native cursor with accent SVG images (`--cur-d`/`--cur-p`) plus a click ring — do not reintroduce a JS-driven cursor (it lagged and broke). The intro shows real load progress (fonts, hero image, data). The admin calls `Y.applyLocal()` after saving so changes appear without waiting for the slow backend. Layout rule from the owner: each section should fit one screen — use tabs/categories/pagers/carousels instead of long scrolling (about tabs, price category tabs + 6-card pages, reviews carousel, 3-step booking wizard `B.step`). Portfolio has two views (`site.galleryView`): "cinema" slideshow (`showSlide`, clip-path wipe + Ken Burns, thumbnails, autoplay progress) and masonry grid. Music: `preload="none"`, starts the lightest track (`size`) on the first user gesture if `site.musicAutostart`, remembers the visitor's pause in `localStorage` (`y_music`); playlist popover `#playlist`. Desktop has a fixed sidebar (logo, nav, music player, CTA); ≤1023px uses a top bar + Instagram-style bottom nav + «Ещё» sheet. Visible sections and their order come from `settings.site.sections` (reviews auto-hide when empty). Other pieces: masonry gallery + lightbox, accordion price cards with icons from `Y.ICONS`, Airbnb-style booking calendar, contacts with Yandex/Google map iframe, HTML5 audio player, custom cursor, Schema.org JSON-LD generated in `renderMeta()`. The legacy Tilda hero portrait has white margins and is cropped on a canvas in `setHero()`. `img/logo.png` is the transparent, tightly cropped version of `img/logo_square.jpg`; admin logo uploads can be converted the same way (`Y.knockoutBlack`).

**Images/audio:** `Y.img(photo, width)` → Drive files via `lh3.googleusercontent.com/d/<fileId>=w<width>` (fallback via `data-fb`), Tilda URLs → resized thumbs. Admin uploads are resized client-side (`Y.resizeImage`) and sent base64 to `upload`, which saves to the «Сайт — фото» Drive folder shared by link; audio uses `Y.audioUrl`. Until the owner uploads photos, `Y.DEFAULT_PHOTOS` (old Tilda site) are shown.

**Admin (`admin.js`):** tabs are functions in `TAB_FN`. Fields bind through `data-p="<root>.<path>"` (roots `s` settings, `svc`, `ex`, `ph`); edits mark a kind dirty and the sticky save bar calls the matching `save*` action. Booking status changes save immediately. Portfolio supports HTML5 drag-and-drop reordering.

## Deployment notes

- After editing CSS/JS, bump the `?v=N` query strings in `index.html`.
- After editing `Code.gs`: run `setup()` if new columns/triggers were added (it is idempotent), then redeploy as a new version. `resetPassword()` resets to `yakunin2026`.
