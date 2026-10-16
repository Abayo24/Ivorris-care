# Ivorris Care — search & AI visibility plan

How the website is set up to be found on Google and quoted by AI assistants
(ChatGPT, Claude, Perplexity, Google AI Overviews), and what to do next.

> No one can guarantee a top position. Rankings come from relevance (the site
> clearly answers what people search), trust (a real, consistent business) and
> time. The website now covers relevance; the steps in section 4 build trust.

---

## 1. What people in Kenya actually search

Taken from Google's own autocomplete suggestions for Kenya (October 2026). In
Kenya, **"home based care"** and **"home care services"** are used far more
than "home nursing" or "care navigation", so the site leads with those terms.

| Searches people make | Page that answers it |
| --- | --- |
| home based care nairobi · home care services nairobi · home care in nairobi · home care nursing in nairobi | Home page, `/services` |
| home nurse nairobi · home nursing services near me · how to get a home nurse | `/services/home-nursing`, home FAQ |
| how much does it cost to have a nurse at home · how much is a private nurse | Home FAQ ("How much does a home nurse cost in Nairobi?") |
| elderly care nairobi · how to get care for elderly at home · nurse to take care of elderly at home | `/services/care-needs-assessment`, home FAQ |
| post operative care at home · post surgery care at home · home care after hospital discharge | `/services/post-discharge-nursing-assessment` |
| how to take care of elderly parents at home · how to take care of bedridden elderly at home | `/services/family-care-guidance`, blog |
| caregiver nairobi · physiotherapy at home | `/connect-and-coordinate` |
| wheelchair for hire nairobi · hospital bed for hire · oxygen concentrator hire | `/equipment` |

Many "caregiver" and "home based care" searches are **job searches**
("caregiver jobs nairobi"). The site doesn't target those — they bring the
wrong visitors.

## 2. What's been done on the website

**Search engines (SEO)**
- Every page has a unique title and description written around the terms
  above, with Nairobi, e.g. "Home-Based Care & Home Nursing in Nairobi",
  "Hospital Bed & Wheelchair Hire in Nairobi".
- Clear headings, fast pages (Lighthouse 91–100), mobile-friendly, secure,
  sitemap at `/sitemap.xml`, robots rules at `/robots.txt`, canonical links on
  `https://ivorriscare.vercel.app`.

**Answer engines (AEO)**
- The home page answers the exact questions people ask ("How do I get a home
  nurse in Nairobi?", "How much does a home nurse cost?", "Can I hire a
  hospital bed or wheelchair in Nairobi?"), marked up as an FAQ so Google can
  show the answers directly.
- Each service page opens with a plain definition ("What is a care needs
  assessment?") followed by detail — the format answer engines quote.

**AI assistants (GEO)**
- `/llms.txt` — a plain summary of Ivorris (services, equipment, contact,
  FAQs) for AI assistants, generated from the website's own content.
- Structured data tells machines exactly who Ivorris is: organisation,
  service area (Nairobi, Kenya), topics, each service, equipment for hire,
  FAQs and breadcrumbs.
- AI search crawlers (ChatGPT, Claude, Perplexity, Google, Apple, Bing) are
  explicitly allowed.
- Consistent facts everywhere: same name, phone, email and city on every page.

## 3. Blog calendar (publish one a week in the Studio)

Each title answers a real search. Keep them practical and general — no
medical advice — and end each with a link to the matching service and
"Talk to Ivorris". Have health content reviewed before publishing.

1. How to Take Care of a Bedridden Elderly Person at Home
2. How Much Does a Home Nurse Cost in Kenya? What Affects the Price
3. How to Get a Home Nurse in Nairobi: A Step-by-Step Guide
4. Home Care After Hospital Discharge: A Checklist for Families
5. Post-Operative Care at Home: What Families Should Prepare
6. How to Care for Elderly Parents at Home Without Burning Out
7. Home-Based Care in Kenya: What It Is and How to Arrange It
8. Hiring a Hospital Bed or Wheelchair in Nairobi: What to Ask
9. Signs Your Elderly Parent Needs More Support at Home
10. Caregiver or Nurse? Understanding the Difference for Home Care

Three sample drafts already exist in `seed/starter-content.ndjson`.

## 4. Steps only you can take (these matter most)

1. **Google Business Profile** — the biggest single step for "near me" and
   Nairobi searches and the Google Maps panel. Create it at
   business.google.com as a service-area business (Nairobi), with the same
   name, phone and website address, opening hours, photos and services.
   Ask happy clients for honest Google reviews.
2. **Google Search Console** — search.google.com/search-console → add
   `https://ivorriscare.vercel.app` → choose "HTML tag" → copy the code into
   Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → redeploy → Verify →
   submit `https://ivorriscare.vercel.app/sitemap.xml`.
3. **Bing Webmaster Tools** — same steps, using
   `NEXT_PUBLIC_BING_SITE_VERIFICATION`. Bing also feeds ChatGPT search and
   Copilot.
4. **Your own domain** (e.g. ivorriscare.co.ke) — looks more trustworthy and
   ranks better locally than a vercel.app address. Add it in Vercel → Domains,
   then set `NEXT_PUBLIC_SITE_URL` to it.
5. **Listings** — add Ivorris, with identical name, phone and website, to
   Kenyan directories and social profiles (Facebook, Instagram, LinkedIn).
   Send the profile links and they'll be added to the site's structured data.
6. **Publish** the blog calendar above, steadily.
7. **Review monthly** in Search Console: which searches show Ivorris, and
   which pages need clearer answers.
