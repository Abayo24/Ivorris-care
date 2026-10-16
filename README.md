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
- **Sanity** CMS with the Studio embedded at `/studio` (`next-sanity`)
- **WhatsApp** click-to-chat for enquiries (no backend or API keys)
- **"Ask Ivorris" assistant**: a free, in-browser FAQ chat (no AI service or API key) — answers live in `src/content/assistant.ts`
- Fonts: Cormorant Garamond (headings) and DM Sans (body), via `next/font`

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values; the site runs without them
npm run dev
```

Without Sanity credentials the site works fully, and the blog shows an "articles
on their way" state. The contact form needs no setup: it opens WhatsApp with the
visitor's message ready to send to `NEXT_PUBLIC_WHATSAPP_NUMBER`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (includes the type check) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check only |
| `node seed/build-starter-content.mjs` | Regenerate `seed/starter-content.ndjson` |

## Structure

```
src/
  app/
    (site)/            Public pages, sharing the header and footer layout
      page.tsx           Home
      services/          Overview + [slug] service pages (content from src/content/services.ts)
      connect-and-coordinate/, equipment/, about/, contact/, privacy/
      blog/              Listing (search, category filter, pagination) + [slug] article
    studio/[[...tool]]/ Sanity Studio (noindex, disallowed in robots.txt)
    api/
      revalidate/        Signed Sanity webhook → revalidateTag('sanity')
      draft-mode/        Enable (validated by Sanity) / disable preview
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.png, apple-icon.png
  components/          brand/, layout/, ui/, sections/, blog/, forms/, seo/
  content/             Business copy and configuration (site, services, home, connect, equipment,
                       photos: every photo path + alt text, with Pexels credits)
  lib/                 seo.ts (metadata + JSON-LD), contact.ts (shared validation), format.ts
  sanity/              env, client/fetch, GROQ queries, schema types, Studio structure
sanity.config.ts       Studio configuration (structure + Presentation preview tool)
seed/                  Starter categories and sample (draft) articles for import
docs/OWNER-GUIDE.md    Owner and editor documentation
docs/SEO-PLAN.md       Search keywords, AI visibility and next steps
```

## How content publishing works

- Public pages read **published** content only (`perspective: 'published'`). Drafts
  never reach visitors.
- Fetches are cached with the tag `sanity` and revalidate every 60 seconds. The Sanity
  webhook (`/api/revalidate`, HMAC-signed with `SANITY_REVALIDATE_SECRET`) expires
  the tag immediately on publish, unpublish, edit or delete.
- Previews: the Studio's Presentation tool calls `/api/draft-mode/enable`, which
  validates a short-lived secret with Sanity using the server-only
  `SANITY_API_READ_TOKEN`. Draft-mode requests read drafts uncached.
- Editing permissions are handled by Sanity project membership and roles. No CMS
  write token exists in this app.

## SEO, AEO and structured data

- Per-page metadata through `pageMetadata()` in `src/lib/seo.ts`: title, description,
  canonical URL, Open Graph and Twitter. Article metadata comes from CMS fields.
- JSON-LD: `Organization` and `WebSite` (site-wide), `BreadcrumbList`, `Service` and
  `FAQPage` (service pages and FAQ sections), `BlogPosting` (articles). Only visible,
  verified information is included: no ratings, opening hours or street address.
- The sitemap includes static pages and published, indexable, non-sample articles.
  `robots.txt` disallows `/studio` and `/api/`. Search results and sample articles
  are `noindex`.
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
3. Complete the Sanity CORS and webhook steps in the owner guide.

Security headers are set in `next.config.ts`: a Content-Security-Policy in production
(a separate, looser one for `/studio`), HSTS, nosniff, frame options, COOP, and the
referrer and permissions policies. The contact form has no server endpoint: it builds a
WhatsApp message in the browser, so the site stores no enquiries. Secrets are
server-only and never prefixed `NEXT_PUBLIC_`.

`npm audit --omit=dev` still lists advisories inside Sanity's CLI and build tooling
(`@sanity/cli` and its dependencies), not in code served to visitors. The only fix npm
offers is a major downgrade of Sanity, so update `sanity` when a patched release lands.

Lighthouse (production build, 13.5): Accessibility, Best Practices and SEO score 100;
Performance is 100 on desktop and 91–95 on simulated slow-4G mobile.
