import { useMemo, useState } from 'react'
import { IconCalendar, IconClock, IconNotebook, IconPlus, IconRoute, IconTrash } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { useFocus, useStore } from '@/lib/store'
import type { LogEntry } from '@/lib/types'
import { cn, fmtHours, nowIso, today, uid } from '@/lib/utils'
import { Button, EmptyState, Input, SearchInput, Select } from '@/components/ui'
import { NoteEditor } from '@/components/editor'
import { TagInput } from '@/components/tag-input'
import { confirm } from '@/components/dialog'

const PLACEHOLDER = `What did you learn today?
Which commands or tools did you use?
What will you try next?

Tip: use the buttons above for headings, code blocks and checklists.`

export default function Journal(): React.JSX.Element {
  const logs = useStore((s) => s.logs)
  const topics = useStore((s) => s.topics)
  const areas = useStore((s) => s.areas)
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const [q, setQ] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const sorted = useMemo(() => [...logs].sort((a, b) => (a.date === b.date ? (a.createdAt < b.createdAt ? 1 : -1) : a.date < b.date ? 1 : -1)), [logs])
  const [sel, setSel] = useState<string | undefined>(sorted[0]?.id)

  const create = (): void => {
    const e: LogEntry = { id: uid(), date: today(), title: '', body: '', tags: [], minutes: 30, createdAt: nowIso() }
    upsert('logs', e)
    setSel(e.id)
  }

  useFocus('journal', (id) => (id === 'new' ? create() : setSel(id)))

  const allTags = useMemo(() => {
    const m = new Map<string, number>()
    logs.forEach((l) => l.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)))
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
  }, [logs])

  const filtered = sorted.filter((l) => {
    if (tag && !l.tags.includes(tag)) return false
    if (!q.trim()) return true
    const s = q.toLowerCase()
    return l.title.toLowerCase().includes(s) || l.body.toLowerCase().includes(s) || l.tags.some((t) => t.includes(s))
  })

  const groups = useMemo(() => {
    const g: { month: string; items: LogEntry[] }[] = []
    for (const l of filtered) {
      const m = format(parseISO(l.date), 'MMMM yyyy')
      const last = g[g.length - 1]
      if (last?.month === m) last.items.push(l)
      else g.push({ month: m, items: [l] })
    }
    return g
  }, [filtered])

  const entry = logs.find((l) => l.id === sel)
  const set = (patch: Partial<LogEntry>): void => {
    if (entry) upsert('logs', { ...entry, ...patch })
  }
  const totalMin = logs.reduce((a, l) => a + l.minutes, 0)

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="flex w-[330px] shrink-0 flex-col border-r border-line bg-panel/50">
        <div className="flex flex-col gap-3 border-b border-line p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Journal</h1>
              <p className="text-xs text-muted">
                {logs.length} entries · {fmtHours(totalMin)} total
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={create} title="New entry (Ctrl+J)">
              <IconPlus />
              New
            </Button>
          </div>
          <SearchInput value={q} onChange={setQ} placeholder="Search entries…" />
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(([t, n]) => (
                <button key={t} onClick={() => setTag(tag === t ? null : t)} className={cn('h-6 cursor-pointer rounded-full border px-2.5 font-mono text-[11px] transition-colors', tag === t ? 'border-accent/40 bg-accent-soft text-accent' : 'border-line text-muted hover:border-line-strong hover:text-fg')}>
                  #{t} <span className="text-faint">{n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {groups.map((g) => (
            <div key={g.month}>
              <div className="sticky top-0 z-10 bg-panel/90 px-3 pt-4 pb-2 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase backdrop-blur">{g.month}</div>
              {g.items.map((l) => {
                const d = parseISO(l.date)
                const active = l.id === sel
                const snippet = l.body.replace(/[#>*`\-[\]|]/g, ' ').replace(/\s+/g, ' ').trim()
                return (
                  <button key={l.id} onClick={() => setSel(l.id)} className={cn('mb-1 flex w-full cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', active ? 'bg-card shadow-[inset_0_0_0_1px_var(--border-strong)]' : 'hover:bg-card-2/60')}>
                    <div className={cn('flex w-10 shrink-0 flex-col items-center rounded-lg border py-1', active ? 'border-accent/30 bg-accent-soft' : 'border-line bg-card-2/50')}>
                      <span className={cn('text-[9.5px] font-semibold uppercase', active ? 'text-accent' : 'text-faint')}>{format(d, 'EEE')}</span>
                      <span className="text-[15px] leading-tight font-semibold tabular-nums">{format(d, 'd')}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">{l.title || <span className="text-faint italic">Untitled entry</span>}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted">{snippet || 'Empty'}</div>
                      <div className="mt-1.5 flex items-center gap-2 text-[10.5px] text-faint">
                        <span className="flex items-center gap-1">
                          <IconClock size={11} />
                          {fmtHours(l.minutes)}
                        </span>
                        {l.tags.slice(0, 3).map((t) => (
                          <span key={t} className="font-mono">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-[13px] text-muted">{logs.length ? 'No entries match.' : 'No entries yet.'}</p>}
        </div>
      </div>

      {/* Editor */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        {entry ? (
          <div key={entry.id} className="mx-auto flex max-w-[1000px] animate-fade-in flex-col gap-4 px-8 py-6">
            <div className="flex items-start gap-3">
              <input value={entry.title} onChange={(e) => set({ title: e.target.value })} placeholder="What did you learn today?" className="min-w-0 flex-1 bg-transparent text-[24px] font-semibold tracking-tight outline-none placeholder:text-faint" autoFocus={!entry.title} />
              <Button
                variant="ghost"
                size="icon"
                title="Delete entry"
                onClick={async () => {
                  if (await confirm('Delete entry?', 'This journal entry will be deleted.')) {
                    remove('logs', entry.id)
                    setSel(sorted.find((l) => l.id !== entry.id)?.id)
                  }
                }}
              >
                <IconTrash />
              </Button>
            </div>
            <div className="grid grid-cols-[170px_200px_1fr] gap-3">
              <label className="relative">
                <IconCalendar size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
                <Input type="date" value={entry.date} onChange={(e) => e.target.value && set({ date: e.target.value })} className="pl-9" />
              </label>
              <div className="flex items-center gap-1 rounded-lg border border-line bg-card-2 pr-1 pl-3">
                <IconClock size={15} className="text-faint" />
                <input type="number" min={0} step={5} value={entry.minutes} onChange={(e) => set({ minutes: Math.max(0, Number(e.target.value) || 0) })} className="w-12 bg-transparent text-[13px] tabular-nums outline-none" />
                <span className="text-xs text-faint">min</span>
                <div className="ml-auto flex gap-0.5">
                  {[30, 60, 90].map((m) => (
                    <button key={m} onClick={() => set({ minutes: m })} className={cn('h-6 cursor-pointer rounded-full px-2 text-[10.5px] font-medium', entry.minutes === m ? 'bg-accent-soft text-accent' : 'text-faint hover:bg-card hover:text-fg')}>
                      {m < 60 ? `${m}m` : `${m / 60}h`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <IconRoute size={15} className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-faint" />
                <Select value={entry.topicId ?? ''} onChange={(e) => set({ topicId: e.target.value || undefined })} className="pl-9">
                  <option value="">No linked topic</option>
                  {areas.map((a) => (
                    <optgroup key={a.id} label={a.name}>
                      {topics
                        .filter((t) => t.areaId === a.id)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </Select>
              </div>
            </div>
            <TagInput value={entry.tags} onChange={(tags) => set({ tags })} placeholder="Add tags like linux, nmap, tryhackme…" />
            <NoteEditor value={entry.body} onChange={(body) => set({ body })} minHeight={460} placeholder={PLACEHOLDER} defaultMode={entry.body.trim() ? 'read' : 'edit'} />
            <p className="text-[11px] text-faint">Saved automatically. Type / for blocks. Ctrl+B bold, Ctrl+I italic, Ctrl+E code, Ctrl+K link.</p>
          </div>
        ) : (
          <EmptyState icon={<IconNotebook />} title="Start your journal" text="Write down what you learn each day. It helps you remember and shows your progress." action={<Button variant="primary" onClick={create}><IconPlus />Write first entry</Button>} />
        )}
      </div>
    </div>
  )
}
