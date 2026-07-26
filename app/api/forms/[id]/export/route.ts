import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms, responses } from '@/lib/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import type { FormField } from '@/lib/types/form'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))
  if (!form) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const allResponses = await db.select().from(responses)
    .where(and(eq(responses.formId, id), isNull(responses.deletedAt)))

  const fields = (form.fields as FormField[]).filter(f => f.type !== 'section_break')
  const format = request.nextUrl.searchParams.get('format') ?? 'csv'

  // Build rows
  const headers_row = ['#', 'Submitted at', ...fields.map(f => f.label || f.id), 'Violations']
  const rows = allResponses.map((r, i) => {
    const answers = r.answers as Record<string, unknown>
    const viols = (r.violations as unknown[])?.length ?? 0
    return [
      i + 1,
      new Date(r.submittedAt).toISOString(),
      ...fields.map(f => {
        const v = answers[f.id]
        return Array.isArray(v) ? v.join(', ') : (v ?? '')
      }),
      viols,
    ]
  })

  if (format === 'csv') {
    const escape = (v: unknown) => {
      const s = String(v ?? '')
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s
    }
    const csv = [headers_row, ...rows].map(r => r.map(escape).join(',')).join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${form.slug}-responses.csv"`,
      },
    })
  }

  if (format === 'xlsx') {
    const ExcelJS = await import('exceljs')
    const wb = new ExcelJS.default.Workbook()
    const ws = wb.addWorksheet('Responses')
    ws.addRow(headers_row)
    for (const row of rows) ws.addRow(row)
    // Style header row
    ws.getRow(1).font = { bold: true }
    ws.getRow(1).fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: 'FF1A1A28' },
    }
    const buf = await wb.xlsx.writeBuffer()
    return new NextResponse(new Uint8Array(buf as ArrayBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${form.slug}-responses.xlsx"`,
      },
    })
  }

  if (format === 'pdf') {
    // Simple HTML-based PDF via browser print
    // Returns an HTML page styled for print — user prints to PDF
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${form.title} — Responses</title>
<style>
  body { font-family: system-ui, sans-serif; font-size: 12px; color: #111; margin: 24px; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  p { color: #555; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f3f4f6; text-align: left; padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 11px; }
  td { padding: 6px 8px; border: 1px solid #e5e7eb; vertical-align: top; font-size: 11px; }
  tr:nth-child(even) td { background: #f9fafb; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<h1>${form.title}</h1>
<p>${allResponses.length} response${allResponses.length !== 1 ? 's' : ''} · Exported ${new Date().toLocaleDateString()}</p>
<table>
<thead><tr>${headers_row.map(h => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table>
<script>window.onload = () => window.print()</script>
</body>
</html>`
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  return NextResponse.json({ error: 'Unknown format' }, { status: 400 })
}
