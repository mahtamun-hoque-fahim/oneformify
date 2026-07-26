import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Formify — The Google Forms Alternative That Looks Good',
    template: '%s | Formify',
  },
  description:
    'Build beautiful dark-mode forms, protect quizzes with tab-switch detection, and see real response analytics. Free. No credit card.',
  keywords: [
    'google forms alternative',
    'form builder',
    'quiz maker',
    'anti cheat quiz',
    'form analytics',
    'dark mode form builder',
    'conditional logic forms',
  ],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
  creator: 'Mahtamun Hoque Fahim',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Formify',
    title: 'Formify — Beautiful Forms. Real Quiz Integrity.',
    description:
      'Replace Google Forms with something that actually looks premium. Tab-switch detection, response charts, conditional logic. Free.',
    images: [
      {
        url: '/images/hero-01.png',
        width: 1366,
        height: 768,
        alt: 'Formify form builder — a quiz form showing progress bar and multiple choice fields',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formify — Beautiful Forms. Real Quiz Integrity.',
    description:
      'Replace Google Forms with something that actually looks premium. Tab-switch detection, response charts, conditional logic. Free.',
    images: ['/images/hero-01.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
