# Changelog

All notable changes to Formify are documented here.
Format: [semver](https://semver.org) — Added / Fixed / Changed / Security.

---

## [v0.1.0] — 2026-07-26

First full release. Complete Citadel pipeline rebuild from scratch.

### Added

- **Form builder** — 9 field types (short text, long text, multiple choice, checkbox, dropdown, date, rating, section break, file upload placeholder), drag-reorder, conditional logic (show/hide/skip\_to), real-time preview panel, field editor right panel (208d0b5, 2af5524)
- **Quiz mode** — tab-switch detection via Page Visibility API + blur events, three-strike model (warn → flag → auto-submit), threshold configurable per form (1–3 violations), focus monitoring toggle in builder top bar (208d0b5, 1eb7739)
- **Form fill page** (`/f/[slug]`) — progress bar, conditional field rendering, quiz mode warning banner, violation tracking, all 9 field types rendered (1eb7739)
- **Response analytics** — response table, per-field distribution bar charts, violation log per respondent, expandable rows (fbed010)
- **Multi-format export** — CSV, Excel (.xlsx via exceljs), PDF (print-to-PDF HTML) (fbed010, eb868b1)
- **Templates** — 4 starter templates (contact, quiz, feedback, event registration), one-click clone into builder (2af5524)
- **Form settings** — quiz mode toggle, focus monitoring threshold, deadline, password protection, custom thank-you message, redirect URL, slug editor, publish toggle, soft-delete with confirmation (fbed010)
- **Dashboard** — overview with live stats, forms list with hover actions, analytics aggregate view, account settings (fbed010)
- **Admin panel** — platform stats, user table, all-forms table (view-only) (fbed010)
- **Auth** — Better Auth email/password, email verification via Resend, password reset flow, ADMIN\_EMAILS env var seeds admin role on signup (17bc1d3, 6eb3267)
- **Form duplication** — duplicate any form in one click from the forms list (208d0b5)
- **Submitted page CTA** — conversion prompt on every thank-you page (208d0b5)
- **Brand assets** — Formify logo, icon, favicon wired throughout (730ac5a)
- **Landing page** — hero, 6-feature grid, how-it-works, bottom CTA, field type strip, 5 Gemini-generated image assets (730ac5a, 3b8acf6)
- **SEO layer** — sitemap.ts, robots.ts, JSON-LD (Organization + WebSite + SoftwareApplication + WebPage per form), OG metadata, Twitter cards, per-form generateMetadata, noindex on private routes (93df06f)
- **30-day content roadmap** — 14 pieces with full briefs, keyword targets, schemas, internal linking map (43e9554)
- **Security headers** — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS (eb868b1)
- **Rate limiting** — Upstash Redis distributed rate limiter on form submissions (30 req/min per slug), Better Auth built-in rate limiting on auth routes (10 req/60s per IP) (eb868b1)

### Fixed

- ADMIN\_EMAILS env var never seeded admin role on signup — `databaseHooks.user.create.after` added (6eb3267)
- Redirect URL form setting had no effect on submitted page (6eb3267)
- Template clone created forms with empty fields — FormBuilder reads sessionStorage on mount (6eb3267)
- Star glyph (☆) replaced with lucide-react Star component throughout (6eb3267)
- `transition-all` anti-pattern on progress bars and field cards — scoped to specific properties (019f737)
- Input focus states missing violet ring glow — added `focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)]` across all inputs (019f737)

### Security

- **xlsx removed** (Prototype Pollution + ReDoS, no fix available) → replaced with exceljs@4.4.0 (eb868b1)
- **Next.js upgraded** to 16.2.11 — patches sharp libvips CVEs (CVE-2026-33327/8, CVE-2026-35590/1) (eb868b1)
- **Payload size validation** on form submission — rejects if >200 answer keys or >50KB (eb868b1)
- **proxy.ts** now guards `/admin/*` at the edge layer (defense-in-depth, layout also checks role) (eb868b1)
- **File upload** field shows "coming soon" placeholder — no broken upload UX until Cloudinary is wired (eb868b1)

### Changed

- Free tier expanded: 3 forms / 100 responses → **10 forms / 500 responses** (208d0b5)
- Landing page copy humanized — AI tells removed, voice added (plain, direct, honest) (0ff32bd)

---

*Formify is pre-public. Cloudflare dual-deploy, admin mutations, and Lemon Squeezy payments are deferred to post-launch milestones.*
