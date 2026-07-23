import {
  Type, AlignLeft, CircleDot, CheckSquare, ChevronDown,
  Calendar, Upload, Minus, Star
} from 'lucide-react'
import type { FieldType } from '@/lib/types/form'

const icons: Record<FieldType, React.ComponentType<{ className?: string }>> = {
  short_text:      Type,
  long_text:       AlignLeft,
  multiple_choice: CircleDot,
  checkbox:        CheckSquare,
  dropdown:        ChevronDown,
  date:            Calendar,
  file_upload:     Upload,
  section_break:   Minus,
  rating:          Star,
}

export default function FieldIcon({ type, className }: { type: FieldType; className?: string }) {
  const Icon = icons[type]
  return <Icon className={className ?? 'w-4 h-4'} />
}
