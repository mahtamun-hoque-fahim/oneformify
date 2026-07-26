import Link from 'next/link'
import Image from 'next/image'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formify — The Google Forms Alternative That Looks Good',
  description:
    'Build beautiful dark-mode forms, protect quizzes with tab-switch detection, and see real response analytics. Free. No credit card.',
  alternates: {
    canonical: '/',
  },
}

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Anti-cheat quiz protection',
    desc: 'Focus monitoring detects tab switches and window blur in real time. Three-strike model — warn, flag, auto-submit. No browser extensions needed.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Real response analytics',
    desc: 'Distribution charts per field. Violation logs. Export to CSV, Excel, or PDF. Everything you actually need, nothing you don\'t.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Landing-page quality forms',
    desc: 'Conditional logic, progress bars, custom thank-you pages. Forms that look like a product, not a school assignment.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: '9 field types, drag to build',
    desc: 'Short text, long text, multiple choice, checkboxes, dropdown, date, file upload, rating, section breaks. Built in minutes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Live progress bar',
    desc: 'Respondents see how far they\'ve come. Reduces drop-offs on longer forms. Toggleable per form.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Conditional logic',
    desc: 'If Q3 equals X, skip to Q7. Show or hide fields based on previous answers. Built into every form, not a premium add-on.',
  },
]

const FIELD_TYPES = ['Short text', 'Multiple choice', 'Rating', 'Date', 'File upload', 'Dropdown', 'Checkboxes', 'Long answer', 'Section break']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'}/#organization`,
                "name": "Formify",
                "url": process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app',
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'}/logo.svg`
                }
              },
              {
                "@type": "WebSite",
                "@id": `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'}/#website`,
                "url": process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app',
                "name": "Formify",
                "publisher": { "@id": `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'}/#organization` }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Formify",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                "description": "Premium dark-UI form builder with anti-cheat quiz protection, conditional logic, and real response analytics.",
                "url": process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'
              }
            ]
          })
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Image src="/logo.svg" alt="Formify" width={100} height={21} priority />
          <div className="flex items-center gap-3 animate-fade-up stagger-4">
            <Link href="/login" className="text-text-muted hover:text-text text-sm transition-colors duration-150 px-3 py-1.5">
              Sign in
            </Link>
            <Link href="/signup" className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-1.5 rounded-md transition-colors duration-150">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent opacity-[0.07] blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent-faint border border-accent/20 rounded-full px-3 py-1 mb-8 animate-fade-up">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-accent text-xs font-medium">Google Forms, but actually good</span>
            </div>

            {/* Headline */}
            <h1 className="font-syne text-5xl font-bold text-text leading-[1.1] mb-6 lg:text-6xl animate-fade-up stagger-1">
              Forms that feel like
              <br />
              <span className="text-accent">a real product.</span>
            </h1>

            {/* Sub */}
            <p className="text-text-muted text-xl mb-8 max-w-xl leading-relaxed animate-fade-up stagger-2">
              Build beautiful forms, protect quiz integrity with tab-switch detection,
              and see your responses in real analytics. Free.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-10 animate-fade-up stagger-3">
              {['Anti-cheat quizzes', 'Response charts', 'Conditional logic', 'CSV / Excel / PDF export'].map(f => (
                <span key={f} className="text-xs font-mono text-text-faint border border-border px-3 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/signup"
                className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors duration-150"
              >
                Start building for free
              </Link>
              <Link
                href="/login"
                className="text-text-muted hover:text-text text-sm transition-colors duration-150 px-4 py-3"
              >
                Sign in →
              </Link>
            </div>
          </div>

          {/* Hero visual — form preview mock */}
          <Image
            src="/images/hero-01.png"
            alt="Formify form builder in action — a quiz form at 3D angle showing progress bar and multiple choice fields"
            width={1366}
            height={768}
            className="w-full rounded-2xl shadow-lg"
            priority
          />
          <div className="mt-16 relative">
            {/* Mock form preview */}
            <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl ml-auto shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-syne text-base font-semibold text-text">Team feedback survey</h3>
                  <p className="text-text-faint text-xs font-mono mt-0.5">/f/team-feedback-2024</p>
                </div>
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-sm font-medium">Published</span>
              </div>
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-muted">3 of 5</span>
                  <span className="text-xs font-mono text-text-muted">60%</span>
                </div>
                <div className="w-full bg-surface-elevated rounded-full h-1">
                  <div className="bg-accent h-1 rounded-full w-[60%]" />
                </div>
              </div>
              {/* Mock field */}
              <div className="bg-bg border border-border rounded-xl p-4 mb-3">
                <p className="text-sm font-medium text-text mb-3">How would you rate your experience? <span className="text-danger">*</span></p>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className={`w-8 h-8 rounded-md border flex items-center justify-center text-xs font-mono transition-colors ${n <= 4 ? 'border-accent bg-accent-faint text-accent' : 'border-border text-text-faint'}`}>
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-bg border border-border rounded-xl p-4">
                <p className="text-sm font-medium text-text mb-2">Any comments?</p>
                <div className="bg-surface border border-border rounded-md px-3 py-2 text-text-faint text-xs h-10 flex items-center">
                  Type your answer here...
                </div>
              </div>
            </div>
            {/* Quiz mode badge floating */}
            <div className="absolute -left-4 top-8 bg-surface-elevated border border-warning/30 rounded-lg px-3 py-2 shadow-md hidden lg:flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-warning text-xs font-medium">Focus monitoring active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Field types strip */}
      <section className="border-y border-border py-5 overflow-hidden">
        <div className="flex gap-3 px-6 flex-wrap max-w-6xl mx-auto">
          <span className="text-text-faint text-xs font-mono shrink-0 py-1 mr-2">9 field types —</span>
          {FIELD_TYPES.map(f => (
            <span key={f} className="text-xs text-text-muted border border-border rounded-full px-3 py-1">
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-mono text-accent mb-3 uppercase tracking-widest">What you get</p>
            <h2 className="font-syne text-3xl font-bold text-text max-w-lg">
              Everything Google Forms should have built in.
            </h2>
          </div>
          <Image
            src="/images/feat-02.png"
            alt="Three Formify product screens side by side: the form builder canvas, a live form fill page with quiz mode, and the response analytics dashboard"
            width={1500}
            height={500}
            className="w-full rounded-xl mb-10 shadow-md"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg transition-[transform,border-color,box-shadow] duration-200 ease-out group">
                <div className="w-10 h-10 rounded-lg bg-accent-faint border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
                  {icon}
                </div>
                <h3 className="font-syne text-base font-semibold text-text mb-2">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-mono text-accent mb-3 uppercase tracking-widest">How it works</p>
            <h2 className="font-syne text-3xl font-bold text-text">Build. Share. Analyse.</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Build your form', desc: 'Drag fields onto the canvas, set conditional logic, configure quiz mode and anti-cheat settings.' },
              { step: '02', title: 'Share a link', desc: 'Publish your form and share the /f/your-slug link. Respondents get a premium fill experience on any device.' },
              { step: '03', title: 'See your data', desc: 'View response tables, field-level charts, and violation logs. Export in one click.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative pl-6 border-l border-border">
                <p className="font-mono text-xs text-accent mb-3">{step}</p>
                <h3 className="font-syne text-lg font-semibold text-text mb-2">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center relative">
          <Image
            src="/images/cta-03.png"
            alt=""
            fill
            className="object-cover rounded-xl opacity-60 -z-10"
          />
          <Image src="/icon.svg" alt="" width={48} height={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="font-syne text-4xl font-bold text-text mb-4">
            Start building today.
          </h2>
          <p className="text-text-muted text-lg mb-8">
            Free. No credit card. No expiry. Upgrade when we launch publicly.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3.5 rounded-md text-sm transition-colors duration-150"
          >
            Create your first form →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Image src="/logo.svg" alt="Formify" width={80} height={17} />
          <p className="text-text-faint text-xs">Built by Mahtamun</p>
        </div>
      </footer>
    </div>
  )
}
