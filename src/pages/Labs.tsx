import { useMemo, useState } from 'react'
import { IconClock, IconExternalLink, IconFlag3, IconLayoutKanban, IconList, IconPlus, IconTrash } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useFocus, useStore } from '@/lib/store'
import type { Difficulty, Lab, WorkStatus } from '@/lib/types'
import { fmtDate, fmtHours, nowIso, today, uid } from '@/lib/utils'
import { DIFF_META, PLATFORMS, platformColor } from '@/lib/platforms'
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, SearchInput, Segmented, Select } from '@/components/ui'
import { confirm, Sheet } from '@/components/dialog'
import { MarkdownEditor } from '@/components/markdown'
import { TagInput } from '@/components/tag-input'

const STATUS_META: Record<WorkStatus, { label: string; tone: 'muted' | 'info' | 'accent'; dot: string }> = {
  todo: { label: 'To do', tone: 'muted', dot: 'var(--faint)' },
  doing: { label: 'In progress', tone: 'info', dot: 'var(--c-sky)' },
  done: { label: 'Solved', tone: 'accent', dot: 'var(--accent)' }
}

function PlatformChip({ name }: { name: string }): React.JSX.Element {
  const c = platformColor(name)
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted">
      <span className="size-2 rounded-full" style={{ background: c, boxShadow: 'none' }} />
      {name || 'No platform'}
    </span>
  )
}

function DiffPill({ d }: { d: Difficulty }): React.JSX.Element {
  const m = DIFF_META[d]
  return (
    <span className="inline-flex h-5 items-center rounded-full px-2 text-[10.5px] font-semibold" style={{ color: m.color, background: `color-mix(in srgb, ${m.color} 13%, transparent)` }}>
      {m.label}
    </span>
  )
}

function LabCard({ lab, onOpen }: { lab: Lab; onOpen: () => void }): React.JSX.Element {
  return (
    <button onClick={onOpen} className="card group flex w-full cursor-pointer flex-col gap-2.5 rounded-[14px] p-3.5 text-left transition-all hover:-translate-y-0.5 hover:!border-line-strong">
      <div className="flex items-center justify-between gap-2">
        <PlatformChip name={lab.platform} />
        <DiffPill d={lab.difficulty} />
      </div>
      <div className="text-[13.5px] leading-snug font-semibold">{lab.name}</div>
      {lab.writeup && <p className="line-clamp-2 text-xs text-muted">{lab.writeup.replace(/[#>*`]/g, '').slice(0, 160)}</p>}
      <div className="flex flex-wrap items-center gap-1.5">
        {lab.tags.slice(0, 3).map((t) => (
          <span key={t} className="font-mono text-[10.5px] text-faint">#{t}</span>
        ))}
        <span className="flex-1" />
        {lab.minutes > 0 && (
          <span className="flex items-center gap-1 text-[10.5px] text-faint">
            <IconClock size={11} />
            {fmtHours(lab.minutes)}
          </span>
        )}
        {lab.status === 'done' && lab.date && <span className="text-[10.5px] text-faint">· {fmtDate(lab.date, 'd MMM')}</span>}
      </div>
    </button>
  )
}

export default function Labs(): React.JSX.Element {
  const labs = useStore((s) => s.labs)
  const areas = useStore((s) => s.areas)
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const [view, setView] = useState<'board' | 'list'>('board')
  const [q, setQ] = useState('')
  const [platform, setPlatform] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const create = (): void => {
    const l: Lab = { id: uid(), name: '', platform: 'TryHackMe', difficulty: 'easy', status: 'todo', url: '', writeup: '', tags: [], minutes: 0, createdAt: nowIso() }
    upsert('labs', l)
    setOpenId(l.id)
  }
  useFocus('labs', (id) => (id === 'new' ? create() : setOpenId(id)))

  const platforms = useMemo(() => [...new Set(labs.map((l) => l.platform).filter(Boolean))].sort(), [labs])
  const filtered = labs.filter((l) => (!platform || l.platform === platform) && (!q.trim() || `${l.name} ${l.platform} ${l.tags.join(' ')} ${l.writeup}`.toLowerCase().includes(q.toLowerCase())))
  const open = labs.find((l) => l.id === openId)
  const set = (patch: Partial<Lab>): void => {
    if (!open) return
    const next = { ...open, ...patch }
    if (patch.status === 'done' && !open.date) next.date = today()
    upsert('labs', next)
  }
  const closeSheet = (): void => {
    if (open && !open.name.trim() && !open.writeup.trim()) remove('labs', open.id)
    setOpenId(null)
  }

  const solved = labs.filter((l) => l.status === 'done').length

  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-7 pb-12">
      <PageHeader
        icon={<IconFlag3 />}
        title="Labs & CTFs"
        sub={`${solved} solved · ${labs.filter((l) => l.status === 'doing').length} in progress · ${labs.filter((l) => l.status === 'todo').length} to do`}
        actions={
          <Button variant="primary" onClick={create}>
            <IconPlus />
            New lab
          </Button>
        }
      />

      <div className="mb-5 flex items-center gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Search labs, tags, write-ups…" className="w-[300px]" />
        <div className="w-[190px]">
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">All platforms</option>
            {platforms.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </div>
        <div className="flex-1" />
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: 'board', label: <><IconLayoutKanban />Board</> },
            { value: 'list', label: <><IconList />List</> }
          ]}
        />
      </div>

      {labs.length === 0 ? (
        <Card>
          <EmptyState icon={<IconFlag3 />} title="No labs yet" text="Track rooms, boxes and CTF challenges. Write how you solved them so you remember later." action={<Button variant="primary" onClick={create}><IconPlus />Add your first lab</Button>} />
        </Card>
      ) : view === 'board' ? (
        <div className="grid grid-cols-3 gap-4">
          {(['todo', 'doing', 'done'] as WorkStatus[]).map((st) => {
            const items = filtered.filter((l) => l.status === st)
            return (
              <div key={st} className="flex flex-col rounded-[22px] border border-line bg-panel/60 p-2">
                <div className="flex items-center gap-2 px-1.5 pt-1 pb-3">
                  <span className="size-2 rounded-full" style={{ background: STATUS_META[st].dot }} />
                  <span className="text-[13px] font-semibold">{STATUS_META[st].label}</span>
                  <span className="font-mono text-[11px] text-faint">{items.length}</span>
                </div>
                <div className="stagger flex flex-col gap-2.5">
                  {items.map((l) => (
                    <LabCard key={l.id} lab={l} onOpen={() => setOpenId(l.id)} />
                  ))}
                  {items.length === 0 && <div className="rounded-[14px] border border-dashed border-line py-8 text-center text-xs text-faint">Nothing here</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_150px_90px_110px_80px_90px] gap-3 border-b border-line px-5 py-2.5 text-[11px] font-semibold tracking-wide text-faint uppercase">
            <span>Name</span>
            <span>Platform</span>
            <span>Level</span>
            <span>Status</span>
            <span>Time</span>
            <span>Date</span>
          </div>
          {filtered.map((l) => (
            <button key={l.id} onClick={() => setOpenId(l.id)} className="grid w-full cursor-pointer grid-cols-[1fr_150px_90px_110px_80px_90px] items-center gap-3 border-b border-line px-5 py-3 text-left text-[13px] transition-colors last:border-0 hover:bg-card-2/50">
              <span className="truncate font-medium">{l.name || 'Untitled lab'}</span>
              <PlatformChip name={l.platform} />
              <span><DiffPill d={l.difficulty} /></span>
              <span><Badge tone={STATUS_META[l.status].tone} dot>{STATUS_META[l.status].label}</Badge></span>
              <span className="text-xs text-muted tabular-nums">{l.minutes ? fmtHours(l.minutes) : '—'}</span>
              <span className="text-xs text-muted">{l.date ? fmtDate(l.date, 'd MMM') : '—'}</span>
            </button>
          ))}
        </Card>
      )}

      <Sheet
        open={!!open}
        onOpenChange={(o) => !o && closeSheet()}
        title={open?.name || 'New lab'}
        width={760}
        header={
          open && (
            <>
              {open.url && (
                <Button variant="ghost" size="sm" onClick={() => window.api.openLink(open.url)}>
                  <IconExternalLink />
                  Open
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                title="Delete"
                onClick={async () => {
                  if (await confirm('Delete lab?', `"${open.name || 'This lab'}" and its write-up will be deleted.`)) {
                    remove('labs', open.id)
                    setOpenId(null)
                    toast('Lab deleted')
                  }
                }}
              >
                <IconTrash />
              </Button>
            </>
          )
        }
      >
        {open && (
          <div className="flex flex-col gap-4 p-5">
            <input autoFocus={!open.name} value={open.name} onChange={(e) => set({ name: e.target.value })} placeholder="Room / box / challenge name" className="bg-transparent text-xl font-semibold tracking-tight outline-none placeholder:text-faint" />
            <div className="flex flex-wrap items-center gap-3">
              <Segmented value={open.status} onChange={(v) => set({ status: v })} options={(['todo', 'doing', 'done'] as WorkStatus[]).map((s) => ({ value: s, label: STATUS_META[s].label }))} />
              <Segmented value={open.difficulty} onChange={(v) => set({ difficulty: v })} options={(Object.keys(DIFF_META) as Difficulty[]).map((d) => ({ value: d, label: <span style={{ color: open.difficulty === d ? DIFF_META[d].color : undefined }}>{DIFF_META[d].label}</span> }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Platform">
                <Input list="cj-platforms" value={open.platform} onChange={(e) => set({ platform: e.target.value })} />
                <datalist id="cj-platforms">
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </Field>
              <Field label="Link">
                <Input value={open.url} onChange={(e) => set({ url: e.target.value })} placeholder="https://" />
              </Field>
              <Field label="Skill area">
                <Select value={open.areaId ?? ''} onChange={(e) => set({ areaId: e.target.value || undefined })}>
                  <option value="">None</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Time spent (min)">
                  <Input type="number" min={0} step={15} value={open.minutes} onChange={(e) => set({ minutes: Math.max(0, Number(e.target.value) || 0) })} />
                </Field>
                <Field label="Solved on">
                  <Input type="date" value={open.date ?? ''} onChange={(e) => set({ date: e.target.value || undefined })} />
                </Field>
              </div>
            </div>
            <Field label="Tags">
              <TagInput value={open.tags} onChange={(tags) => set({ tags })} placeholder="e.g. sqli, privesc, smb" />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Write-up</span>
              <MarkdownEditor value={open.writeup} onChange={(writeup) => set({ writeup })} placeholder={'## Recon\n\n## Foothold\n\n## Privilege escalation\n\n## What I learned'} minHeight={340} defaultMode={open.writeup.trim() ? 'split' : 'write'} />
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
