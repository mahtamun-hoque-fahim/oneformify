import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { eq, isNull, and } from 'drizzle-orm'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static indexable routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // Dynamic: published form fill pages (/f/[slug])
  let formRoutes: MetadataRoute.Sitemap = []
  try {
    const db = getDb()
    const publishedForms = await db
      .select({ slug: forms.slug, updatedAt: forms.updatedAt })
      .from(forms)
      .where(and(eq(forms.isPublished, true), isNull(forms.deletedAt)))

    formRoutes = publishedForms.map(f => ({
      url: `${BASE_URL}/f/${f.slug}`,
      lastModified: f.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // DB unreachable at build time — return static routes only
  }

  return [...staticRoutes, ...formRoutes]
}
