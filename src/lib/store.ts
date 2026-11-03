import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import type { AppData, Page, Settings } from './types'
import { createRoadmap, createSampleData, DEFAULT_SETTINGS } from './seed'

type Collections = 'areas' | 'topics' | 'logs' | 'resources' | 'labs' | 'certs' | 'goals'
type ItemOf<K extends Collections> = AppData[K][number]

interface UiState {
  loaded: boolean
  page: Page
  /** Item to open when a page mounts (from search / palette). */
  focus: { page: Page; id: string } | null
  paletteOpen: boolean
}

interface Actions {
  load: () => Promise<void>
  go: (page: Page, focusId?: string) => void
  clearFocus: () => void
  setPalette: (open: boolean) => void
  upsert: <K extends Collections>(key: K, item: ItemOf<K>) => void
  remove: <K extends Collections>(key: K, id: string) => void
  setSettings: (patch: Partial<Settings>) => void
  replaceAll: (data: AppData) => void
  clearSample: () => void
  addStarterRoadmap: () => void
  resetEmpty: () => void
  resetSample: () => void
}

export type Store = AppData & UiState & Actions

const EMPTY: AppData = {
  version: 1,
  settings: { ...DEFAULT_SETTINGS },
  areas: [],
  topics: [],
  logs: [],
  resources: [],
  labs: [],
  certs: [],
  goals: []
}

export function pickData(s: AppData): AppData {
  return {
    version: 1,
    settings: s.settings,
    areas: s.areas,
    topics: s.topics,
    logs: s.logs,
    resources: s.resources,
    labs: s.labs,
    certs: s.certs,
    goals: s.goals
  }
}

/** Accepts unknown JSON (file or backup) and returns a safe AppData. */
export function normalize(raw: unknown): AppData | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<AppData>
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
  if (!Array.isArray(r.areas) && !Array.isArray(r.logs)) return null
  const settings = { ...DEFAULT_SETTINGS, ...(r.settings ?? {}) }
  // v0.1 used Tailwind accents/hex colors; map them onto the Radix palette.
  const oldAccent = settings.accent as string
  const ACCENTS: Record<string, AppData['settings']['accent']> = { emerald: 'periwinkle', jade: 'periwinkle', violet: 'periwinkle', iris: 'periwinkle', cyan: 'sage' }
  if (ACCENTS[oldAccent]) settings.accent = ACCENTS[oldAccent]
  if (!['periwinkle', 'sage', 'rose'].includes(settings.accent)) settings.accent = 'periwinkle'
  const OLD: Record<string, string> = { '#22d3ee': 'cyan', '#34d399': 'teal', '#facc15': 'amber', '#fb923c': 'orange', '#f87171': 'red', '#f472b6': 'pink', '#a78bfa': 'violet', '#60a5fa': 'blue' }
  const areas = arr<AppData['areas'][number]>(r.areas).map((a) => (OLD[a.color?.toLowerCase()] ? { ...a, color: `var(--c-${OLD[a.color.toLowerCase()]})` } : a))
  return {
    version: 1,
    settings,
    areas,
    topics: arr(r.topics),
    logs: arr(r.logs),
    resources: arr(r.resources),
    labs: arr(r.labs),
    certs: arr(r.certs),
    goals: arr(r.goals)
  }
}

export const useStore = create<Store>((set, get) => ({
  ...EMPTY,
  loaded: false,
  page: 'dashboard',
  focus: null,
  paletteOpen: false,

  load: async () => {
    const raw = await window.api.loadData().catch(() => null)
    // A first start begins with a clean slate: no roadmap, no entries.
    const data = normalize(raw) ?? { ...EMPTY, settings: { ...DEFAULT_SETTINGS } }
    set({ ...data, loaded: true })
    // Sync starts after the data is in memory (loaded lazily to keep startup fast).
    void import('./sync').then((m) => m.startSync())
  },
  go: (page, focusId) => set({ page, focus: focusId ? { page, id: focusId } : null, paletteOpen: false }),
  clearFocus: () => set({ focus: null }),
  setPalette: (open) => set({ paletteOpen: open }),
  upsert: (key, item) =>
    set((s) => {
      const list = s[key] as ItemOf<typeof key>[]
      const idx = list.findIndex((x) => x.id === item.id)
      const next = idx === -1 ? [item, ...list] : list.map((x) => (x.id === item.id ? item : x))
      return { [key]: next } as Partial<Store>
    }),
  remove: (key, id) =>
    set((s) => {
      const patch: Partial<AppData> = { [key]: (s[key] as { id: string }[]).filter((x) => x.id !== id) }
      if (key === 'areas') patch.topics = s.topics.filter((t) => t.areaId !== id)
      return patch as Partial<Store>
    }),
  setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
  replaceAll: (data) => set({ ...data }),
  clearSample: () =>
    set((s) => ({
      logs: s.logs.filter((x) => !x.sample),
      resources: s.resources.filter((x) => !x.sample),
      labs: s.labs.filter((x) => !x.sample),
      certs: s.certs.filter((x) => !x.sample),
      goals: s.goals.filter((x) => !x.sample),
      topics: s.topics.map((t) => (t.sample ? { ...t, status: 'todo' as const } : t))
    })),
  // Picked on purpose, so not marked `sample` (sync would drop it on join).
  addStarterRoadmap: () =>
    set((s) => {
      const r = createRoadmap(false)
      return {
        areas: [...s.areas, ...r.areas.map((a) => ({ ...a, sample: false }))],
        topics: [...s.topics, ...r.topics.map((t) => ({ ...t, sample: false }))]
      }
    }),
  resetEmpty: () => set({ ...EMPTY, settings: get().settings }),
  resetSample: () => set({ ...createSampleData(), settings: get().settings })
}))

// Debounced auto-save of the data part of the store.
let timer: ReturnType<typeof setTimeout> | undefined
let lastSaved = ''
useStore.subscribe((s) => {
  if (!s.loaded) return
  const data = pickData(s)
  clearTimeout(timer)
  timer = setTimeout(() => {
    const json = JSON.stringify(data)
    if (json === lastSaved) return
    lastSaved = json
    void window.api.saveData(data)
  }, 350)
})

/** Run `handler` once when another screen asks this page to open an item (or 'new'). */
export function useFocus(page: Page, handler: (id: string) => void): void {
  const focus = useStore((s) => s.focus)
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    const f = useStore.getState().focus
    if (f && f.page === page) {
      useStore.setState({ focus: null })
      ref.current(f.id)
    }
  }, [focus, page])
}
