# Abolfazl Abbaspour — Portfolio

Personal portfolio of **Abolfazl Abbaspour**, Front-End Developer (React / Next.js).

A dark, futuristic single-page site with a WebGL particle field that morphs between shapes as you scroll,
a pinned "frame by frame" process sequence, smooth scrolling and kinetic typography.

## Stack

- **Next.js 16** (App Router, static output) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **three.js** — 13k-particle shader field (sphere → helix → galaxy → wireframe → `</>` → portal → globe)
- **GSAP + ScrollTrigger** — pinned, scroll-scrubbed sequences and reveals
- **Lenis** — smooth scrolling

## Editing content

All copy lives in [`src/lib/content.ts`](src/lib/content.ts): profile, services, process steps,
projects, experience, skills and contact-form options. The résumé is served from `public/`.

## Scripts

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Contact form & inbox

The contact form posts to `/api/contact`, which stores each inquiry as a private JSON file in
**Vercel Blob** (store `portfolio-inbox`) and sends a best-effort email notification via FormSubmit.

Read, reply to and delete messages at **`/inbox`** — protected by the `INBOX_PASSWORD`
environment variable (change it in Vercel → Project → Settings → Environment Variables, then redeploy).

## Deploying

Deployed on Vercel. `NEXT_PUBLIC_SITE_URL` can be set to a custom domain; otherwise the
production Vercel URL is used for canonical/OG metadata.
