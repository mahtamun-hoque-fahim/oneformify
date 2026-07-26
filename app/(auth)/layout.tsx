import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Minimal nav */}
      <nav className="px-6 py-4 border-b border-border">
        <Link href="/">
          <Image src="/logo.svg" alt="Formify" width={90} height={19} priority />
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
