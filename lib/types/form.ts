// Field types supported by the builder
export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'checkbox'
  | 'dropdown'
  | 'date'
  | 'file_upload'
  | 'section_break'
  | 'rating'

// Conditional logic rule
export interface ConditionalRule {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'is_empty' | 'is_not_empty'
  value?: string
  action: 'show' | 'hide' | 'skip_to'
  targetFieldId?: string // for skip_to
}

// A single form field
export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]         // for multiple_choice, checkbox, dropdown
  maxRating?: number         // for rating (default 5)
  acceptedFileTypes?: string // for file_upload e.g. "image/*,application/pdf"
  conditional?: ConditionalRule
  description?: string       // sub-label shown below the field label
}

// Form settings (stored in forms.settings jsonb)
export interface FormSettings {
  quizMode: boolean
  tabSwitchThreshold: 1 | 2 | 3   // violations before auto-submit
  focusMonitoringEnabled: boolean
  deadline?: string                // ISO date string
  passwordProtected: boolean
  password?: string
  thankYouMessage: string
  redirectUrl?: string
  showProgressBar: boolean
  allowMultipleSubmissions: boolean
}

export const DEFAULT_SETTINGS: FormSettings = {
  quizMode: false,
  tabSwitchThreshold: 3,
  focusMonitoringEnabled: false,
  deadline: undefined,
  passwordProtected: false,
  password: undefined,
  thankYouMessage: 'Thank you for your response!',
  redirectUrl: undefined,
  showProgressBar: true,
  allowMultipleSubmissions: true,
}

export const FIELD_LABELS: Record<FieldType, string> = {
  short_text:      'Short text',
  long_text:       'Long answer',
  multiple_choice: 'Multiple choice',
  checkbox:        'Checkboxes',
  dropdown:        'Dropdown',
  date:            'Date',
  file_upload:     'File upload',
  section_break:   'Section break',
  rating:          'Rating',
}

export const FIELD_ICONS: Record<FieldType, string> = {
  short_text:      'Type',
  long_text:       'AlignLeft',
  multiple_choice: 'CircleDot',
  checkbox:        'CheckSquare',
  dropdown:        'ChevronDown',
  date:            'Calendar',
  file_upload:     'Upload',
  section_break:   'Minus',
  rating:          'Star',
}
