import { useRef, useState } from 'react'
import { IconCalendar, IconCheck, IconPlus, IconTarget, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useFocus, useStore } from '@/lib/store'
import type { Goal } from '@/lib/types'
import { cn, dueLabel, fmtDate, nowIso, today, uid } from '@/lib/utils'
import { Badge, Button, Card, EmptyState, Input, PageHeader, Ring, Select } from '@/components/ui'
import { confirm } from '@/components/dialog'
import { AreaGlyph } from '@/lib/icons'

function GoalRow({ g, flash }: { g: Goal; flash: boolean }): React.JSX.Element {
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const area = useStore((s) => s.areas.find((a) => a.id === g.areaId))
  const [title, setTitle] = useState(g.title)
  const due = g.deadline ? dueLabel(g.deadline) : null
  const toggle = (): void => {
    upsert('goals', { ...g, done: !g.done, doneAt: !g.done ? today() : undefined })
    if (!g.done) toast.success('Goal done! 🎉')
  }
  return (
    <div id={`goal-${g.id}`} className={cn('group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-card-2/60', flash && 'bg-accent-soft')}>
      <button onClick={toggle} className={cn('grid size-[22px] shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-all active:scale-90', g.done ? 'border-accent bg-accent text-accent-fg' : 'border-line-strong hover:border-accent')}>
        {g.done && <IconCheck size={13} stroke={3} />}
      </button>
      {area && <AreaGlyph icon={area.icon} color={area.color} size="sm" />}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => title.trim() && title !== g.title && upsert('goals', { ...g, title: title.trim() })}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        className={cn('min-w-0 flex-1 bg-transparent text-[13.5px] font-medium outline-none', g.done && 'text-faint line-through')}
      />
      {g.done ? (
        <span className="text-[11px] text-faint">Done {g.doneAt ? fmtDate(g.doneAt, 'd MMM') : ''}</span>
      ) : (
        <label className="relative flex cursor-pointer items-center">
          {due ? <Badge tone={due.tone === 'danger' ? 'danger' : due.tone === 'warn' ? 'warn' : 'muted'}>{due.text}</Badge> : <span className="text-[11px] text-faint opacity-0 group-hover:opacity-100">Add deadline</span>}
          <input type="date" value={g.deadline ?? ''} onChange={(e) => upsert('goals', { ...g, deadline: e.target.value || undefined })} className="absolute inset-0 cursor-pointer opacity-0" />
        </label>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        className="opacity-0 group-hover:opacity-100"
        title="Delete"
        onClick={async () => {
          if (await confirm('Delete goal?', `"${g.title}" will be deleted.`)) remove('goals', g.id)
        }}
      >
        <IconTrash />
      </Button>
    </div>
  )
}

export default function Goals(): React.JSX.Element {
  const goals = useStore((s) => s.goals)
  const areas = useStore((s) => s.areas)
  const upsert = useStore((s) => s.upsert)
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [areaId, setAreaId] = useState('')
  const [flash, setFlash] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useFocus('goals', (id) => {
    if (id === 'new') setTimeout(() => inputRef.current?.focus(), 50)
    else {
      setFlash(id)
      setTimeout(() => document.getElementById(`goal-${id}`)?.scrollIntoView({ block: 'center' }), 50)
      setTimeout(() => setFlash(null), 1600)
    }
  })

  const add = (): void => {
    if (!title.trim()) return
    upsert('goals', { id: uid(), title: title.trim(), deadline: deadline || undefined, areaId: areaId || undefined, done: false, createdAt: nowIso() })
    setTitle('')
    setDeadline('')
  }

  const open = goals.filter((g) => !g.done).sort((a, b) => (a.deadline ?? '9999').localeCompare(b.deadline ?? '9999'))
  const done = goals.filter((g) => g.done).sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? ''))
  const late = open.filter((g) => g.deadline && g.deadline < today()).length
  const pct = goals.length ? Math.round((done.length / goals.length) * 100) : 0

  return (
    <div className="mx-auto max-w-[900px] px-8 pt-7 pb-12">
      <PageHeader icon={<IconTarget />} title="Goals" sub="Small, clear goals with a deadline keep you moving." />
      <div className="mb-5 grid grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <Ring value={pct} size={52} stroke={5}>
            {pct}%
          </Ring>
          <div>
            <div className="text-xl font-semibold tabular-nums">
              {done.length}
              <span className="text-sm text-muted"> / {goals.length}</span>
            </div>
            <div className="text-xs text-muted">goals done</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xl font-semibold tabular-nums">{open.length}</div>
          <div className="text-xs text-muted">open goals</div>
          <div className="mt-2 text-[11px] text-faint">{open.filter((g) => g.deadline && dueLabel(g.deadline).tone === 'warn').length} due this week</div>
        </Card>
        <Card className="p-4">
          <div className={cn('text-xl font-semibold tabular-nums', late && 'text-danger')}>{late}</div>
          <div className="text-xs text-muted">late</div>
          <div className="mt-2 text-[11px] text-faint">{late ? 'Move the date or finish them' : 'Nothing is late. Good job!'}</div>
        </Card>
      </div>

      <Card className="mb-5 flex items-center gap-2 p-2">
        <IconPlus size={18} className="ml-2 text-faint" />
        <input ref={inputRef} value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Add a goal, e.g. “Finish the Jr Penetration Tester path”" className="h-9 min-w-0 flex-1 bg-transparent px-1 text-[13.5px] outline-none placeholder:text-faint" />
        <div className="relative w-[150px]">
          <IconCalendar size={14} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint" />
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-8 pl-8 text-xs" />
        </div>
        <div className="w-[150px]">
          <Select value={areaId} onChange={(e) => setAreaId(e.target.value)} className="h-8 text-xs">
            <option value="">No area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
        <Button variant="primary" size="sm" className="h-8" onClick={add} disabled={!title.trim()}>
          Add
        </Button>
      </Card>

      {goals.length === 0 ? (
        <Card>
          <EmptyState icon={<IconTarget />} title="No goals yet" text="Write your first goal above. Give it a deadline to stay focused." />
        </Card>
      ) : (
        <>
          <Card className="mb-5 p-2">
            <div className="px-3 pt-2 pb-1 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">Open · {open.length}</div>
            {open.map((g) => (
              <GoalRow key={g.id} g={g} flash={flash === g.id} />
            ))}
            {open.length === 0 && <p className="py-6 text-center text-[13px] text-muted">All goals are done. Add a new one!</p>}
          </Card>
          {done.length > 0 && (
            <Card className="p-2 opacity-90">
              <div className="px-3 pt-2 pb-1 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">Done · {done.length}</div>
              {done.map((g) => (
                <GoalRow key={g.id} g={g} flash={flash === g.id} />
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  )
}
