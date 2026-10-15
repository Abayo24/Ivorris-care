# Ivorris Care website — owner guide

This guide covers everything you need to run the website and publish articles
without a developer. It has three parts:

1. [One-time setup](#1-one-time-setup) — connect the blog and add your intro video.
2. [Writing and publishing articles](#2-writing-and-publishing-articles) — the everyday workflow.
3. [Things to check and confirm](#3-things-to-check-and-confirm).

---

## 1. One-time setup

You will need accounts with these services:

| Service | What it does | Sign up |
| --- | --- | --- |
| **Vercel** | Hosts the website (already in use) | vercel.com |
| **Sanity** | Stores blog articles and runs the editor at `/studio` (free tier) | sanity.io |

All settings below are entered in **Vercel → your project → Settings →
Environment Variables**. After changing them, redeploy once
(**Deployments → … → Redeploy**). The full list with explanations is in
[`.env.example`](../.env.example).

### 1.1 Connect the blog (Sanity)

1. Go to **sanity.io/manage** and create a project (for example "Ivorris Care").
   Choose the dataset name **production** and keep its visibility **Public**.
   Public only means *published* articles can be read; drafts always stay private.
2. Copy the **Project ID** and add to Vercel:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
3. In the Sanity project, open **API → CORS origins** and add, each with
   **Allow credentials** ticked:
   - your live address, e.g. `https://ivorris-care.vercel.app` (and your own domain if you have one)
   - `http://localhost:3000` (only needed for local development)
4. **Preview tokens:** **API → Tokens → Add API token**, name it "Website preview",
   permission **Viewer**. Add it to Vercel as `SANITY_API_READ_TOKEN`.
   Keep it secret — never share it or put it in a `NEXT_PUBLIC_` variable.
5. **Instant updates:** create a long random password (a password manager can
   generate one) and add it to Vercel as `SANITY_REVALIDATE_SECRET`. Then in
   Sanity open **API → Webhooks → Create webhook**:
   - **URL:** `https://YOUR-SITE/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["post", "category", "author"]`
   - **Projection:** `{_type, _id}`
   - **HTTP method:** POST · **Drafts:** off
   - **Secret:** the same random password as `SANITY_REVALIDATE_SECRET`

   Without the webhook, changes still appear within about a minute.
6. Redeploy on Vercel, then open `https://YOUR-SITE/studio` and sign in.
7. **Invite editors:** sanity.io/manage → **Members → Invite**. Give writers the
   **Editor** role. Only invited members can sign in to the Studio.

### 1.2 Load the starter categories and sample articles (optional)

From a computer with the project code and Node.js installed:

```bash
npx sanity login
npx sanity dataset import seed/starter-content.ndjson production
```

This adds the six blog categories and three **sample articles saved as drafts**.
The samples are general, plain-language drafts marked **Demonstration
content**. Have a qualified professional review them, add a featured image,
switch off "Demonstration content", then publish. Delete any you don't want.

### 1.3 Contact form and WhatsApp

Nothing to set up. The contact form and the green WhatsApp button open WhatsApp
with the visitor's message ready to send to **+254 705 819 115**. Messages arrive
in that WhatsApp account, so make sure someone checks it. To use a different
number, set `NEXT_PUBLIC_WHATSAPP_NUMBER` (country code, no `+` or spaces, e.g.
`254705819115`) and `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY`, then redeploy.

### 1.4 The "Ask Ivorris" assistant

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

### 1.5 Add your intro video

The home page currently shows a short public explainer, "What is a care
navigator?", made by Integrated Care Northamptonshire (NHS) and credited on the
card. To show your own video instead, upload it to YouTube (it can be
"Unlisted"), then add these in Vercel and redeploy:

- `NEXT_PUBLIC_INTRO_VIDEO_URL` = the YouTube link
- `NEXT_PUBLIC_INTRO_VIDEO_TITLE` = the label shown on the card, e.g. "Ivorris Care in a minute"

---

## 2. Writing and publishing articles

Open **`https://YOUR-SITE/studio`** and sign in with your Sanity account.

### Create an article

1. Click **Articles**, then the **+** (Create) button.
2. **Content** tab:
   - **Title** — a clear question or statement a family might search for.
   - **URL slug** — click **Generate** to create it from the title; edit if you like.
     Each article must have a unique slug.
   - **Short excerpt** — one or two sentences shown on article cards.
   - **Featured image** — upload a photo, then fill in **Alternative text**
     (describe what's in the picture for people who can't see it).
   - **Article content** — write and format with headings, lists, links, quotes
     and images. For links to your own pages, use addresses starting with `/`,
     such as `/services/care-needs-assessment`.
   - **FAQ section** — optional questions and answers shown at the end.
3. **Details** tab: choose a **Category**, add **Tags**, check the
   **Publication date**, and optionally **Feature this article** (shown large at
   the top of the blog) or choose up to three **Related articles**.
4. **Review & sources** tab: list your **Sources**. Only set **Clinically
   reviewed by** once a qualified professional has actually reviewed the article.
5. **SEO & sharing** tab: optional custom search title and description. Leave
   them empty to use the title and excerpt.

Changes save automatically as a **draft**. Drafts are never visible on the
public website.

### Preview

Click **Preview** in the top bar of the Studio to see the article as it will
appear on the site, including unpublished changes. A yellow "Preview mode" bar
shows you are seeing drafts. Click **Exit preview** to return to the public view.

### Publish

Click **Publish** (bottom right). If something required is missing — title,
slug, excerpt, featured image with alt text, content, category or date — the
Studio lists what to fix. The article appears on the website straight away
(or within about a minute if the webhook isn't set up).

### Update a published article

Open it, make your changes, and set **Last updated** in the Details tab for
meaningful changes. Then click **Publish** again. Visitors keep seeing the
previous version until you publish.

### Unpublish or delete

Open the article and use the **⋯** menu next to Publish:

- **Unpublish** takes it off the website but keeps it as a draft.
- **Delete** removes it permanently, after you confirm.

### Authors and reviewers

Add people under **Authors & reviewers**. Professional credentials only appear
on the site when **Credentials verified** is switched on. Only switch it on for
qualifications you have confirmed.

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
| Photography | `src/content/photos.ts`, `public/photos/` | Free Pexels stock photos (credits listed in `photos.ts`); they are not Ivorris staff or clients. To swap one, add a photo to `public/photos/` and change its path and description in `photos.ts`. Authentic photos of your own team would build more trust. |
| Content removed from the previous site | — | Care packages (Basic → Platinum), antenatal, postnatal and reproductive health packages, payment options, testimonials and the AI chat assistant were removed (see the README). Tell us if any should return, with verified details. |
