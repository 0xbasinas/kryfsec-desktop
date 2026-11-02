import {
  IconBooks,
  IconCertificate,
  IconFlag3,
  IconLayoutDashboard,
  IconMoon,
  IconNotebook,
  IconRoute,
  IconSearch,
  IconSettings,
  IconSun,
  IconTarget,
  type Icon
} from '@tabler/icons-react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '@/lib/store'
import type { Page } from '@/lib/types'
import { cn, fmtHours } from '@/lib/utils'
import { weekMinutes } from '@/lib/stats'
import { Kbd, Progress, Tip } from './ui'

export const NAV: { page: Page; label: string; icon: Icon; hint: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: IconLayoutDashboard, hint: 'Overview of your progress' },
  { page: 'roadmap', label: 'Roadmap', icon: IconRoute, hint: 'Skill areas and topics' },
  { page: 'journal', label: 'Journal', icon: IconNotebook, hint: 'Daily learning notes' },
  { page: 'labs', label: 'Labs & CTFs', icon: IconFlag3, hint: 'Rooms, boxes and challenges' },
  { page: 'resources', label: 'Resources', icon: IconBooks, hint: 'Courses, books, videos, platforms' },
  { page: 'certs', label: 'Certifications', icon: IconCertificate, hint: 'Exams you want to pass' },
  { page: 'goals', label: 'Goals', icon: IconTarget, hint: 'Things to finish, with deadlines' }
]

/** Top gap above the main panel: a drag strip with the floating search pill.
 *  On Windows/Linux the native min/max/close overlay sits in the right part of this strip. */
export function TopGap(): React.JSX.Element {
  const setPalette = useStore((s) => s.setPalette)
  const isMac = window.api.platform === 'darwin'
  return (
    <div
      className="drag flex h-12 shrink-0 items-center justify-center"
      style={{ paddingRight: isMac ? 8 : 'calc(100vw - env(titlebar-area-x, 0px) - env(titlebar-area-width, 100vw) + 8px)' }}
    >
      <button
        id="search-pill"
        onClick={() => setPalette(true)}
        className="no-drag flex h-8 w-[300px] max-w-full cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-3 text-xs text-faint shadow-(--shadow) transition-colors hover:border-line-strong hover:text-muted"
      >
        <IconSearch size={14} />
        <span className="flex-1 text-left">Search or run a command…</span>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </button>
    </div>
  )
}

function ThemeSwitch(): React.JSX.Element {
  const theme = useStore((s) => s.settings.theme)
  const setSettings = useStore((s) => s.setSettings)
  const opt = (t: 'light' | 'dark', I: Icon, label: string): React.JSX.Element => (
    <Tip label={label} side="top">
      <button
        onClick={() => setSettings({ theme: t })}
        aria-label={label}
        aria-pressed={theme === t}
        className={cn(
          'grid size-7 cursor-pointer place-items-center rounded-full transition-colors',
          theme === t ? 'bg-card-2 text-fg shadow-[inset_0_0_0_1px_var(--border)]' : 'text-faint hover:text-fg'
        )}
      >
        <I size={15} stroke={1.8} />
      </button>
    </Tip>
  )
  return (
    <div id="theme-switch" className="flex shrink-0 items-center gap-0.5 rounded-full border border-line bg-card p-0.5">
      {opt('light', IconSun, 'Light theme')}
      {opt('dark', IconMoon, 'Dark theme')}
    </div>
  )
}

export function Sidebar(): React.JSX.Element {
  const page = useStore((s) => s.page)
  const go = useStore((s) => s.go)
  const counts = useStore(useShallow((s) => ({
    journal: s.logs.length,
    labs: s.labs.filter((l) => l.status !== 'done').length,
    resources: s.resources.length,
    certs: s.certs.filter((c) => c.status !== 'passed').length,
    goals: s.goals.filter((g) => !g.done).length
  })))
  const logs = useStore((s) => s.logs)
  const labs = useStore((s) => s.labs)
  const goal = useStore((s) => s.settings.weeklyGoalHours)
  const week = weekMinutes({ logs, labs })
  const pct = goal ? (week / 60 / goal) * 100 : 0

  const item = (p: Page, label: string, I: Icon, count?: number): React.JSX.Element => {
    const active = page === p
    return (
      <button
        key={p}
        onClick={() => go(p)}
        className={cn(
          'group relative flex h-9 w-full cursor-pointer items-center gap-3 rounded-full px-3.5 text-[13px] font-medium transition-all',
          active ? 'bg-card text-fg shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-card/70 hover:text-fg'
        )}
      >
        <I size={17} stroke={1.8} className={cn('transition-colors', active ? 'text-accent' : 'text-faint group-hover:text-muted')} />
        <span className="flex-1 text-left">{label}</span>
        {!!count && <span className="font-mono text-[11px] text-faint tabular-nums">{count}</span>}
      </button>
    )
  }

  return (
    <aside className="flex w-[232px] shrink-0 flex-col px-3 pb-2">
      <div className="drag -mx-3 h-12 shrink-0" />
      <div className="px-3 pb-2 text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">Menu</div>
      <nav className="flex flex-col gap-0.5">{NAV.map((n) => item(n.page, n.label, n.icon, (counts as Record<string, number>)[n.page]))}</nav>
      <div className="flex-1" />
      <div className="mb-3 rounded-[16px] border border-line bg-card p-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-muted">This week</span>
          <span className="font-mono text-[11px] text-faint">goal {goal}h</span>
        </div>
        <div className="mt-1 mb-2.5 text-lg font-semibold tabular-nums">
          {fmtHours(week)}
          <span className="ml-1 text-xs font-normal text-muted">studied</span>
        </div>
        <Progress value={pct} />
        <p className="mt-2 text-[11px] text-faint">{pct >= 100 ? 'Weekly goal reached. Great work!' : `${Math.max(0, goal - week / 60).toFixed(1)}h left to reach your goal`}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="min-w-0 flex-1">{item('settings', 'Settings', IconSettings)}</div>
        <ThemeSwitch />
      </div>
    </aside>
  )
}
