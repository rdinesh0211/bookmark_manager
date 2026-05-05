# Bookmark Manager

Personal bookmark manager built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Features

- Save bookmarks with `url`, `description`, and multiple `tags`
- Auto-fetch page title when saving (fallback to hostname if unavailable)
- View all bookmarks in a clean list with timestamp
- Search bookmarks in real-time by title, description, or tags
- Open bookmark links in a new tab
- Delete bookmarks
- Tag autocomplete based on existing tags

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase

## 1) Install

```bash
cd bookmark_manager
npm install
```

## 2) Configure environment variables

Create `.env.local` from example:

```bash
cp .env.local.example .env.local
```

Set values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3) Create database schema in Supabase

Run the SQL in `supabase/schema.sql` inside Supabase SQL Editor.

This creates:

- `public.bookmarks` table
- required columns: `id`, `url`, `title`, `description`, `tags`, `created_at`
- row-level security policies for select/insert/delete

## 4) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5) Build for production

```bash
npm run build
npm run start
```

## 6) Deploy to Vercel

### Option A: Vercel Dashboard

1. Push this project to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import the repo.
3. Framework preset should auto-detect as **Next.js**.
4. Add these environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy.

### Option B: Vercel CLI (bash)

```bash
npm i -g vercel
cd bookmark_manager
vercel
```

Set env vars via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Redeploy with production settings:

```bash
vercel --prod
```

### Post-deploy checks

- Open deployed URL
- Add one bookmark and verify it appears
- Search by tag/title and verify filtering
- Delete bookmark and verify removal

## Manual test checklist

1. **Add bookmark**
   - Enter a valid URL (`https://...`)
   - Add description and tags
   - Click **Save bookmark**
   - Confirm bookmark appears in list with title/timestamp

2. **Search**
   - Type in search bar
   - Confirm filtering works for title, description, and tags

3. **Delete**
   - Click **Delete** on a bookmark
   - Confirm it is removed from the list

## Create a git branch (bash)

```bash
git checkout -b feat/bookmark-manager-v1
```
