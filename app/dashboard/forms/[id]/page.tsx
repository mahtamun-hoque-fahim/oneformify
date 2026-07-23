import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import FormBuilder from '@/components/builder/FormBuilder'

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))

  if (!form) redirect('/dashboard/forms')

  return <FormBuilder form={form} />
}
