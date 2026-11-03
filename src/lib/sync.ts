import { create } from 'zustand'
import { appToSnapshot, dropSamples, KRYFSEC_SCHEMA, snapshotToApp, SyncController, SyncNetworkError, type HttpFn, type KryfsecData, type SyncState, type SyncStatus } from '@/sync-core'
import { normalize, pickData, useStore } from './store'
import type { AppData } from './types'

const http: HttpFn = async (req) => {
  const res = await window.api.sync.http(req)
  if ('network' in res) throw new SyncNetworkError(res.message)
  return res
}

const current = (): AppData => pickData(useStore.getState())
let applying = false

export const sync = new SyncController({
  http,
  storage: {
    loadKey: () => window.api.sync.getKey(),
    saveKey: async (k) => void (await window.api.sync.setKey(k)),
    loadState: async () => (await window.api.sync.loadState()) as SyncState | null,
    saveState: async (s) => void (await window.api.sync.saveState(s))
  },
  schema: KRYFSEC_SCHEMA,
  read: () => appToSnapshot(current() as unknown as KryfsecData),
  write: (snap) => {
    const next = snapshotToApp(snap, current() as unknown as KryfsecData) as unknown as AppData
    applying = true
    try {
      useStore.getState().replaceAll(normalize(next) ?? next)
    } finally {
      applying = false
    }
  },
  onJoin: dropSamples
})

export const useSync = create<SyncStatus>(() => sync.status)
sync.subscribe((s) => useSync.setState(s, true))

let started = false
/** Call once after the app data is loaded. */
export async function startSync(): Promise<void> {
  if (started) return
  started = true
  const st = await sync.init()
  if (st.paired) void sync.syncNow()

  // Sync a few seconds after edits (not after changes that came from sync).
  let last = current()
  useStore.subscribe((s) => {
    if (!s.loaded) return
    const now = pickData(s)
    const changed = (Object.keys(now) as (keyof AppData)[]).some((k) => now[k] !== last[k])
    last = now
    if (changed && !applying) sync.noteEdit()
  })

  // Also when the window comes back, when the network returns, and every 5 minutes.
  const soon = (): void => {
    const s = sync.status
    if (s.paired && !s.busy && (!s.lastSync || Date.now() - s.lastSync > 30_000)) void sync.syncNow()
  }
  window.addEventListener('focus', soon)
  window.addEventListener('online', () => void sync.syncNow())
  setInterval(() => sync.status.paired && void sync.syncNow(), 5 * 60_000)
}
