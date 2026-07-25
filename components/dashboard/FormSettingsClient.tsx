'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { FormSettings } from '@/lib/types/form'
import { updateFormSettings, deleteForm } from '@/lib/actions/forms'

interface Props {
  formId: string
  initialTitle: string
  initialSlug: string
  initialSettings: FormSettings
  isPublished: boolean
}

function Toggle({ value, onChange, label, description }: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-text">{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full transition-colors duration-200 flex items-center shrink-0 mt-0.5 ${
          value ? 'bg-accent' : 'bg-surface-elevated border border-border'
        }`}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 mx-[3px] ${
          value ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}

export default function FormSettingsClient({
  formId, initialTitle, initialSlug, initialSettings, isPublished
}: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [slug, setSlug] = useState(initialSlug)
  const [settings, setSettings] = useState<FormSettings>(initialSettings)
  const [published, setPublished] = useState(isPublished)
  const [saving, startSave] = useTransition()
  const [deleting, startDelete] = useTransition()
  const [saveError, setSaveError] = useState('')
  const [saveOk, setSaveOk] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function patchSettings(patch: Partial<FormSettings>) {
    setSettings(prev => ({ ...prev, ...patch }))
    setSaveOk(false)
  }

  function handleSave() {
    setSaveError('')
    setSaveOk(false)
    startSave(async () => {
      const result = await updateFormSettings(formId, {
        title,
        slug,
        settings,
        isPublished: published,
      })
      if (result?.error) {
        setSaveError(result.error)
      } else {
        setSaveOk(true)
        router.refresh()
      }
    })
  }

  function handleDelete() {
    startDelete(async () => {
      await deleteForm(formId)
    })
  }

  const inputClass = "bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150 w-full"
  const sectionClass = "bg-surface border border-border rounded-xl p-6 flex flex-col gap-5"

  return (
    <div className="max-w-2xl flex flex-col gap-4">

      {/* General */}
      <div className={sectionClass}>
        <h2 className="font-syne text-base font-semibold text-text">General</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Form title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">URL slug</label>
          <div className="flex items-center gap-2">
            <span className="text-text-faint text-sm shrink-0">/f/</span>
            <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} className={inputClass} />
          </div>
          <p className="text-text-faint text-xs">Only lowercase letters, numbers, and hyphens</p>
        </div>
        <Toggle
          value={published}
          onChange={setPublished}
          label="Published"
          description="Make this form publicly accessible via its link"
        />
        <Toggle
          value={settings.showProgressBar}
          onChange={v => patchSettings({ showProgressBar: v })}
          label="Show progress bar"
          description="Respondents see how many fields they have filled"
        />
        <Toggle
          value={settings.allowMultipleSubmissions}
          onChange={v => patchSettings({ allowMultipleSubmissions: v })}
          label="Allow multiple submissions"
          description="The same person can submit more than once"
        />
      </div>

      {/* Quiz / anti-cheat */}
      <div className={sectionClass}>
        <h2 className="font-syne text-base font-semibold text-text">Quiz mode</h2>
        <Toggle
          value={settings.quizMode}
          onChange={v => patchSettings({ quizMode: v })}
          label="Quiz mode"
          description="Activates the quiz experience framing for respondents"
        />
        <Toggle
          value={settings.focusMonitoringEnabled}
          onChange={v => patchSettings({ focusMonitoringEnabled: v })}
          label="Focus monitoring"
          description="Detect and log tab switches and window blur events"
        />
        {settings.focusMonitoringEnabled && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">Auto-submit threshold</label>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(n => (
                <button
                  key={n}
                  onClick={() => patchSettings({ tabSwitchThreshold: n })}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    settings.tabSwitchThreshold === n
                      ? 'bg-accent text-white'
                      : 'bg-surface-elevated border border-border text-text-muted hover:text-text'
                  }`}
                >
                  {n} violation{n !== 1 ? 's' : ''}
                </button>
              ))}
            </div>
            <p className="text-text-faint text-xs">Auto-submits the quiz after this many focus violations</p>
          </div>
        )}
      </div>

      {/* Deadline */}
      <div className={sectionClass}>
        <h2 className="font-syne text-base font-semibold text-text">Deadline</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Close form after</label>
          <input
            type="datetime-local"
            value={settings.deadline ? new Date(settings.deadline).toISOString().slice(0, 16) : ''}
            onChange={e => patchSettings({ deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            className={inputClass}
          />
          <p className="text-text-faint text-xs">Leave blank for no deadline</p>
        </div>
      </div>

      {/* Thank you */}
      <div className={sectionClass}>
        <h2 className="font-syne text-base font-semibold text-text">After submission</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Thank you message</label>
          <input
            value={settings.thankYouMessage}
            onChange={e => patchSettings({ thankYouMessage: e.target.value })}
            placeholder="Thank you for your response!"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Redirect URL <span className="text-text-faint">(optional)</span></label>
          <input
            value={settings.redirectUrl ?? ''}
            onChange={e => patchSettings({ redirectUrl: e.target.value || undefined })}
            placeholder="https://yoursite.com/thank-you"
            className={inputClass}
          />
          <p className="text-text-faint text-xs">Redirect respondents here after submission instead of the default thank you page</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 active:scale-[0.97] active:scale-[0.97] active:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
        {saveOk && <span className="text-success text-sm">Saved</span>}
        {saveError && <span className="text-danger text-sm">{saveError}</span>}
      </div>

      {/* Danger zone */}
      <div className="bg-surface border border-danger/20 rounded-xl p-6 mt-2">
        <h2 className="font-syne text-base font-semibold text-danger mb-1">Danger zone</h2>
        <p className="text-text-muted text-sm mb-4">Deleting this form also removes all its responses. This cannot be undone.</p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-danger/10 border border-danger/30 text-danger px-4 py-2 rounded-md text-sm hover:bg-danger/20 transition-colors duration-150"
          >
            Delete this form
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-danger text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-danger/90 transition-colors duration-150 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Confirm delete'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-text-muted text-sm hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
