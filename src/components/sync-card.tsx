import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { IconAlertTriangle, IconCloudLock, IconCopy, IconEye, IconEyeOff, IconKey, IconLinkOff, IconRefresh } from '@tabler/icons-react'
import { toast } from 'sonner'
import { timeAgo } from '@/sync-core'
import { sync, useSync } from '@/lib/sync'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button, Card, CardHeader, Input } from './ui'
import { confirm } from './dialog'

function useNow(ms = 30_000): number {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

/** "Synced 2 min ago", "Syncing…", "Offline – will try again". */
export function SyncStatusLine({ className }: { className?: string }): React.JSX.Element {
  const s = useSync()
  const now = useNow()
  const [tone, text] = s.busy
    ? (['busy', 'Syncing…'] as const)
    : s.error
      ? (['bad', s.error] as const)
      : s.offline
        ? (['warn', `Offline – will try again${s.lastSync ? ` · last synced ${timeAgo(s.lastSync, now)}` : ''}`] as const)
        : s.lastSync
          ? (['ok', `Synced ${timeAgo(s.lastSync, now)}`] as const)
          : (['warn', 'Not synced yet'] as const)
  return (
    <div className={cn('flex items-center gap-2 text-[13px]', className)}>
      <span
        className={cn(
          'size-2 shrink-0 rounded-full',
          tone === 'ok' && 'bg-success',
          tone === 'busy' && 'animate-pulse bg-accent',
          tone === 'warn' && 'bg-warn',
          tone === 'bad' && 'bg-danger'
        )}
      />
      <span className={cn(tone === 'bad' ? 'text-danger' : 'text-fg')}>{text}</span>
      {s.conflicts > 0 && !s.busy && <span className="text-muted">· {s.conflicts} conflict {s.conflicts === 1 ? 'copy' : 'copies'} made</span>}
    </div>
  )
}

function KeyQr({ text }: { text: string }): React.JSX.Element {
  const theme = useStore((s) => s.settings.theme)
  const [src, setSrc] = useState('')
  useEffect(() => {
    void QRCode.toDataURL(text, {
      margin: 1,
      width: 320,
      errorCorrectionLevel: 'M',
      // Always dark on light: some phone scanners cannot read inverted codes.
      color: theme === 'dark' ? { dark: '#1c1c1b', light: '#cfcfca' } : { dark: '#1f1f1e', light: '#ffffff' }
    }).then(setSrc)
  }, [text, theme])
  return (
    <div className="flex size-[164px] shrink-0 items-center justify-center rounded-xl border border-line bg-card-2 p-2">
      {src ? <img src={src} alt="Sync key QR code" className="size-full rounded-md [image-rendering:pixelated]" /> : null}
    </div>
  )
}

export function SyncCard(): React.JSX.Element {
  const s = useSync()
  const [joining, setJoining] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [working, setWorking] = useState(false)
  const key = s.paired ? sync.keyText() : null

  const turnOn = async (): Promise<void> => {
    setWorking(true)
    try {
      await sync.create()
      setShowKey(true)
      toast.success('Sync is on', { description: 'Scan the QR code with the kryfsec phone app.' })
    } catch (e) {
      toast.error('Could not turn on sync', { description: String((e as Error).message ?? e) })
    } finally {
      setWorking(false)
    }
  }

  const join = async (): Promise<void> => {
    const ok = await confirm(
      'Join this sync?',
      'Entries you made on this computer are kept and added. The starter roadmap and examples here are replaced by the ones from your other device.',
      'Join'
    )
    if (!ok) return
    setWorking(true)
    try {
      await sync.join(keyInput)
      setJoining(false)
      setKeyInput('')
      toast.success('Joined', { description: 'This computer now syncs with your other devices.' })
    } catch (e) {
      toast.error('Could not join', { description: String((e as Error).message ?? e) })
    } finally {
      setWorking(false)
    }
  }

  const unpair = async (): Promise<void> => {
    const ok = await confirm(
      'Turn off sync on this computer?',
      'Your data stays on this computer. Other devices keep syncing with each other. To turn sync on again here you need the sync key.',
      'Turn off'
    )
    if (!ok) return
    await sync.unpair()
    setShowKey(false)
    toast.success('Sync turned off on this computer')
  }

  const copy = async (): Promise<void> => {
    if (!key) return
    await navigator.clipboard.writeText(key)
    toast.success('Sync key copied')
  }

  return (
    <Card>
      <CardHeader
        icon={<IconCloudLock />}
        title="Sync"
        sub="Keep this computer and the kryfsec phone app in sync. End-to-end encrypted: the server only stores locked data it cannot read."
      />
      {!s.paired ? (
        <div className="border-t border-line px-5 py-4">
          {!joining ? (
            <div className="flex items-center gap-6">
              <div className="min-w-0 flex-1 text-xs text-muted">No account needed. Turn on sync here, then scan the QR code with your phone. Already use sync on another device? Join with its key.</div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" onClick={() => setJoining(true)}>
                  <IconKey />I have a key
                </Button>
                <Button variant="primary" disabled={working} onClick={turnOn}>
                  <IconCloudLock />
                  Turn on sync
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-xs text-muted">Paste the sync key from your other device (Settings → Sync → Copy key). It starts with KS1-.</div>
              <div className="flex gap-2">
                <Input autoFocus value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="KS1-XXXX-XXXX-…" className="font-mono text-xs" onKeyDown={(e) => e.key === 'Enter' && keyInput.trim() && void join()} />
                <Button variant="ghost" onClick={() => setJoining(false)}>
                  Cancel
                </Button>
                <Button variant="primary" disabled={!keyInput.trim() || working} onClick={join}>
                  Join
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-5 border-t border-line px-5 py-4">
            {key && <KeyQr text={key} />}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <SyncStatusLine />
              <div className="text-xs text-muted">Scan this code in the kryfsec phone app (Settings → Sync), or paste the key there. Syncs when the app opens, a few seconds after you change something, and every few minutes.</div>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-md border border-line bg-card-2 px-2.5 py-1.5 font-mono text-[11.5px] text-fg">{key ? (showKey ? key : `${key.slice(0, 8)}-••••-••••-••••-••••-…`) : ''}</code>
                <Button size="icon-sm" variant="ghost" title={showKey ? 'Hide key' : 'Show key'} onClick={() => setShowKey(!showKey)}>
                  {showKey ? <IconEyeOff /> : <IconEye />}
                </Button>
                <Button size="sm" onClick={copy}>
                  <IconCopy />
                  Copy key
                </Button>
              </div>
              <div className="flex gap-2 rounded-lg border border-warn/25 bg-warn/8 px-3 py-2 text-xs text-fg">
                <IconAlertTriangle size={15} className="mt-px shrink-0 text-warn" />
                <span>Save this key somewhere safe, like a password manager. It is the only way to reach your synced data. If you lose it, nobody can recover the synced copy, not even us. Data on your devices stays.</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
            <Button variant="ghost" onClick={unpair}>
              <IconLinkOff />
              Turn off sync
            </Button>
            <Button disabled={s.busy} onClick={() => void sync.syncNow()}>
              <IconRefresh className={cn(s.busy && 'animate-spin')} />
              Sync now
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}
