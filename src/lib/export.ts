import type { AppData } from './types'
import { fmtDate, fmtHours } from './utils'

export function toMarkdown(d: AppData): string {
  const out: string[] = []
  const area = (id?: string): string => d.areas.find((a) => a.id === id)?.name ?? ''
  const topic = (id?: string): string => d.topics.find((t) => t.id === id)?.title ?? ''
  const mark = { todo: '[ ]', learning: '[~]', done: '[x]' } as const

  out.push(`# My cybersecurity journey`, '', `_Exported from kryfsec on ${fmtDate(new Date().toISOString())}_`, '')
  out.push(`- Journal entries: ${d.logs.length} (${fmtHours(d.logs.reduce((a, l) => a + l.minutes, 0))} total)`)
  out.push(`- Labs solved: ${d.labs.filter((l) => l.status === 'done').length} of ${d.labs.length}`)
  out.push(`- Topics done: ${d.topics.filter((t) => t.status === 'done').length} of ${d.topics.length}`, '')

  out.push('## Roadmap', '')
  for (const a of d.areas) {
    out.push(`### ${a.name}`, '')
    if (a.description) out.push(a.description, '')
    for (const t of d.topics.filter((t) => t.areaId === a.id)) {
      out.push(`- ${mark[t.status]} ${t.title}`)
      if (t.notes.trim()) out.push(...t.notes.trim().split('\n').map((l) => `  > ${l}`))
    }
    out.push('')
  }

  out.push('## Goals', '')
  for (const g of d.goals) out.push(`- ${g.done ? '[x]' : '[ ]'} ${g.title}${g.deadline ? ` (due ${fmtDate(g.deadline)})` : ''}`)
  out.push('')

  out.push('## Certifications', '')
  for (const c of d.certs) out.push(`- **${c.name}** (${c.provider}) — ${c.status}, ${c.progress}%${c.targetDate ? `, target ${fmtDate(c.targetDate)}` : ''}`)
  out.push('')

  out.push('## Journal', '')
  for (const l of [...d.logs].sort((a, b) => (a.date < b.date ? 1 : -1))) {
    out.push(`### ${fmtDate(l.date, 'EEE d MMM yyyy')} — ${l.title || 'Untitled'}`, '')
    const meta = [`${l.minutes} min`, topic(l.topicId) && `topic: ${topic(l.topicId)}`, l.tags.length && l.tags.map((t) => `#${t}`).join(' ')].filter(Boolean)
    out.push(`_${meta.join(' · ')}_`, '', l.body.trim(), '')
  }

  out.push('## Labs & CTFs', '')
  for (const l of d.labs) {
    out.push(`### ${l.name} (${l.platform}, ${l.difficulty})`, '')
    out.push(`_Status: ${l.status}${l.date ? ` · ${fmtDate(l.date)}` : ''}${area(l.areaId) ? ` · ${area(l.areaId)}` : ''}${l.url ? ` · ${l.url}` : ''}_`, '')
    if (l.writeup.trim()) out.push(l.writeup.trim(), '')
  }

  out.push('## Resources', '')
  for (const r of d.resources) out.push(`- [${r.title}](${r.url}) — ${r.kind}, ${r.status}${r.notes ? `. ${r.notes}` : ''}`)
  out.push('')
  return out.join('\n')
}
