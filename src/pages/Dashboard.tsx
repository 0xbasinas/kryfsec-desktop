import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { IconActivity, IconArrowRight, IconCalendar, IconCertificate, IconChartRadar, IconCircleCheck, IconClock, IconFlag3, IconFlame, IconNotebook, IconPlus, IconRoute, IconTarget, IconTrophy } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useStore } from '@/lib/store'
import { activeDays, areaProgress, heatmap, lastDays, recentActivity, streak, weekMinutes } from '@/lib/stats'
import { cn, dueLabel, fmtDate, fmtHours } from '@/lib/utils'
import { AreaGlyph } from '@/lib/icons'
import { Badge, Button, Card, CardHeader, Progress, Ring } from '@/components/ui'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Working late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }): React.JSX.Element | null {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line-strong bg-card px-3 py-2 text-xs shadow-xl">
      <div className="text-muted">{label}</div>
      <div className="mt-0.5 font-semibold tabular-nums">{payload[0].value} h</div>
    </div>
  )
}

function Stat({ icon, label, value, sub, accent, children }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode; accent?: string; children?: React.ReactNode }): React.JSX.Element {
  return (
    <Card className="group relative overflow-hidden p-4.5">
      <div className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-25" style={{ background: accent ?? 'var(--accent)' }} />
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        <span className="grid size-6 place-items-center rounded-md [&_svg]:size-3.5" style={{ color: accent ?? 'var(--accent)', background: `color-mix(in srgb, ${accent ?? 'var(--accent)'} 14%, transparent)` }}>
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[26px] leading-none font-semibold tracking-tight tabular-nums">{value}</div>
          {sub && <div className="mt-1.5 text-xs text-muted">{sub}</div>}
        </div>
        {children}
      </div>
    </Card>
  )
}

export default function Dashboard(): React.JSX.Element {
  const data = useStore(useShallow((s) => ({ settings: s.settings, areas: s.areas, topics: s.topics, logs: s.logs, labs: s.labs, certs: s.certs, goals: s.goals, resources: s.resources, version: s.version })))
  const go = useStore((s) => s.go)
  const st = useMemo(() => streak(data), [data])
  const week = weekMinutes(data)
  const goalH = data.settings.weeklyGoalHours
  const chart = useMemo(() => lastDays(data, 30), [data])
  const days = activeDays(data)
  const last7 = chart.slice(-7).map((d) => days.has(d.date))
  const progress = useMemo(() => areaProgress(data.areas, data.topics), [data.areas, data.topics])
  const heat = useMemo(() => heatmap(data, 26), [data])
  const recent = useMemo(() => recentActivity(data, 6), [data])
  const topicsDone = data.topics.filter((t) => t.status === 'done').length
  const labsDone = data.labs.filter((l) => l.status === 'done').length
  const monthKey = format(new Date(), 'yyyy-MM')
  const labsMonth = data.labs.filter((l) => l.status === 'done' && l.date?.startsWith(monthKey)).length
  const total30 = chart.reduce((a, d) => a + d.hours, 0)
  const learningNow = data.topics.filter((t) => t.status === 'learning').slice(0, 4)

  const upcoming = [
    ...data.goals.filter((g) => !g.done && g.deadline).map((g) => ({ id: g.id, kind: 'goal' as const, title: g.title, date: g.deadline! })),
    ...data.certs.filter((c) => c.status !== 'passed' && c.targetDate).map((c) => ({ id: c.id, kind: 'cert' as const, title: c.name, date: c.targetDate!, progress: c.progress }))
  ]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(0, 5)

  const name = data.settings.name.trim()

  return (
    <div className="mx-auto max-w-[1280px] px-8 pt-7 pb-12">
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-line bg-card px-7 py-6">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="relative flex items-center justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-accent">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {format(new Date(), 'EEEE, d MMMM yyyy').toLowerCase()}
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight">
              {greeting()}
              {name ? `, ${name}` : ''} <span className="inline-block">👋</span>
            </h1>
            <p className="mt-1.5 max-w-xl text-[13.5px] text-muted">
              {st.current > 0
                ? st.todayDone
                  ? `You studied today. Your streak is ${st.current} day${st.current > 1 ? 's' : ''}. Nice!`
                  : `Your streak is ${st.current} day${st.current > 1 ? 's' : ''}. Study a little today to keep it going.`
                : 'Start a streak today. Even 20 minutes counts.'}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button onClick={() => go('labs', 'new')}>
              <IconFlag3 />
              Add lab
            </Button>
            <Button variant="primary" onClick={() => go('journal', 'new')}>
              <IconPlus />
              Log today
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stagger mb-5 grid grid-cols-4 gap-4">
        <Stat icon={<IconFlame />} label="Streak" value={<>{st.current}<span className="ml-1 text-sm font-medium text-muted">days</span></>} sub={`Best: ${st.best} days`} accent="#fb923c">
          <div className="flex gap-1 pb-1">
            {last7.map((on, i) => (
              <span key={i} title={on ? 'Studied' : 'No study'} className={cn('h-6 w-1.5 rounded-full', on ? 'bg-[#fb923c] shadow-[0_0_8px_#fb923c80]' : 'bg-card-2')} />
            ))}
          </div>
        </Stat>
        <Stat icon={<IconClock />} label="This week" value={fmtHours(week)} sub={`Goal: ${goalH}h per week`} accent="var(--accent-2)">
          <Ring value={(week / 60 / Math.max(goalH, 1)) * 100} size={48} color="var(--accent-2)">
            {Math.min(999, Math.round((week / 60 / Math.max(goalH, 1)) * 100))}%
          </Ring>
        </Stat>
        <Stat icon={<IconRoute />} label="Topics done" value={<>{topicsDone}<span className="ml-1 text-sm font-medium text-muted">/ {data.topics.length}</span></>} sub={`${data.topics.filter((t) => t.status === 'learning').length} in progress`}>
          <Ring value={data.topics.length ? (topicsDone / data.topics.length) * 100 : 0} size={48}>
            {data.topics.length ? Math.round((topicsDone / data.topics.length) * 100) : 0}%
          </Ring>
        </Stat>
        <Stat icon={<IconTrophy />} label="Labs solved" value={labsDone} sub={`${labsMonth} this month · ${data.labs.filter((l) => l.status === 'doing').length} in progress`} accent="#a78bfa">
          <div className="flex items-end gap-[3px] pb-1">
            {['easy', 'medium', 'hard', 'insane'].map((d, i) => {
              const n = data.labs.filter((l) => l.status === 'done' && l.difficulty === d).length
              return <span key={d} title={`${d}: ${n}`} className="w-2 rounded-sm" style={{ height: 6 + Math.min(n, 6) * 4, background: ['#34d399', '#facc15', '#fb923c', '#f87171'][i], opacity: n ? 1 : 0.2 }} />
            })}
          </div>
        </Stat>
      </div>

      {/* Charts */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader icon={<IconActivity />} title="Study time" sub={`Last 30 days · ${total30.toFixed(1)} hours in total`} />
          <div className="h-[220px] px-2 pb-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 8, right: 16, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillStudy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--faint)', fontSize: 11 }} interval={4} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--faint)', fontSize: 11 }} allowDecimals={false} width={36} />
                <Tooltip content={<ChartTip />} cursor={{ stroke: 'var(--border-strong)' }} />
                <Area type="monotone" dataKey="hours" stroke="var(--accent)" strokeWidth={2} fill="url(#fillStudy)" activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--accent)' }} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader icon={<IconChartRadar />} title="Skill map" sub="Progress in each area" />
          <div className="h-[220px] pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={progress.map((p) => ({ name: p.area.name.split(' ')[0], pct: p.pct }))} outerRadius="70%">
                <PolarGrid stroke="var(--border-strong)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 10.5 }} />
                <Radar dataKey="pct" stroke="var(--accent-2)" fill="var(--accent-2)" fillOpacity={0.22} strokeWidth={1.8} animationDuration={900} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader icon={<IconCalendar />} title="Activity" sub="Each square is one day. Darker means more study time." />
          <div className="flex gap-3 px-5 pb-5">
            <div className="flex flex-col justify-around text-[10px] text-faint">
              {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((d, i) => (
                <span key={i} className="leading-none">{d || '\u00a0'}</span>
              ))}
            </div>
            <div className="grid flex-1 gap-[4px]" style={{ gridTemplateColumns: `repeat(${heat.length}, minmax(0, 1fr))` }}>
              {heat.map((col, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  {col.map((c) => {
                    const lvl = c.minutes === 0 ? 0 : c.minutes < 30 ? 1 : c.minutes < 60 ? 2 : c.minutes < 90 ? 3 : 4
                    return (
                      <span
                        key={c.date}
                        title={`${fmtDate(c.date)} · ${c.minutes} min`}
                        className={cn('aspect-square w-full rounded-[4px] transition-transform hover:scale-125', c.future && 'opacity-0')}
                        style={{ background: lvl === 0 ? 'var(--card-2)' : `color-mix(in srgb, var(--accent) ${[0, 30, 55, 78, 100][lvl]}%, var(--card-2))`, boxShadow: lvl === 4 ? '0 0 10px color-mix(in srgb, var(--accent) 45%, transparent)' : undefined }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-1.5 px-5 pb-4 text-[10.5px] text-faint">
            Less
            {[0, 30, 55, 78, 100].map((p) => (
              <span key={p} className="size-[11px] rounded-[3px]" style={{ background: p ? `color-mix(in srgb, var(--accent) ${p}%, var(--card-2))` : 'var(--card-2)' }} />
            ))}
            More
          </div>
        </Card>
        <Card>
          <CardHeader icon={<IconTarget />} title="Coming up" action={<Button variant="ghost" size="sm" onClick={() => go('goals')}>All<IconArrowRight /></Button>} />
          <div className="flex flex-col px-3 pb-3">
            {upcoming.length === 0 && <p className="px-2 py-6 text-center text-[13px] text-muted">No deadlines. Add a goal to stay on track.</p>}
            {upcoming.map((u) => {
              const due = dueLabel(u.date)
              return (
                <button key={u.id} onClick={() => go(u.kind === 'goal' ? 'goals' : 'certs', u.id)} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-card-2">
                  <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4', u.kind === 'goal' ? 'bg-accent-soft text-accent' : 'bg-violet-500/10 text-violet-500 dark:text-violet-400')}>
                    {u.kind === 'goal' ? <IconTarget /> : <IconCertificate />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{u.title}</div>
                    <div className="text-[11px] text-faint">{u.kind === 'goal' ? 'Goal' : `Certification · ${'progress' in u ? u.progress : 0}% ready`}</div>
                  </div>
                  <Badge tone={due.tone === 'danger' ? 'danger' : due.tone === 'warn' ? 'warn' : 'muted'}>{due.text}</Badge>
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader icon={<IconRoute />} title="Skill areas" action={<Button variant="ghost" size="sm" onClick={() => go('roadmap')}>Roadmap<IconArrowRight /></Button>} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-3 pb-4">
            {progress.map((p) => (
              <button key={p.area.id} onClick={() => go('roadmap', p.area.id)} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-card-2">
                <AreaGlyph icon={p.area.icon} color={p.area.color} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="truncate text-[13px] font-medium">{p.area.name}</span>
                    <span className="font-mono text-[11px] text-faint">{p.done}/{p.total}</span>
                  </div>
                  <Progress value={p.pct} color={p.area.color} />
                </div>
              </button>
            ))}
          </div>
          {learningNow.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
              <span className="text-xs text-muted">Learning now:</span>
              {learningNow.map((t) => (
                <Badge key={t.id} tone="info" dot>{t.title}</Badge>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader icon={<IconNotebook />} title="Recent activity" action={<Button variant="ghost" size="sm" onClick={() => go('journal')}>Journal<IconArrowRight /></Button>} />
          <div className="relative px-5 pb-4">
            {recent.length === 0 && <p className="py-6 text-center text-[13px] text-muted">Nothing yet. Write your first journal entry!</p>}
            <div className="absolute top-2 bottom-6 left-[29px] w-px bg-line" />
            {recent.map((r) => (
              <button key={r.id + r.kind} onClick={() => go(r.kind === 'log' ? 'journal' : r.kind === 'lab' ? 'labs' : 'goals', r.id)} className="relative flex w-full cursor-pointer items-start gap-3 rounded-lg py-2 text-left hover:opacity-80">
                <span className={cn('relative z-10 mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border-2 border-card [&_svg]:size-2.5', r.kind === 'log' ? 'bg-accent text-accent-fg' : r.kind === 'lab' ? 'bg-violet-400 text-white' : 'bg-amber-400 text-black')}>
                  {r.kind === 'log' ? <IconNotebook /> : r.kind === 'lab' ? <IconFlag3 /> : <IconCircleCheck />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{r.title}</div>
                  <div className="text-[11px] text-faint">
                    {fmtDate(r.date, 'EEE d MMM')}
                    {r.meta && ` · ${r.meta}`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
