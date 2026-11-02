import { useEffect, useState } from 'react'
import { IconCalendar, IconCertificate, IconCheck, IconExternalLink, IconPencil, IconPlus, IconTrash, IconTrophy } from '@tabler/icons-react'
import { toast } from 'sonner'
import { addMonths, format, startOfMonth } from 'date-fns'
import { useFocus, useStore } from '@/lib/store'
import type { Cert, CertStatus } from '@/lib/types'
import { cn, daysUntil, fmtDate, uid } from '@/lib/utils'
import { Button, Card, CardHeader, EmptyState, Field, Input, PageHeader, Ring, Select, Textarea } from '@/components/ui'
import { confirm, Modal } from '@/components/dialog'

const STEPS: { value: CertStatus; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'studying', label: 'Studying' },
  { value: 'booked', label: 'Exam booked' },
  { value: 'passed', label: 'Passed' }
]

function blank(): Cert {
  return { id: uid(), name: '', provider: '', progress: 0, status: 'planned', notes: '', url: '' }
}

function CertDialog({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o: boolean) => void; item?: Cert }): React.JSX.Element {
  const upsert = useStore((s) => s.upsert)
  const [d, setD] = useState<Cert>(blank)
  useEffect(() => {
    if (open) setD(item ?? blank())
  }, [open, item])
  const save = (): void => {
    if (!d.name.trim()) return
    upsert('certs', { ...d, name: d.name.trim(), progress: d.status === 'passed' ? 100 : d.progress })
    onOpenChange(false)
    toast.success(item ? 'Certification saved' : 'Certification added')
  }
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Edit certification' : 'New certification'}
      footer={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!d.name.trim()}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_160px] gap-3">
          <Field label="Name">
            <Input autoFocus value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="e.g. CompTIA Security+" />
          </Field>
          <Field label="Provider">
            <Input value={d.provider} onChange={(e) => setD({ ...d, provider: e.target.value })} placeholder="e.g. CompTIA" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select value={d.status} onChange={(e) => setD({ ...d, status: e.target.value as CertStatus })}>
              {STEPS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Target exam date">
            <Input type="date" value={d.targetDate ?? ''} onChange={(e) => setD({ ...d, targetDate: e.target.value || undefined })} />
          </Field>
        </div>
        <Field label={`Study progress: ${d.progress}%`}>
          <input type="range" min={0} max={100} step={5} value={d.progress} onChange={(e) => setD({ ...d, progress: Number(e.target.value) })} />
        </Field>
        <Field label="Link">
          <Input value={d.url} onChange={(e) => setD({ ...d, url: e.target.value })} placeholder="https://" />
        </Field>
        <Field label="Notes">
          <Textarea value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} placeholder="Exam format, study plan, cost…" />
        </Field>
      </div>
    </Modal>
  )
}

function Timeline({ certs }: { certs: Cert[] }): React.JSX.Element | null {
  const items = certs.filter((c) => c.targetDate && c.status !== 'passed').sort((a, b) => a.targetDate!.localeCompare(b.targetDate!))
  if (!items.length) return null
  const maxDays = Math.max(30, ...items.map((c) => daysUntil(c.targetDate!)))
  const span = maxDays * 1.1
  const months = Math.ceil(span / 30) + 1
  return (
    <Card className="mt-5">
      <CardHeader icon={<IconCalendar />} title="Exam timeline" sub="Your target dates, starting today" />
      <div className="relative mx-8 h-[118px]">
        <div className="absolute top-[58px] right-0 left-0 h-[2px] rounded-full bg-line-strong" />
        <div className="absolute top-[58px] left-0 h-[2px] w-6 rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
        {[0, ...Array.from({ length: months + 1 }, (_, i) => daysUntil(format(startOfMonth(addMonths(new Date(), i + 1)), 'yyyy-MM-dd')))].map((d, i) => {
          const left = (d / span) * 100
          if (left > 100) return null
          return (
            <div key={i} className="absolute top-[54px] flex -translate-x-1/2 flex-col items-center" style={{ left: `${left}%` }}>
              <span className="h-2.5 w-px bg-line-strong" />
              <span className="mt-6 text-[10px] text-faint">{i === 0 ? 'Today' : format(addMonths(new Date(), i), 'MMM')}</span>
            </div>
          )
        })}
        {items.map((c, i) => {
          const left = Math.max(0, (daysUntil(c.targetDate!) / span) * 100)
          const up = i % 2 === 0
          return (
            <div key={c.id} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: `${left}%`, top: up ? 4 : 52 }}>
              {!up && <span className="size-3.5 rounded-full border-[3px] border-card bg-accent shadow-[0_0_0_1px_var(--accent)]" />}
              <div className={cn('rounded-lg border border-line bg-card-2 px-2.5 py-1 text-center whitespace-nowrap', up ? 'mb-1' : 'mt-1')}>
                <div className="text-[11.5px] font-semibold">{c.name}</div>
                <div className="text-[10px] text-faint">{fmtDate(c.targetDate, 'd MMM yyyy')}</div>
              </div>
              {up && <span className="size-3.5 rounded-full border-[3px] border-card bg-accent shadow-[0_0_0_1px_var(--accent)]" />}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function Certs(): React.JSX.Element {
  const certs = useStore((s) => s.certs)
  const upsert = useStore((s) => s.upsert)
  const remove = useStore((s) => s.remove)
  const [dialog, setDialog] = useState<{ open: boolean; item?: Cert }>({ open: false })
  useFocus('certs', (id) => setDialog(id === 'new' ? { open: true } : { open: true, item: useStore.getState().certs.find((c) => c.id === id) }))
  const order: Record<CertStatus, number> = { booked: 0, studying: 1, planned: 2, passed: 3 }
  const sorted = [...certs].sort((a, b) => order[a.status] - order[b.status] || (a.targetDate ?? '9') .localeCompare(b.targetDate ?? '9'))

  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-7 pb-12">
      <PageHeader
        icon={<IconCertificate />}
        title="Certifications"
        sub={`${certs.filter((c) => c.status === 'passed').length} passed · ${certs.filter((c) => c.status !== 'passed').length} in your plan`}
        actions={
          <Button variant="primary" onClick={() => setDialog({ open: true })}>
            <IconPlus />
            New certification
          </Button>
        }
      />
      {certs.length === 0 ? (
        <Card>
          <EmptyState icon={<IconCertificate />} title="No certifications yet" text="Add the exams you want to pass, like Security+ or eJPT, and track how ready you are." action={<Button variant="primary" onClick={() => setDialog({ open: true })}><IconPlus />Add certification</Button>} />
        </Card>
      ) : (
        <div className="stagger grid grid-cols-3 gap-4">
          {sorted.map((c) => {
            const passed = c.status === 'passed'
            const stepIdx = STEPS.findIndex((s) => s.value === c.status)
            const days = c.targetDate ? daysUntil(c.targetDate) : null
            const color = passed ? 'var(--success)' : 'var(--accent)'
            return (
              <Card key={c.id} className="group relative flex flex-col overflow-hidden">
                <div className="relative flex items-start gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-mono text-[11px] tracking-wide text-faint uppercase">{c.provider || 'Certification'}</div>
                    <h3 className="text-[17px] leading-tight font-semibold tracking-tight">{c.name}</h3>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                      <IconCalendar size={14} className="text-faint" />
                      {c.targetDate ? (
                        <>
                          {fmtDate(c.targetDate)}
                          {!passed && days !== null && <span className={cn('font-medium', days < 0 ? 'text-danger' : days <= 30 ? 'text-warn' : 'text-faint')}>· {days < 0 ? `${-days} days ago` : `${days} days left`}</span>}
                        </>
                      ) : (
                        <span className="text-faint">No date yet</span>
                      )}
                    </div>
                  </div>
                  <Ring value={passed ? 100 : c.progress} size={64} stroke={5} color={color}>
                    {passed ? <IconTrophy size={22} className="text-success" /> : <span className="text-sm">{c.progress}%</span>}
                  </Ring>
                </div>
                <div className="relative px-5">
                  <div className="flex items-center">
                    {STEPS.map((s, i) => (
                      <div key={s.value} className="flex flex-1 items-center last:flex-none">
                        <button onClick={() => upsert('certs', { ...c, status: s.value, progress: s.value === 'passed' ? 100 : c.progress })} title={s.label} className={cn('grid size-5 shrink-0 cursor-pointer place-items-center rounded-full border-2 transition-all hover:scale-110', i <= stepIdx ? 'border-transparent text-accent-fg' : 'border-line-strong bg-card')} style={i <= stepIdx ? { background: color } : undefined}>
                          {i <= stepIdx && <IconCheck size={11} stroke={3} />}
                        </button>
                        {i < STEPS.length - 1 && <div className="mx-1 h-[2px] flex-1 rounded-full" style={{ background: i < stepIdx ? color : 'var(--border-strong)' }} />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10.5px] text-faint">
                    {STEPS.map((s, i) => (
                      <span key={s.value} className={cn(i === stepIdx && 'font-semibold text-fg')}>{s.label}</span>
                    ))}
                  </div>
                </div>
                {!passed && (
                  <div className="relative px-5 pt-4">
                    <div className="mb-1 flex justify-between text-[11px] text-muted">
                      <span>Study progress</span>
                      <span className="tabular-nums">{c.progress}%</span>
                    </div>
                    <input type="range" min={0} max={100} step={5} value={c.progress} onChange={(e) => upsert('certs', { ...c, progress: Number(e.target.value) })} className="w-full" />
                  </div>
                )}
                {c.notes && <p className="relative line-clamp-2 px-5 pt-3 text-xs leading-relaxed text-muted">{c.notes}</p>}
                <div className="flex-1" />
                <div className="relative mt-4 flex items-center gap-1 border-t border-line px-3 py-2">
                  {c.url && (
                    <Button variant="ghost" size="sm" onClick={() => window.api.openLink(c.url)}>
                      <IconExternalLink />
                      Website
                    </Button>
                  )}
                  <span className="flex-1" />
                  <Button variant="ghost" size="icon-sm" title="Edit" onClick={() => setDialog({ open: true, item: c })}>
                    <IconPencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Delete"
                    onClick={async () => {
                      if (await confirm('Delete certification?', `"${c.name}" will be removed.`)) remove('certs', c.id)
                    }}
                  >
                    <IconTrash />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      {certs.length > 0 && <Timeline certs={certs} />}
      <CertDialog open={dialog.open} item={dialog.item} onOpenChange={(o) => setDialog((d) => ({ ...d, open: o }))} />
    </div>
  )
}
