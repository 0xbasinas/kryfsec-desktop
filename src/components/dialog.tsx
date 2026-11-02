import * as D from '@radix-ui/react-dialog'
import { IconX } from '@tabler/icons-react'
import { create } from 'zustand'
import type { ReactNode } from 'react'
import { Button } from './ui'
import { cn } from '@/lib/utils'

export function Modal({ open, onOpenChange, title, description, children, footer, className }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; className?: string }): React.JSX.Element {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-fade-in" />
        <D.Content
          aria-describedby={undefined}
          className={cn('card fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[520px] max-w-[92vw] flex-col overflow-hidden !rounded-2xl !shadow-2xl outline-none animate-pop-in', className)}
        >
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="flex-1">
              <D.Title className="text-[15px] font-semibold">{title}</D.Title>
              {description && <D.Description className="mt-0.5 text-xs text-muted">{description}</D.Description>}
            </div>
            <D.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close">
                <IconX />
              </Button>
            </D.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-line bg-card-2/40 px-5 py-3">{footer}</div>}
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}

export function Sheet({ open, onOpenChange, title, children, header, footer, width = 640 }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: ReactNode; header?: ReactNode; footer?: ReactNode; width?: number }): React.JSX.Element {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-40 bg-black/40 animate-fade-in" />
        <D.Content
          aria-describedby={undefined}
          style={{ width }}
          className="fixed top-12 right-2 bottom-2 z-50 flex max-w-[95vw] flex-col overflow-hidden rounded-[20px] border border-line bg-card shadow-2xl outline-none animate-slide-in"
        >
          <div className="flex items-center gap-3 border-b border-line px-5 py-3">
            <D.Title className="flex-1 truncate text-sm font-semibold">{title}</D.Title>
            {header}
            <D.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close">
                <IconX />
              </Button>
            </D.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}

interface ConfirmState {
  open: boolean
  title: string
  text: string
  action: string
  resolve?: (ok: boolean) => void
}
const useConfirmStore = create<ConfirmState>(() => ({ open: false, title: '', text: '', action: 'Delete' }))

export function confirm(title: string, text: string, action = 'Delete'): Promise<boolean> {
  return new Promise((resolve) => useConfirmStore.setState({ open: true, title, text, action, resolve }))
}

export function ConfirmHost(): React.JSX.Element {
  const s = useConfirmStore()
  const close = (ok: boolean): void => {
    s.resolve?.(ok)
    useConfirmStore.setState({ open: false, resolve: undefined })
  }
  return (
    <Modal
      open={s.open}
      onOpenChange={(o) => !o && close(false)}
      title={s.title}
      className="w-[420px]"
      footer={
        <>
          <Button onClick={() => close(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => close(true)} autoFocus>
            {s.action}
          </Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-muted">{s.text}</p>
    </Modal>
  )
}
