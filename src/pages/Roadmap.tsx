import { useEffect, useMemo, useState } from 'react'
import { IconCircleCheckFilled, IconCircleDashed, IconCircleHalf2, IconNote, IconPencil, IconPlus, IconRoute, IconSparkles, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useFocus, useStore } from '@/lib/store'
import type { Area, AreaIcon, Topic, TopicStatus } from '@/lib/types'
import { areaProgress } from '@/lib/stats'
import { AREA_COLORS, AREA_ICONS, AreaGlyph } from '@/lib/icons'
import { cn, nowIso, uid } from '@/lib/utils'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Progress, Ring, Segmented, Textarea } from '@/components/ui'
import { confirm, Modal } from '@/components/dialog'

const STATUS: Record<TopicStatus, { label: string; icon: typeof IconCircleDashed; cls: string }> = {
  todo: { label: 'Not started', icon: IconCircleDashed, cls: 'text-faint' },
  learning: { label: 'Learning', icon: IconCircleHalf2, cls: 'text-info' },
  done: { label: 'Done', icon: IconCircleCheckFilled, cls: 'text-accent' }
}
const NEXT: Record<TopicStatus, TopicStatus> = { todo: 'learning', learning: 'done', done: 'todo' }

function AreaDialog({ open, onOpenChange, area }: { open: boolean; onOpenChange: (o: boolean) => void; area?: Area }): React.JSX.Element {
  const upsert = useStore((s) => s.upsert)
  const [draft, setDraft] = useState<Area>(() => area ?? { id: uid(), name: '', icon: 'shield', color: AREA_COLORS[1], description: '' })
  useEffect(() => {
    if (open) setDraft(area ?? { id: uid(), name: '', icon: 'shield', color: AREA_COLORS[1], description: '' })
  }, [open, area])
  const save = (): void => {
    if (!draft.name.trim()) return
    upsert('areas', { ...draft, name: draft.name.trim() })
    onOpenChange(false)
    toast.success(area ? 'Area saved' : 'Area added')
  }
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={area ? 'Edit skill area' : 'New skill area'}
      description="A big topic, like Networking or Forensics."
      footer={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!draft.name.trim()}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-card-2/50 p-3">
          <AreaGlyph icon={draft.icon} color={draft.color} size="lg" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{draft.name || 'Area name'}</div>
            <div className="truncate text-xs text-muted">{draft.description || 'Short description'}</div>
          </div>
        </div>
        <Field label="Name">
          <Input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Digital forensics" onKeyDown={(e) => e.key === 'Enter' && save()} />
        </Field>
        <Field label="Description">
          <Input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What is this area about?" />
        </Field>
        <Field label="Icon">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(AREA_ICONS) as AreaIcon[]).map((k) => {
              const I = AREA_ICONS[k]
              return (
                <button key={k} onClick={() => setDraft({ ...draft, icon: k })} className={cn('grid size-9 cursor-pointer place-items-center rounded-lg border transition-colors', draft.icon === k ? 'border-accent bg-accent-soft text-accent' : 'border-line text-muted hover:border-line-strong')}>
                  <I size={17} />
                </button>
              )
            })}
          </div>
        </Field>
        <Field label="Color">
          <div className="flex gap-2">
            {AREA_COLORS.map((c) => (
              <button key={c} onClick={() => setDraft({ ...draft, color: c })} className={cn('size-7 cursor-pointer rounded-full ring-offset-2 ring-offset-card transition-all', draft.color === c && 'ring-2')} style={{ background: c, ['--tw-ring-color' as string]: c }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

function TopicRow({ topic, last }: { topic: Topic; last: boolean }): React.JSX.Element {
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(topic.title)
  const S = STATUS[topic.status]
  const set = (patch: Partial<Topic>): void => upsert('topics', { ...topic, ...patch, sample: false, updatedAt: nowIso() })
  return (
    <div className="group relative">
      {!last && <div className={cn('absolute top-9 bottom-[-6px] left-[23px] w-[2px] rounded-full', topic.status === 'done' ? 'bg-accent/40' : 'bg-line')} />}
      <div className={cn('flex items-center gap-3 rounded-xl px-3 py-2 transition-colors', open ? 'bg-card-2/70' : 'hover:bg-card-2/50')}>
        <button onClick={() => set({ status: NEXT[topic.status] })} title={`${S.label} — click to change`} className={cn('relative z-10 grid size-6 cursor-pointer place-items-center rounded-full bg-card transition-transform hover:scale-110 active:scale-95', S.cls)}>
          <S.icon size={22} stroke={1.8} />
        </button>
        <div className="min-w-0 flex-1">
          {editing ? (
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                setEditing(false)
                if (title.trim()) set({ title: title.trim() })
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              className="h-8"
            />
          ) : (
            <button onClick={() => setOpen(!open)} onDoubleClick={() => setEditing(true)} className={cn('w-full cursor-pointer truncate text-left text-[13.5px] font-medium', topic.status === 'done' && 'text-muted')}>
              {topic.title}
              {topic.notes && <IconNote size={13} className="ml-2 inline text-faint" />}
            </button>
          )}
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <Segmented
            size="sm"
            value={topic.status}
            onChange={(v) => set({ status: v })}
            options={[
              { value: 'todo', label: 'To do' },
              { value: 'learning', label: 'Learning' },
              { value: 'done', label: 'Done' }
            ]}
          />
        </div>
        <Badge tone={topic.status === 'done' ? 'accent' : topic.status === 'learning' ? 'info' : 'muted'} className="w-[78px] justify-center group-hover:hidden">
          {S.label}
        </Badge>
        <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon-sm" title="Rename" onClick={() => setEditing(true)}>
            <IconPencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Delete"
            onClick={async () => {
              if (await confirm('Delete topic?', `"${topic.title}" will be removed from your roadmap.`)) remove('topics', topic.id)
            }}
          >
            <IconTrash />
          </Button>
        </div>
      </div>
      {open && (
        <div className="animate-fade-in pt-1 pr-3 pb-3 pl-12">
          <Textarea value={topic.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Notes for this topic: links, key ideas, what to do next…" className="min-h-24 bg-card" />
        </div>
      )}
    </div>
  )
}

export default function Roadmap(): React.JSX.Element {
  const areas = useStore((s) => s.areas)
  const topics = useStore((s) => s.topics)
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const addStarterRoadmap = useStore((s) => s.addStarterRoadmap)
  const progress = useMemo(() => areaProgress(areas, topics), [areas, topics])
  const [sel, setSel] = useState<string | undefined>(areas[0]?.id)
  const [filter, setFilter] = useState<'all' | TopicStatus>('all')
  const [newTopic, setNewTopic] = useState('')
  const [dialog, setDialog] = useState<{ open: boolean; area?: Area }>({ open: false })

  useFocus('roadmap', (id) => (id === 'new' ? setDialog({ open: true }) : setSel(id)))

  const current = progress.find((p) => p.area.id === sel) ?? progress[0]
  const areaTopics = current ? topics.filter((t) => t.areaId === current.area.id) : []
  const shown = filter === 'all' ? areaTopics : areaTopics.filter((t) => t.status === filter)
  const totalDone = topics.filter((t) => t.status === 'done').length

  const addTopic = (): void => {
    if (!newTopic.trim() || !current) return
    upsert('topics', { id: uid(), areaId: current.area.id, title: newTopic.trim(), status: 'todo', notes: '', updatedAt: nowIso() })
    setNewTopic('')
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-7 pb-12">
      <PageHeader
        icon={<IconRoute />}
        title="Roadmap"
        sub={`${totalDone} of ${topics.length} topics done across ${areas.length} skill areas`}
        actions={
          <Button variant="primary" onClick={() => setDialog({ open: true })}>
            <IconPlus />
            New area
          </Button>
        }
      />
      {areas.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconRoute />}
            title="No skill areas yet"
            text="Add areas like Networking or Linux, then add topics to learn in each one. Or start from a ready-made roadmap and change it as you go."
            action={
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => setDialog({ open: true })}>
                  <IconPlus />
                  New area
                </Button>
                <Button
                  onClick={() => {
                    addStarterRoadmap()
                    toast.success('Starter roadmap added')
                  }}
                >
                  <IconSparkles />
                  Use starter roadmap
                </Button>
              </div>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-[340px_1fr] gap-5">
          <div className="stagger flex flex-col gap-2">
            {progress.map((p) => {
              const active = current?.area.id === p.area.id
              return (
                <button
                  key={p.area.id}
                  onClick={() => setSel(p.area.id)}
                  className={cn('card relative flex cursor-pointer items-center gap-3 overflow-hidden px-3.5 py-3 text-left transition-all', active ? '!border-line-strong' : 'hover:!border-line-strong opacity-90 hover:opacity-100')}
                  style={active ? { boxShadow: `inset 3px 0 0 ${p.area.color}, var(--shadow)` } : undefined}
                >
                  <AreaGlyph icon={p.area.icon} color={p.area.color} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-semibold">{p.area.name}</span>
                      <span className="font-mono text-[11px] text-faint">{p.pct}%</span>
                    </div>
                    <Progress value={p.pct} color={p.area.color} />
                    <div className="mt-1.5 text-[11px] text-faint">
                      {p.done} done · {p.learning} learning · {p.total - p.done - p.learning} to do
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {current && (
            <Card key={current.area.id} className="animate-fade-in self-start overflow-hidden">
              <div className="relative border-b border-line px-6 py-5">
                <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: `radial-gradient(500px circle at 0% 0%, color-mix(in srgb, ${current.area.color} 5%, transparent), transparent 60%)` }} />
                <div className="relative flex items-center gap-4">
                  <AreaGlyph icon={current.area.icon} color={current.area.color} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold tracking-tight">{current.area.name}</h2>
                    <p className="text-[13px] text-muted">{current.area.description}</p>
                  </div>
                  <Ring value={current.pct} size={56} stroke={5} color={current.area.color}>
                    <span className="text-xs">{current.pct}%</span>
                  </Ring>
                  <div className="flex">
                    <Button variant="ghost" size="icon" title="Edit area" onClick={() => setDialog({ open: true, area: current.area })}>
                      <IconPencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete area"
                      onClick={async () => {
                        if (await confirm('Delete skill area?', `"${current.area.name}" and its ${current.total} topics will be deleted.`)) {
                          remove('areas', current.area.id)
                          setSel(undefined)
                        }
                      }}
                    >
                      <IconTrash />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <Segmented
                  value={filter}
                  onChange={setFilter}
                  options={[
                    { value: 'all', label: 'All', count: areaTopics.length },
                    { value: 'todo', label: 'To do', count: areaTopics.filter((t) => t.status === 'todo').length },
                    { value: 'learning', label: 'Learning', count: current.learning },
                    { value: 'done', label: 'Done', count: current.done }
                  ]}
                />
                <span className="text-[11px] text-faint">Click a circle to change status · Click a topic for notes</span>
              </div>
              <div className="px-3 py-2">
                {shown.map((t, i) => (
                  <TopicRow key={t.id} topic={t} last={i === shown.length - 1} />
                ))}
                {shown.length === 0 && <p className="py-8 text-center text-[13px] text-muted">No topics here.</p>}
              </div>
              <div className="flex gap-2 border-t border-line px-6 py-4">
                <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTopic()} placeholder={`Add a topic to ${current.area.name}…`} />
                <Button onClick={addTopic} disabled={!newTopic.trim()}>
                  <IconPlus />
                  Add
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
      <AreaDialog open={dialog.open} area={dialog.area} onOpenChange={(o) => setDialog((d) => ({ ...d, open: o }))} />
    </div>
  )
}
