# Ivorris Care website

The website for **Ivorris Care**, a nurse-led healthcare navigation and care
coordination service in Nairobi, Kenya:
*"Connecting you to the right care, people and resources."*

- **Owners and editors:** see **[docs/OWNER-GUIDE.md](docs/OWNER-GUIDE.md)** for
  setup, publishing articles, and items awaiting confirmation.
- **Search & AI visibility:** see **[docs/SEO-PLAN.md](docs/SEO-PLAN.md)** for keywords, the blog calendar and Google setup.
- **Developers:** read on.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4**, with design tokens as CSS variables in `src/app/globals.css`
- **Built-in article dashboard** at `/admin` (password sign-in, Tiptap editor), storing articles and images in **Vercel Blob**
- **WhatsApp** click-to-chat for enquiries (no backend or API keys)
- **"Ask Ivorris" assistant**: a free, in-browser FAQ chat (no AI service or API key) — answers live in `src/content/assistant.ts`
- Fonts: Cormorant Garamond (headings) and DM Sans (body), via `next/font`

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values; the site runs without them
npm run dev
```

In development the dashboard saves to `.data/` and `public/uploads/` (both
git-ignored), so no Blob store is needed; set `ADMIN_PASSWORD` in `.env.local`
to sign in at `/admin`. With no articles the blog shows an "articles on their
way" state. The contact form needs no setup: it opens WhatsApp with the
visitor's message ready to send to `NEXT_PUBLIC_WHATSAPP_NUMBER`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (includes the type check) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check only |

## Structure

```
src/
  app/
    (site)/            Public pages, sharing the header and footer layout
      page.tsx           Home
      services/          Overview + [slug] service pages (content from src/content/services.ts)
      connect-and-coordinate/, equipment/, about/, contact/, privacy/
      blog/              Listing (search, category filter, pagination) + [slug] article
    admin/             Article dashboard (noindex, disallowed in robots.txt)
      login/             Password sign-in
      (dashboard)/       Article list, editor (posts/new, posts/[id]) and preview
      actions.ts         Server actions: sign in/out, save, publish, delete, image upload
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.png, apple-icon.png
  components/          brand/, layout/, ui/, sections/, blog/, forms/, seo/, admin/
  content/             Business copy and configuration (site, services, home, connect, equipment,
                       photos: every photo path + alt text, with Pexels credits)
  lib/                 seo.ts (metadata + JSON-LD), contact.ts (shared validation), format.ts
    blog/                types, storage (Blob or local disk), public queries, rich-text sanitising
    admin/               session auth, slugs
docs/OWNER-GUIDE.md    Owner and editor documentation
docs/SEO-PLAN.md       Search keywords, AI visibility and next steps
```

## How content publishing works

- All articles live in one JSON document in Vercel Blob. Every save writes a new
  copy with a random suffix (so drafts can't be fetched by guessing a URL) and the
  newest copy wins; the last 10 are kept as backups (`src/lib/blog/store.ts`).
- Public pages read **published** articles only, through `unstable_cache` tagged
  `blog` (hourly safety refresh). Every dashboard save calls `updateTag('blog')`, so
  changes are live immediately.
- The article body is a ProseMirror (Tiptap) document. It is rebuilt from an
  allow-list of nodes, marks and attributes before saving (`sanitizeDoc`), and
  rendered as React elements (`RichText.tsx`), never as raw HTML. Images must come
  from the site's own uploads.
- Sign-in: one password (`ADMIN_PASSWORD`, compared in constant time) and a signed,
  HTTP-only, `SameSite=Strict`, `__Host-` session cookie (7 days). Failed attempts
  are throttled. Every dashboard page and server action checks the session.
- Uploads: photos are resized and re-encoded in the browser (dropping EXIF/GPS
  data), then checked server-side by file signature (JPEG, PNG, WebP; 4 MB max).
- Changing a published article's slug keeps the old URL as a permanent redirect.

## SEO, AEO and structured data

- Per-page metadata through `pageMetadata()` in `src/lib/seo.ts`: title, description,
  canonical URL, Open Graph and Twitter. Article metadata comes from CMS fields.
- JSON-LD: `Organization` and `WebSite` (site-wide), `BreadcrumbList`, `Service` and
  `FAQPage` (service pages and FAQ sections), `BlogPosting` (articles). Only visible,
  verified information is included: no ratings, opening hours or street address.
- The sitemap includes static pages and published, indexable articles.
  `robots.txt` disallows `/admin` and `/api/`. Search results are `noindex`.
- Old or guessed URLs redirect (see `redirects()` in `next.config.ts`).

## Decisions and changes from the previous site

The previous site was one long client-rendered page. It was rebuilt as a
server-rendered multi-page site around the new positioning. The reusable assets
were kept: the heart-and-hand logo (recoloured olive), the photography, the
verified contact details and the equipment leasing information.

Removed, because they conflicted with the "navigation, not a catalogue"
positioning or could not be verified:

- Tiered care packages (Basic, Standard, Premium, Platinum) with procedure lists
- Antenatal, postnatal and reproductive health packages
- Billing options
- Testimonials (not verifiable)
- The "AI Health" chat assistant, which returned canned answers making clinical
  and availability claims

The old copy remains in git history (`git show HEAD:src/app/page.tsx`) if any of it
needs to return with verified details.

## Deployment (Vercel)

1. Add the environment variables from `.env.example` in Vercel project settings.
2. Deploy as usual. The build command is `next build`.
3. Connect a public Vercel Blob store and set `ADMIN_PASSWORD` (see the owner guide).

Security headers are set in `next.config.ts`: a Content-Security-Policy in production,
HSTS, nosniff, frame options, COOP, and the referrer and permissions policies; `/admin`
is also `no-store` and `noindex`. The contact form has no server endpoint: it builds a
WhatsApp message in the browser, so the site stores no enquiries. Secrets are
server-only and never prefixed `NEXT_PUBLIC_`.

`package.json` overrides `zod` to 4.6.7 inside `@vercel/cli-config` (a dependency of
`@vercel/blob`), which pins a version with a known advisory. Remove the override once
`@vercel/blob` ships the fix.

Lighthouse (production build, 13.5): Accessibility, Best Practices and SEO score 100;
Performance is 100 on desktop and 91–95 on simulated slow-4G mobile.
