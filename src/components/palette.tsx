import { Command } from 'cmdk'
import * as D from '@radix-ui/react-dialog'
import { IconBooks, IconCertificate, IconFlag3, IconMoon, IconNotebook, IconPlus, IconRoute, IconSettings, IconTarget } from '@tabler/icons-react'
import { useState, type ReactNode } from 'react'
import { useStore } from '@/lib/store'
import { NAV } from './shell'
import { Kbd } from './ui'
import { fmtDate } from '@/lib/utils'

function Item({ value, onSelect, icon, children, meta }: { value: string; onSelect: () => void; icon: ReactNode; children: ReactNode; meta?: ReactNode }): React.JSX.Element {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex h-10 cursor-pointer items-center gap-3 rounded-[10px] px-3 text-[13px] text-muted data-[selected=true]:bg-card-2 data-[selected=true]:text-fg [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-faint data-[selected=true]:[&_svg]:text-accent"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {meta && <span className="shrink-0 text-[11px] text-faint">{meta}</span>}
    </Command.Item>
  )
}

const group = 'px-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.1em] [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase'

export function CommandPalette(): React.JSX.Element {
  const s = useStore()
  const [q, setQ] = useState('')
  const { go } = s
  const areaName = (id?: string): string => s.areas.find((a) => a.id === id)?.name ?? ''
  return (
    <D.Root
      open={s.paletteOpen}
      onOpenChange={(o) => {
        s.setPalette(o)
        if (!o) setQ('')
      }}
    >
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-fade-in" />
        <D.Content aria-describedby={undefined} className="fixed top-[14%] left-1/2 z-50 w-[620px] max-w-[92vw] -translate-x-1/2 outline-none animate-fade-up">
          <D.Title className="sr-only">Command palette</D.Title>
          <Command loop className="card overflow-hidden !rounded-[16px] !shadow-2xl">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <svg className="size-4 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <Command.Input value={q} onValueChange={setQ} autoFocus placeholder="Search notes, labs, topics… or type a command" className="h-13 flex-1 bg-transparent text-sm outline-none placeholder:text-faint" />
              <Kbd>Esc</Kbd>
            </div>
            <Command.List className="max-h-[420px] overflow-y-auto pb-2">
              <Command.Empty className="py-10 text-center text-[13px] text-muted">No results. Try another word.</Command.Empty>
              <Command.Group heading="Create" className={group}>
                <Item value="new journal entry log today" onSelect={() => go('journal', 'new')} icon={<IconPlus />} meta="Journal">New journal entry</Item>
                <Item value="new lab ctf room box challenge" onSelect={() => go('labs', 'new')} icon={<IconPlus />} meta="Labs">New lab / CTF</Item>
                <Item value="new resource course book video" onSelect={() => go('resources', 'new')} icon={<IconPlus />} meta="Resources">New resource</Item>
                <Item value="new goal deadline" onSelect={() => go('goals', 'new')} icon={<IconPlus />} meta="Goals">New goal</Item>
                <Item value="new certification exam" onSelect={() => go('certs', 'new')} icon={<IconPlus />} meta="Certifications">New certification</Item>
              </Command.Group>
              <Command.Group heading="Go to" className={group}>
                {NAV.map((n) => (
                  <Item key={n.page} value={`go ${n.label} ${n.hint}`} onSelect={() => go(n.page)} icon={<n.icon />} meta={n.hint}>
                    {n.label}
                  </Item>
                ))}
                <Item value="go settings backup export import" onSelect={() => go('settings')} icon={<IconSettings />} meta="Backup, theme, data">Settings</Item>
                <Item
                  value="toggle theme dark light mode"
                  onSelect={() => {
                    s.setSettings({ theme: s.settings.theme === 'dark' ? 'light' : 'dark' })
                    s.setPalette(false)
                  }}
                  icon={<IconMoon />}
                >
                  Switch to {s.settings.theme === 'dark' ? 'light' : 'dark'} theme
                </Item>
              </Command.Group>
              {q.trim() && (
                <>
              <Command.Group heading="Journal" className={group}>
                {s.logs.map((l) => (
                  <Item key={l.id} value={`log ${l.title} ${l.tags.join(' ')} ${l.body.slice(0, 200)} ${l.id}`} onSelect={() => go('journal', l.id)} icon={<IconNotebook />} meta={fmtDate(l.date)}>
                    {l.title || 'Untitled entry'}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="Labs & CTFs" className={group}>
                {s.labs.map((l) => (
                  <Item key={l.id} value={`lab ${l.name} ${l.platform} ${l.tags.join(' ')} ${l.id}`} onSelect={() => go('labs', l.id)} icon={<IconFlag3 />} meta={l.platform}>
                    {l.name}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="Roadmap topics" className={group}>
                {s.topics.map((t) => (
                  <Item key={t.id} value={`topic ${t.title} ${areaName(t.areaId)} ${t.id}`} onSelect={() => go('roadmap', t.areaId)} icon={<IconRoute />} meta={areaName(t.areaId)}>
                    {t.title}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="Resources" className={group}>
                {s.resources.map((r) => (
                  <Item key={r.id} value={`resource ${r.title} ${r.kind} ${r.url} ${r.id}`} onSelect={() => go('resources', r.id)} icon={<IconBooks />} meta={r.kind}>
                    {r.title}
                  </Item>
                ))}
              </Command.Group>
              <Command.Group heading="Certifications & goals" className={group}>
                {s.certs.map((c) => (
                  <Item key={c.id} value={`cert ${c.name} ${c.provider} ${c.id}`} onSelect={() => go('certs', c.id)} icon={<IconCertificate />} meta={c.provider}>
                    {c.name}
                  </Item>
                ))}
                {s.goals.map((g) => (
                  <Item key={g.id} value={`goal ${g.title} ${g.id}`} onSelect={() => go('goals', g.id)} icon={<IconTarget />} meta={g.deadline ? fmtDate(g.deadline) : ''}>
                    {g.title}
                  </Item>
                ))}
              </Command.Group>
                </>
              )}
            </Command.List>
            <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[11px] text-faint">
              <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
              <span className="flex items-center gap-1.5"><Kbd>Enter</Kbd> open</span>
              <span className="ml-auto">kryfsec</span>
            </div>
          </Command>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
