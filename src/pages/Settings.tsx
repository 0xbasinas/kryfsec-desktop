import { useEffect, useState } from 'react'
import { IconDatabase, IconDownload, IconFileTypography, IconFolderOpen, IconKeyboard, IconMoon, IconPalette, IconRefresh, IconSettings, IconSparkles, IconSun, IconTrash, IconUpload, IconUser } from '@tabler/icons-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { normalize, pickData, useStore } from '@/lib/store'
import { toMarkdown } from '@/lib/export'
import { cn } from '@/lib/utils'
import { Button, Card, CardHeader, Field, Input, Kbd, PageHeader } from '@/components/ui'
import { confirm } from '@/components/dialog'

function Row({ title, text, children }: { title: string; text: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-center gap-6 border-t border-line px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-muted">{text}</div>
      </div>
      <div className="flex shrink-0 gap-2">{children}</div>
    </div>
  )
}

export default function Settings(): React.JSX.Element {
  const s = useStore()
  const [path, setPath] = useState('')
  const [version, setVersion] = useState('')
  useEffect(() => {
    void window.api.dataPath().then(setPath)
    void window.api.version().then(setVersion)
  }, [])
  const stamp = format(new Date(), 'yyyy-MM-dd')
  const sampleCount = [s.logs, s.labs, s.resources, s.certs, s.goals].reduce((a, l) => a + l.filter((x) => x.sample).length, 0)

  const exportJson = async (): Promise<void> => {
    const p = await window.api.saveFile(`cyberjourney-backup-${stamp}.json`, JSON.stringify(pickData(s), null, 2), [{ name: 'JSON backup', extensions: ['json'] }])
    if (p) toast.success('Backup saved', { description: p })
  }
  const exportMd = async (): Promise<void> => {
    const p = await window.api.saveFile(`cyberjourney-${stamp}.md`, toMarkdown(pickData(s)), [{ name: 'Markdown', extensions: ['md'] }])
    if (p) toast.success('Markdown exported', { description: p })
  }
  const importJson = async (): Promise<void> => {
    const text = await window.api.openFile([{ name: 'JSON backup', extensions: ['json'] }])
    if (!text) return
    let data
    try {
      data = normalize(JSON.parse(text))
    } catch {
      data = null
    }
    if (!data) {
      toast.error('This file is not a CyberJourney backup')
      return
    }
    if (await confirm('Replace your data?', `The backup has ${data.logs.length} journal entries and ${data.labs.length} labs. Your current data will be replaced. Tip: export a backup first.`, 'Replace')) {
      s.replaceAll(data)
      toast.success('Backup imported')
    }
  }

  return (
    <div className="mx-auto max-w-[860px] px-8 pt-7 pb-12">
      <PageHeader icon={<IconSettings />} title="Settings" sub="Profile, look and feel, and your data" />
      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader icon={<IconUser />} title="Profile" />
          <div className="grid grid-cols-2 gap-4 px-5 pb-5">
            <Field label="Your name" hint="Shown on the dashboard greeting.">
              <Input value={s.settings.name} onChange={(e) => s.setSettings({ name: e.target.value })} placeholder="e.g. Giorgos" />
            </Field>
            <Field label="Weekly study goal (hours)" hint="Used for the weekly progress ring.">
              <Input type="number" min={1} max={80} value={s.settings.weeklyGoalHours} onChange={(e) => s.setSettings({ weeklyGoalHours: Math.max(1, Math.min(80, Number(e.target.value) || 1)) })} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader icon={<IconPalette />} title="Appearance" />
          <div className="grid grid-cols-2 gap-4 px-5 pb-4">
            {(['dark', 'light'] as const).map((t) => (
              <button key={t} onClick={() => s.setSettings({ theme: t })} className={cn('cursor-pointer overflow-hidden rounded-xl border-2 text-left transition-all', s.settings.theme === t ? 'border-accent' : 'border-line hover:border-line-strong')}>
                <div className={cn('flex h-24 gap-2 p-3', t === 'dark' ? 'bg-[#161615]' : 'bg-[#f7f7f5]')}>
                  <div className={cn('w-12 rounded-md', t === 'dark' ? 'bg-[#1c1c1b] ring-1 ring-white/5' : 'bg-white ring-1 ring-black/5')} />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className={cn('h-8 rounded-md', t === 'dark' ? 'bg-[#1c1c1b] ring-1 ring-white/5' : 'bg-white ring-1 ring-black/5')} />
                    <div className="flex gap-2">
                      <div className={cn('h-8 flex-1 rounded-md', t === 'dark' ? 'bg-[#1c1c1b] ring-1 ring-white/5' : 'bg-white ring-1 ring-black/5')} />
                      <div className="h-8 w-8 rounded-md bg-accent/70" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-line bg-card px-3 py-2 text-[13px] font-medium">
                  {t === 'dark' ? <IconMoon size={15} /> : <IconSun size={15} />}
                  {t === 'dark' ? 'Dark' : 'Light'}
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-5 pb-5">
            <span className="text-xs font-medium text-muted">Accent color</span>
            {(
              [
                ['periwinkle', 'var(--c-periwinkle)'],
                ['sage', 'var(--c-sage)'],
                ['rose', 'var(--c-rose)']
              ] as const
            ).map(([a, c]) => (
              <button key={a} onClick={() => s.setSettings({ accent: a })} title={a} className={cn('size-7 cursor-pointer rounded-full ring-offset-2 ring-offset-card transition-all', s.settings.accent === a && 'ring-2')} style={{ background: c, ['--tw-ring-color' as string]: c }} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader icon={<IconDatabase />} title="Your data" sub="Everything is saved on this computer only. Nothing is sent online." />
          <Row title="Export backup" text="Save all your data as one JSON file. Keep it safe, e.g. in Google Drive.">
            <Button onClick={exportJson}>
              <IconDownload />
              Export JSON
            </Button>
          </Row>
          <Row title="Import backup" text="Load a JSON backup. This replaces your current data.">
            <Button onClick={importJson}>
              <IconUpload />
              Import JSON
            </Button>
          </Row>
          <Row title="Export as Markdown" text="One readable .md file with your roadmap, journal, labs and write-ups.">
            <Button onClick={exportMd}>
              <IconFileTypography />
              Export Markdown
            </Button>
          </Row>
          <Row title="Data file" text={path || '…'}>
            <Button variant="ghost" onClick={() => window.api.revealData()}>
              <IconFolderOpen />
              Show
            </Button>
          </Row>
        </Card>

        <Card>
          <CardHeader icon={<IconSparkles />} title="Sample data" sub="The app starts with example entries so you can see how it works." />
          <Row title="Remove sample data" text={sampleCount ? `Deletes ${sampleCount} example entries (journal, labs, resources, certifications, goals) and resets the starter roadmap to "not started". Your own entries stay.` : 'No sample data left. 👍'}>
            <Button
              variant="danger"
              disabled={!sampleCount}
              onClick={async () => {
                if (await confirm('Remove sample data?', 'Example entries will be deleted. The roadmap topics stay, but their status goes back to "not started".', 'Remove')) {
                  s.clearSample()
                  toast.success('Sample data removed')
                }
              }}
            >
              <IconTrash />
              Remove
            </Button>
          </Row>
          <Row title="Start fresh" text="Delete everything and keep only an empty starter roadmap.">
            <Button
              variant="danger"
              onClick={async () => {
                if (await confirm('Delete everything?', 'All your journal entries, labs, resources, certifications and goals will be deleted. Export a backup first if you are not sure.', 'Delete all')) {
                  s.resetEmpty()
                  toast.success('Started fresh')
                }
              }}
            >
              Start fresh
            </Button>
          </Row>
          <Row title="Load sample data again" text="Replace everything with the example data.">
            <Button
              onClick={async () => {
                if (await confirm('Load sample data?', 'Your current data will be replaced with the example data.', 'Load samples')) s.resetSample()
              }}
            >
              <IconRefresh />
              Load samples
            </Button>
          </Row>
        </Card>

        <Card>
          <CardHeader icon={<IconKeyboard />} title="Keyboard shortcuts" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 px-5 pb-5 text-[13px]">
            {[
              [['Ctrl', 'K'], 'Search and commands'],
              [['Ctrl', 'J'], 'New journal entry'],
              [['Ctrl', 'B'], 'Bold (in editor)'],
              [['Ctrl', 'I'], 'Italic (in editor)']
            ].map(([keys, label]) => (
              <div key={label as string} className="flex items-center justify-between">
                <span className="text-muted">{label as string}</span>
                <span className="flex gap-1">
                  {(keys as string[]).map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <p className="text-center text-[11px] text-faint">CyberJourney {version} · made for your learning journey</p>
      </div>
    </div>
  )
}
