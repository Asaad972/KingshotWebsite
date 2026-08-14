# 🏰 KingShot Castle Appointments

A mobile-first booking site where KingShot players apply for castle time slots and admins assign exactly one slot per player.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** (Postgres + Auth + Storage).

---

## What you need to do before it runs

This project is complete source code, but it needs **your** Supabase project to run. Follow these five steps in order.

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New project. Wait for it to finish provisioning.

### 3. Run the database schema

In the Supabase dashboard, open **SQL Editor** and run these two files **in this order**:

1. `supabase/schema.sql` — tables, row level security, and the atomic booking functions
2. `supabase/storage.sql` — the `screenshots` storage bucket and its policies

`schema.sql` also generates your initial 49 slots automatically from the default settings.

### 4. Add your environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Then fill in the values from **Supabase → Project Settings → API**:

| Variable | Where to find it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Safe in the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key | Safe in the browser, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` `secret` key | **SECRET.** Server-only. Never commit it. |
| `NEXT_PUBLIC_SUPABASE_SCREENSHOTS_BUCKET` | — | Leave as `screenshots` |

### 5. Create your first admin

Admins are ordinary Supabase Auth users who are also listed in the `admin_users` table. Being logged in is *not* enough — you must be on that allow-list.

1. In Supabase → **Authentication → Users → Add user**, create a user with an email and password. Tick "Auto Confirm User".
2. Copy that user's UUID.
3. In the **SQL Editor**, run:

```sql
insert into admin_users (user_id) values ('PASTE-THE-USER-UUID-HERE');
```

Now start the app:

```bash
npm run dev
```

Open <http://localhost:3000>, and sign in to the admin area at <http://localhost:3000/admin>.

---

## Adding your own tutorial screenshots

The two tutorial cards on the home page currently show placeholder boxes. To use your own images:

1. Drop your images into `public/tutorial/` (e.g. `main-account.png` and `speedups.png`).
2. In `src/app/page.tsx`, find the `TutorialCard` component at the bottom of the file and replace the placeholder `<div role="img">` with:

```tsx
<img src="/tutorial/main-account.png" alt={alt} className="aspect-video w-full rounded-lg object-cover border border-gold-700/40" />
```

---

## How the app is organised

```
src/
  app/
    page.tsx                     Home: hero, live UTC clock, tutorial cards
    book/page.tsx                Booking flow: slots, info, uploads, review, submit
    schedule/page.tsx            Public appointment board with live countdowns
    admin/
      page.tsx                   Admin login
      (protected)/               Everything here requires an admin session
        dashboard/               All slots + request counts
        slot/[id]/               Review applicants, accept or reject
        settings/                Event config, open/close applications
        search/                  Player search + player view
    api/
      slots/                     Public: settings + slots
      schedule/                  Public: board data (public-safe fields only)
      applications/              Public: submit application
      applications/[id]/accept   Admin: accept (atomic)
      applications/[id]/reject   Admin: reject
      admin/*                    Admin-only data endpoints
  components/                    LanguageSelector, UTCClock, CastleSlotCard,
                                 SlotSelector, ScreenshotUploader, BookingSummary,
                                 AdminSlotCard, ApplicantCard, CountdownTimer,
                                 ConfirmationModal, AdminSidebar, Tutorial, ...
  lib/
    i18n/                        Provider + en / ar / tr dictionaries
    slots.ts                     Slot generation + UTC formatting (pure functions)
    supabase/                    client / server / admin (service-role) clients
    adminAuth.ts                 requireAdmin() guard for API routes
  middleware.ts                  Blocks unauthenticated access to /admin/*
supabase/
  schema.sql                     Tables, RLS, atomic functions
  storage.sql                    Screenshot bucket + policies
```

---

## The important design decisions

### Slots are never hardcoded

All 49 slots are generated from the `event_settings` row (date, start time, interval, count). Change them in **Admin → Event settings** and the grid rebuilds itself. Rebuilding is blocked automatically if any slot is already booked, so you can't pull the schedule out from under a player who has already been assigned a time.

### One appointment per player, enforced in the database

The whole acceptance flow lives in one Postgres function, `accept_application_slot`, rather than in application code. When an admin accepts a player:

1. The slot is booked via an atomic compare-and-set (`update ... where status <> 'booked'`). If a second admin tries the same slot at the same moment, their update matches zero rows and they get a clear "another admin already assigned this slot" message.
2. The application row is locked first, so the same player can't be accepted for two different slots by two admins simultaneously.
3. Every *other* slot that player requested is marked `removed_after_acceptance` — **not deleted**, so you keep the full audit trail — and those slots drop back to `pending` or `available` depending on whether other applicants remain.

### Screenshots are private

The `screenshots` bucket is not public — there's no way to browse or guess your way to someone else's file. Anyone can upload (that's how anonymous players apply) to a path namespaced by an unguessable client-generated folder id; the storage API's upsert also needs an anon SELECT grant to work (it checks whether a path already exists before deciding insert vs. update), but paths remain unguessable so this doesn't expose anything in practice. Admins view screenshots through short-lived signed URLs generated server-side with the service-role key.

### The service-role key never reaches the browser

It's only imported in `src/lib/supabase/admin.ts`, which is only ever used from API routes. Every admin API route independently re-checks the caller is authenticated *and* on the `admin_users` allow-list before doing anything — the middleware is a convenience, not the security boundary.

---

## Your test cases, and where each is handled

| # | Case | Where |
|---|---|---|
| 1 | 5 slots selected → appears under all 5 | `create_application` inserts one `application_slots` row per slot |
| 2 | Accepting removes player from other slots | `accept_application_slot`, marked `removed_after_acceptance` |
| 3 | Booked slot not selectable or submittable | Disabled in `CastleSlotCard` **and** rejected in `create_application` |
| 4 | Two admins, same slot → one wins | Atomic `update ... where status <> 'booked'` |
| 5 | Only one screenshot → blocked | Client `validate()` + `create_application` raises |
| 6 | Zero slots → blocked | Client `validate()` + `create_application` raises |
| 7 | Slot booked between select and submit | Returns `slots_unavailable` + the offending IDs; UI strips them, refreshes, and explains |
| 8 | Arabic → full RTL | `dir="rtl"` on `<html>`; layout uses logical properties (`ps-`, `me-`, `text-start`) throughout |
| 9 | Language change keeps selections | Selections live in React state + `sessionStorage`, independent of locale |
| 10 | Applications closed → no submissions | Checked in `create_application`, plus the booking page shows a closed state |

**Please test cases 4 and 7 yourself against your live database** — they're timing-dependent, and I was not able to run this against a real Supabase instance (see the note below). Case 4 is easiest to check with two browsers logged in as two admins, both open on the same slot.

---

## An honest note on testing

I wrote and reviewed all of this code carefully, but I could **not execute it**: my environment had no network access, so `npm install` and a live Supabase connection were both unavailable. That means no `npm run build`, no runtime testing, and no verification against a real database.

What I did verify by static analysis:

- Every internal `@/` import resolves to a file that exists
- All 136 translation keys exist and are identical across English, Arabic, and Turkish, with no key used in a component that's missing from the dictionaries
- Every Tailwind colour utility used maps to a defined token (this caught `parchment-500`, used in 8 places but originally undefined)
- SQL dollar-quote delimiters balance, and all policies are idempotent so `schema.sql` can be re-run safely

Expect to hit a few small things on first run — most likely a PostgREST embed hint or a Next.js type nit. Send me any error output and I'll fix it.

---

## Deploying

Deploy to [Vercel](https://vercel.com): import the repo, add the same four environment variables from `.env.local` in the project settings, and deploy. Add your production domain to **Supabase → Authentication → URL Configuration**.
