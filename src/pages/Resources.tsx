import { useEffect, useState } from 'react'
import { IconBooks, IconExternalLink, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useFocus, useStore } from '@/lib/store'
import type { Resource, ResourceKind, WorkStatus } from '@/lib/types'
import { KIND_META } from '@/lib/icons'
import { cn, hostOf, nowIso, uid } from '@/lib/utils'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, SearchInput, Segmented, Select, Textarea } from '@/components/ui'
import { confirm, Modal } from '@/components/dialog'

const STATUS: Record<WorkStatus, { label: string; tone: 'muted' | 'info' | 'accent' }> = {
  todo: { label: 'Want to do', tone: 'muted' },
  doing: { label: 'Using now', tone: 'info' },
  done: { label: 'Finished', tone: 'accent' }
}
const NEXT: Record<WorkStatus, WorkStatus> = { todo: 'doing', doing: 'done', done: 'todo' }

function blank(): Resource {
  return { id: uid(), title: '', kind: 'course', url: '', status: 'todo', notes: '', free: true, createdAt: nowIso() }
}

function ResourceDialog({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o: boolean) => void; item?: Resource }): React.JSX.Element {
  const upsert = useStore((s) => s.upsert)
  const areas = useStore((s) => s.areas)
  const [d, setD] = useState<Resource>(blank)
  useEffect(() => {
    if (open) setD(item ?? blank())
  }, [open, item])
  const save = (): void => {
    if (!d.title.trim()) return
    let url = d.url.trim()
    if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url
    upsert('resources', { ...d, title: d.title.trim(), url })
    onOpenChange(false)
    toast.success(item ? 'Resource saved' : 'Resource added')
  }
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Edit resource' : 'New resource'}
      description="A course, book, video, platform, article or tool."
      footer={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!d.title.trim()}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Type">
          <div className="grid grid-cols-6 gap-1.5">
            {(Object.keys(KIND_META) as ResourceKind[]).map((k) => {
              const M = KIND_META[k]
              return (
                <button key={k} onClick={() => setD({ ...d, kind: k })} className={cn('flex cursor-pointer flex-col items-center gap-1 rounded-lg border py-2 text-[11px] font-medium transition-colors', d.kind === k ? 'border-accent/50 bg-accent-soft text-fg' : 'border-line text-muted hover:border-line-strong')}>
                  <M.icon size={17} style={{ color: M.color }} />
                  {M.label}
                </button>
              )
            })}
          </div>
        </Field>
        <Field label="Title">
          <Input autoFocus value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. PortSwigger Web Security Academy" />
        </Field>
        <Field label="Link">
          <Input value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} placeholder="https://" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select value={d.status} onChange={(e) => setD({ ...d, status: e.target.value as WorkStatus })}>
              {(Object.keys(STATUS) as WorkStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS[s].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Skill area">
            <Select value={d.areaId ?? ''} onChange={(e) => setD({ ...d, areaId: e.target.value || undefined })}>
              <option value="">None</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
          <input type="checkbox" checked={d.free} onChange={(e) => setD({ ...d, free: e.target.checked })} className="size-4 accent-[var(--accent)]" />
          It is free
        </label>
        <Field label="Notes">
          <Textarea value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} placeholder="Why is it useful? Where did you stop?" />
        </Field>
      </div>
    </Modal>
  )
}

export default function Resources(): React.JSX.Element {
  const resources = useStore((s) => s.resources)
  const areas = useStore((s) => s.areas)
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const [kind, setKind] = useState<'all' | ResourceKind>('all')
  const [status, setStatus] = useState<'all' | WorkStatus>('all')
  const [q, setQ] = useState('')
  const [dialog, setDialog] = useState<{ open: boolean; item?: Resource }>({ open: false })
  const [flash, setFlash] = useState<string | null>(null)

  useFocus('resources', (id) => {
    if (id === 'new') setDialog({ open: true })
    else {
      setFlash(id)
      setTimeout(() => document.getElementById(`res-${id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50)
      setTimeout(() => setFlash(null), 1600)
    }
  })

  const shown = resources.filter((r) => (kind === 'all' || r.kind === kind) && (status === 'all' || r.status === status) && (!q.trim() || `${r.title} ${r.notes} ${r.url}`.toLowerCase().includes(q.toLowerCase())))
  const kinds = (Object.keys(KIND_META) as ResourceKind[]).filter((k) => resources.some((r) => r.kind === k))

  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-7 pb-12">
      <PageHeader
        icon={<IconBooks />}
        title="Resources"
        sub="Your library of courses, books, videos, platforms and tools"
        actions={
          <Button variant="primary" onClick={() => setDialog({ open: true })}>
            <IconPlus />
            New resource
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Search resources…" className="w-[260px]" />
        <Segmented
          value={kind}
          onChange={setKind}
          options={[{ value: 'all' as const, label: 'All', count: resources.length }, ...kinds.map((k) => ({ value: k, label: KIND_META[k].label, count: resources.filter((r) => r.kind === k).length }))]}
        />
        <div className="flex-1" />
        <Segmented
          value={status}
          onChange={setStatus}
          options={[{ value: 'all' as const, label: 'Any status' }, ...(Object.keys(STATUS) as WorkStatus[]).map((s) => ({ value: s, label: STATUS[s].label }))]}
        />
      </div>

      {resources.length === 0 ? (
        <Card>
          <EmptyState icon={<IconBooks />} title="Your library is empty" text="Save the courses, books and platforms you use, so everything is in one place." action={<Button variant="primary" onClick={() => setDialog({ open: true })}><IconPlus />Add a resource</Button>} />
        </Card>
      ) : (
        <div className="stagger grid grid-cols-3 gap-4">
          {shown.map((r) => {
            const M = KIND_META[r.kind]
            const area = areas.find((a) => a.id === r.areaId)
            return (
              <Card key={r.id} id={`res-${r.id}`} className={cn('group flex flex-col p-4 transition-all hover:!border-line-strong', flash === r.id && 'ring-2 ring-accent')}>
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ color: M.color, background: `color-mix(in srgb, ${M.color} 12%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${M.color} 20%, transparent)` }}>
                    <M.icon size={19} stroke={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[13.5px] leading-snug font-semibold">{r.title}</div>
                    <div className="mt-0.5 truncate font-mono text-[11px] text-faint">{hostOf(r.url) || M.label}</div>
                  </div>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon-sm" title="Edit" onClick={() => setDialog({ open: true, item: r })}>
                      <IconPencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Delete"
                      onClick={async () => {
                        if (await confirm('Delete resource?', `"${r.title}" will be removed from your library.`)) remove('resources', r.id)
                      }}
                    >
                      <IconTrash />
                    </Button>
                  </div>
                </div>
                {r.notes && <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{r.notes}</p>}
                <div className="flex-1" />
                <div className="mt-4 flex items-center gap-1.5">
                  <button onClick={() => upsert('resources', { ...r, status: NEXT[r.status] })} title="Click to change status" className="cursor-pointer">
                    <Badge tone={STATUS[r.status].tone} dot>
                      {STATUS[r.status].label}
                    </Badge>
                  </button>
                  {area && <Badge tone="muted">{area.name}</Badge>}
                  {r.free && <Badge tone="muted">Free</Badge>}
                  <span className="flex-1" />
                  {r.url && (
                    <Button variant="ghost" size="sm" onClick={() => window.api.openLink(r.url)}>
                      Open
                      <IconExternalLink />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
          {shown.length === 0 && <p className="col-span-3 py-12 text-center text-[13px] text-muted">Nothing matches these filters.</p>}
        </div>
      )}
      <ResourceDialog open={dialog.open} item={dialog.item} onOpenChange={(o) => setDialog((d) => ({ ...d, open: o }))} />
    </div>
  )
}
