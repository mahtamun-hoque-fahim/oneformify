import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { templates } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import TemplateCloneButton from '@/components/dashboard/TemplateCloneButton'

const STARTER_TEMPLATES = [
  {
    id: 'contact',
    title: 'Contact form',
    description: 'Name, email, subject and message. The classic.',
    category: 'General',
    fields: [
      { id: 'f1', type: 'short_text', label: 'Your name', required: true },
      { id: 'f2', type: 'short_text', label: 'Email address', required: true },
      { id: 'f3', type: 'short_text', label: 'Subject', required: false },
      { id: 'f4', type: 'long_text', label: 'Message', required: true },
    ],
  },
  {
    id: 'quiz',
    title: 'Quiz template',
    description: 'Multiple choice questions with focus monitoring enabled.',
    category: 'Quiz',
    fields: [
      { id: 'f1', type: 'short_text', label: 'Full name', required: true },
      { id: 'f2', type: 'multiple_choice', label: 'Question 1', required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'] },
      { id: 'f3', type: 'multiple_choice', label: 'Question 2', required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'] },
      { id: 'f4', type: 'multiple_choice', label: 'Question 3', required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'] },
    ],
    settings: { quizMode: true, focusMonitoringEnabled: true, tabSwitchThreshold: 3 },
  },
  {
    id: 'feedback',
    title: 'Customer feedback',
    description: 'Rating, satisfaction score and open feedback.',
    category: 'Survey',
    fields: [
      { id: 'f1', type: 'rating', label: 'How would you rate your experience?', required: true, maxRating: 5 },
      { id: 'f2', type: 'multiple_choice', label: 'How likely are you to recommend us?', required: true, options: ['Very likely', 'Likely', 'Neutral', 'Unlikely', 'Never'] },
      { id: 'f3', type: 'long_text', label: 'Any comments or suggestions?', required: false },
    ],
  },
  {
    id: 'registration',
    title: 'Event registration',
    description: 'Collect attendee info with dietary and session preferences.',
    category: 'Events',
    fields: [
      { id: 'f1', type: 'short_text', label: 'Full name', required: true },
      { id: 'f2', type: 'short_text', label: 'Email', required: true },
      { id: 'f3', type: 'dropdown', label: 'Session preference', required: true, options: ['Morning session', 'Afternoon session', 'Both'] },
      { id: 'f4', type: 'checkbox', label: 'Dietary requirements', required: false, options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal'] },
      { id: 'f5', type: 'long_text', label: 'Anything else we should know?', required: false },
    ],
  },
]

export default async function TemplatesPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const categories = [...new Set(STARTER_TEMPLATES.map(t => t.category))]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold text-text mb-1">Templates</h1>
        <p className="text-text-muted text-sm">Start with a template and customise it in the builder</p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-8">
          <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">{cat}</h2>
          <div className="grid grid-cols-2 gap-3">
            {STARTER_TEMPLATES.filter(t => t.category === cat).map(tmpl => (
              <div key={tmpl.id} className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-md transition-[transform,border-color,box-shadow] duration-200 ease-out group">
                <h3 className="font-syne text-base font-semibold text-text mb-1 group-hover:text-accent transition-colors duration-150">{tmpl.title}</h3>
                <p className="text-text-muted text-sm mb-4">{tmpl.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-text-faint text-xs">{tmpl.fields.length} fields</span>
                  <TemplateCloneButton template={tmpl} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
