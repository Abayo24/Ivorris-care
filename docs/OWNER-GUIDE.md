# Ivorris Care website — owner guide

This guide covers everything you need to run the website and publish articles
without a developer. It has three parts:

1. [One-time setup](#1-one-time-setup) — turn on the article dashboard and add your intro video.
2. [Writing and publishing articles](#2-writing-and-publishing-articles) — the everyday workflow.
3. [Things to check and confirm](#3-things-to-check-and-confirm).

---

## 1. One-time setup

Everything runs on **Vercel**, which already hosts the website. There are no
other accounts to create and nothing to pay on Vercel's free plan.

Settings are entered in **Vercel → your project → Settings → Environment
Variables**. After changing them, redeploy once (**Deployments → … →
Redeploy**). The full list with explanations is in
[`.env.example`](../.env.example).

### 1.1 Turn on the article dashboard

1. **Storage for articles and images.** In Vercel, open your project →
   **Storage** → **Create Database** → **Blob**. Name it (for example
   "ivorris-blog"), choose **Public** access, and **connect it to this
   project** for all environments. Vercel adds the connection setting
   (`BLOB_STORE_ID`) for you. Redeploy afterwards so the site picks it up.
   "Public" only means published images can be shown on the website. Drafts are
   stored under unguessable names and are only shown in the dashboard.
2. **Your dashboard password.** Add `ADMIN_PASSWORD` with a long password of at
   least 12 characters (a password manager can generate one). Keep it private;
   anyone with it can publish on the website. To sign everyone out, change it.
3. Redeploy, then open **`https://YOUR-SITE/admin`** and sign in.

### 1.2 Contact form and WhatsApp

Nothing to set up. The contact form and the green WhatsApp button open WhatsApp
with the visitor's message ready to send to **+254 705 819 115**. Messages arrive
in that WhatsApp account, so make sure someone checks it. To use a different
number, set `NEXT_PUBLIC_WHATSAPP_NUMBER` (country code, no `+` or spaces, e.g.
`254705819115`) and `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY`, then redeploy.

### 1.3 The "Ask Ivorris" assistant

Nothing to set up and nothing to pay. The olive "Ask Ivorris" button opens a
chat that answers common questions about Ivorris instantly and hands visitors
over to WhatsApp. It runs in the visitor's browser, so nothing they type is
sent anywhere.

It only gives the answers written in `src/content/assistant.ts`, all taken from
the Ivorris information you supplied. Anything else — prices, availability,
qualifications, medical questions — gets "I don't have that information" and
a WhatsApp button. Emergencies are always directed to emergency services.

To add or change an answer, edit that file: each topic has a short label,
the words that trigger it, and the answer text.

### 1.4 Add your intro video

The home page currently shows a short public explainer, "What is a care
navigator?", made by Integrated Care Northamptonshire (NHS) and credited on the
card. To show your own video instead, upload it to YouTube (it can be
"Unlisted"), then add these in Vercel and redeploy:

- `NEXT_PUBLIC_INTRO_VIDEO_URL` = the YouTube link
- `NEXT_PUBLIC_INTRO_VIDEO_TITLE` = the label shown on the card, e.g. "Ivorris Care in a minute"

---

## 2. Writing and publishing articles

Open **`https://YOUR-SITE/admin`** and sign in with the dashboard password.
The **Articles** page lists everything you've written. Filter it by
**Published** or **Drafts**, and click any article to edit it.

### Write an article

Click **New article**. You get a clean page with nothing but your words:

1. **Title** — a clear question or statement a family might search for.
2. **Subtitle** — one or two sentences shown on the blog and in Google.
3. **The article** — just start typing. The bar at the top has headings (**H2**
   for sections, **H3** for sub-sections), bold, italic, links, lists, quotes,
   divider lines and images. For links to your own pages, use addresses that
   start with `/`, such as `/services/care-needs-assessment`. Every image needs
   a short description of what it shows.

Drafts **save themselves** about 20 seconds after you stop typing; the top bar
shows "Saved". Drafts are never visible on the website, and you'll be warned if
you try to leave before your latest changes are saved.

### Preview

Click **Preview** in the top bar to see the article exactly as it will appear
on the website. Preview shows the last saved version.

### Publish

Click **Continue**. A panel opens with everything else, and you only need the
first few:

- **Featured image** — upload a wide photo and describe it. Large photos are
  resized automatically, and hidden photo data (such as phone GPS location) is
  removed.
- **Category** (required), **Tags**, **Web address**, **Publication date**
  (leave it empty to use the day you publish), and **Feature this article**
  (shown large at the top of the blog).
- **Author & review** — who wrote it. Only fill in **Reviewed by** once a
  qualified professional has actually reviewed the article, and only enter
  qualifications people actually hold.
- **Questions & answers** and **Sources** — optional. Questions help the article
  appear in Google and AI answers.
- **Google & sharing** — optional search title and description, with a preview
  of how the article looks in Google results.

Then click **Publish now**. If something is missing, the panel lists what to
fix. The article appears on the website straight away.

### Update a published article

Open it, make your changes, and click **Update**. Published articles don't save
themselves, so visitors never see half-finished edits. Set **Last updated** in
the panel for meaningful changes. If you change the web address of a published
article, the old address keeps working and forwards visitors to the new one.

### Unpublish or delete

At the bottom of the **Settings** panel:

- **Unpublish** takes it off the website but keeps it as a draft.
- **Delete article** removes it permanently, after you confirm.

### Backups

The last 30 saves are kept in the Blob store (Vercel → Storage → your Blob store
→ `blog/data/`). If something goes wrong, a developer can restore an earlier
copy.

### Writing guidance

- Write the way a knowledgeable nurse would explain things to a family member:
  clear, warm and practical.
- Help readers understand their situation and a sensible next step. Link to
  the relevant service or to `/contact`.
- Avoid diagnosing, alarming language, or promises about outcomes.
- Cite reputable sources for health information, and have health content
  reviewed before publishing.

---

## 3. Things to check and confirm

These items need the owner's confirmation. Each one is easy to change.

| Item | Where | Status |
| --- | --- | --- |
| **Exact olive green colour.** The supplied code `#59604` is incomplete; a temporary `#596042` is used. | `src/app/globals.css` (top of file) | Needs confirming |
| Phone, WhatsApp, email and "Nairobi, Kenya" | Environment variables, or `src/content/site.ts` | Taken from the previous site; confirm they're current |
| Service area (only "based in Nairobi" is stated) | `src/content/site.ts`, `src/content/home.ts` | Confirm before naming specific areas |
| Service and FAQ wording | `src/content/services.ts`, `src/content/home.ts`, `src/app/(site)/connect-and-coordinate/page.tsx` | Please review with your clinical lead |
| Equipment list, lease terms and rent-to-own rules | `src/content/equipment.ts` | Carried over from the previous site; confirm stock and terms |
| Privacy notice | `src/app/(site)/privacy/page.tsx` | Please have it reviewed against the Kenya Data Protection Act, 2019 |
| Photography | `src/content/photos.ts`, `public/photos/` | Photos supplied by Ivorris, named for where they go. About and Connect & Coordinate reuse the closest match. To swap one, add a photo to `public/photos/` and change its path and description in `photos.ts`. |
| Content removed from the previous site | — | Care packages (Basic → Platinum), antenatal, postnatal and reproductive health packages, payment options, testimonials and the AI chat assistant were removed (see the README). Tell us if any should return, with verified details. |
