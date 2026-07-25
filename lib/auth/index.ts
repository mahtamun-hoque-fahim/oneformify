import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { users } from '@/lib/db/schema'

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: 'pg' }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Formify <noreply@formify.app>',
          to: user.email,
          subject: 'Verify your email',
          html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
        })
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge:  60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: { type: 'string', defaultValue: 'user', input: false },
        plan: { type: 'string', defaultValue: 'free', input: false },
      },
    },
    // Bug fix B5: seed admin role from ADMIN_EMAILS env var on user creation
    databaseHooks: {
      user: {
        create: {
          async after(user) {
            const adminEmails = (process.env.ADMIN_EMAILS ?? '')
              .split(',')
              .map(e => e.trim().toLowerCase())
              .filter(Boolean)

            if (adminEmails.includes(user.email.toLowerCase())) {
              await getDb()
                .update(users)
                .set({ role: 'admin' })
                .where(eq(users.id, user.id))
            }
          },
        },
      },
    },
  })
}

type AuthInstance = ReturnType<typeof createAuth>
let _auth: AuthInstance | undefined

export function getAuth(): AuthInstance {
  if (!_auth) {
    _auth = createAuth()
  }
  return _auth
}
