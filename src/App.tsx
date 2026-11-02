import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { useStore } from './lib/store'
import type { Page } from './lib/types'
import { Sidebar, TitleBar } from './components/shell'
import { CommandPalette } from './components/palette'
import { ConfirmHost } from './components/dialog'
import { Kit, useKit } from './components/kit'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Journal from './pages/Journal'
import Labs from './pages/Labs'
import Resources from './pages/Resources'
import Certs from './pages/Certs'
import Goals from './pages/Goals'
import Settings from './pages/Settings'

const PAGES: Record<Page, () => React.JSX.Element> = {
  dashboard: Dashboard,
  roadmap: Roadmap,
  journal: Journal,
  labs: Labs,
  resources: Resources,
  certs: Certs,
  goals: Goals,
  settings: Settings
}

// QA hook used by the screenshot runner (CJ_SCREENSHOT_DIR). Harmless otherwise.
window.__cj = (script: string) => {
  const s = useStore.getState()
  for (const cmd of script.split(';')) {
    const [op, a, b] = cmd.split(':')
    if (op === 'page') s.go(a as Page)
    if (op === 'open') {
      const st = useStore.getState()
      const list = { labs: st.labs, journal: st.logs, resources: st.resources, certs: st.certs, goals: st.goals, roadmap: st.areas }[a] as { id: string }[] | undefined
      const id = b === 'new' ? 'new' : list?.[Number(b) || 0]?.id
      if (id) s.go(a as Page, id)
    }
    if (op === 'palette') {
      s.setPalette(true)
      if (a)
        setTimeout(() => {
          const el = document.querySelector<HTMLInputElement>('[cmdk-input]')
          if (el) {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
            setter.call(el, a)
            el.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }, 200)
    }
    if (op === 'close') s.setPalette(false)
    if (op === 'kit') useKit.setState({ on: a === 'on' })
    if (op === 'theme') s.setSettings({ theme: a as 'dark' | 'light' })
    if (op === 'scroll') document.querySelector('main')?.scrollTo({ top: Number(a) })
  }
}

export default function App(): React.JSX.Element {
  const loaded = useStore((s) => s.loaded)
  const page = useStore((s) => s.page)
  const theme = useStore((s) => s.settings.theme)
  const accent = useStore((s) => s.settings.accent)

  useEffect(() => {
    void useStore.getState().load()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.accent = accent
    window.api.setTheme(theme)
  }, [theme, accent])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const s = useStore.getState()
        s.setPalette(!s.paletteOpen)
      }
      if (mod && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        useStore.getState().go('journal', 'new')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const PageView = PAGES[page]
  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <TitleBar />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="relative min-w-0 flex-1 overflow-y-auto">
            {loaded && (
              <div key={page} className="animate-fade-up">
                <PageView />
              </div>
            )}
          </main>
        </div>
        <CommandPalette />
        <ConfirmHost />
        <Kit />
        <Toaster
          theme={theme}
          position="bottom-right"
          toastOptions={{ style: { background: 'var(--card)', border: '1px solid var(--border-strong)', color: 'var(--fg)', fontSize: 13, borderRadius: 14 } }}
        />
      </div>
    </TooltipProvider>
  )
}
