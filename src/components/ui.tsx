import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'icon' | 'icon-sm'

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }>(
  function Button({ className, variant = 'secondary', size = 'md', ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
          variant === 'primary' && 'bg-accent text-accent-fg hover:brightness-105',
          variant === 'secondary' && 'border border-line bg-card-2 text-fg hover:border-line-strong hover:bg-[color-mix(in_srgb,var(--card-2)_80%,var(--fg)_6%)]',
          variant === 'outline' && 'border border-line-strong bg-transparent text-fg hover:bg-card-2',
          variant === 'ghost' && 'text-muted hover:bg-card-2 hover:text-fg',
          variant === 'danger' && 'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20',
          size === 'md' && 'h-9 px-3.5',
          size === 'sm' && 'h-7 gap-1.5 rounded-md px-2.5 text-xs [&_svg]:size-3.5',
          size === 'icon' && 'size-9',
          size === 'icon-sm' && 'size-7 rounded-md [&_svg]:size-3.5',
          className
        )}
        {...props}
      />
    )
  }
)

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ title, icon, action, sub }: { title: ReactNode; icon?: ReactNode; action?: ReactNode; sub?: ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
      {icon && <span className="text-muted [&_svg]:size-4">{icon}</span>}
      <div className="min-w-0 flex-1">
        <h3 className="text-[13px] font-semibold tracking-tight text-fg">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

const fieldBase =
  'w-full rounded-lg border border-line bg-card-2 px-3 text-[13px] text-fg placeholder:text-faint outline-none transition-colors hover:border-line-strong focus:border-accent/60 focus:ring-3 focus:ring-accent/15'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(fieldBase, 'h-9', className)} {...p} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...p }, ref) {
  return <textarea ref={ref} className={cn(fieldBase, 'min-h-20 resize-none py-2 leading-relaxed', className)} {...p} />
})

export function Select({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>): React.JSX.Element {
  return (
    <div className="relative">
      <select className={cn(fieldBase, 'h-9 cursor-pointer appearance-none pr-8', className)} {...p}>
        {children}
      </select>
      <svg className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export function Field({ label, children, hint, className }: { label: string; children: ReactNode; hint?: string; className?: string }): React.JSX.Element {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-faint">{hint}</span>}
    </label>
  )
}

type Tone = 'default' | 'accent' | 'success' | 'warn' | 'danger' | 'info' | 'muted' | 'violet'

const toneCls: Record<Tone, string> = {
  default: 'border-line-strong bg-card-2 text-fg',
  accent: 'border-accent/25 bg-accent-soft text-accent',
  success: 'border-success/20 bg-success/8 text-success',
  warn: 'border-warn/20 bg-warn/8 text-warn',
  danger: 'border-danger/20 bg-danger/8 text-danger',
  info: 'border-info/20 bg-info/8 text-info',
  violet: 'border-accent/20 bg-accent-soft text-accent',
  muted: 'border-line bg-transparent text-muted'
}

export function Badge({ tone = 'default', className, children, dot }: { tone?: Tone; className?: string; children: ReactNode; dot?: boolean }): React.JSX.Element {
  return (
    <span className={cn('inline-flex h-5 shrink-0 items-center gap-1.5 rounded-md border px-1.5 text-[11px] font-medium whitespace-nowrap', toneCls[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function Progress({ value, className, color }: { value: number; className?: string; color?: string }): React.JSX.Element {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-card-2', className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: color ?? 'var(--accent)'
        }}
      />
    </div>
  )
}

export function Ring({ value, size = 44, stroke = 4, color, children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }): React.JSX.Element {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--card-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? 'var(--accent)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(100, value)) / 100)}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[11px] font-semibold tabular-nums">{children}</div>
    </div>
  )
}

export function Segmented<T extends string>({ value, onChange, options, size = 'md' }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; count?: number }[]; size?: 'sm' | 'md' }): React.JSX.Element {
  return (
    <div className="inline-flex rounded-lg border border-line bg-card-2/60 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-md font-medium transition-all [&_svg]:size-3.5',
            size === 'md' ? 'h-7 px-3 text-xs' : 'h-6 px-2 text-[11px]',
            value === o.value ? 'bg-card text-fg shadow-sm ring-1 ring-line-strong' : 'text-muted hover:text-fg'
          )}
        >
          {o.label}
          {o.count !== undefined && <span className={cn('tabular-nums', value === o.value ? 'text-muted' : 'text-faint')}>{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-up">
      <div className="relative mb-4 grid size-14 place-items-center rounded-2xl border border-line bg-card-2 text-accent [&_svg]:size-6">
        <div className="absolute inset-0 rounded-2xl bg-accent/5" />
        <span className="relative">{icon}</span>
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-[13px] text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Kbd({ children }: { children: ReactNode }): React.JSX.Element {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line-strong bg-card-2 px-1 font-mono text-[10px] text-muted">{children}</kbd>
}

export function PageHeader({ title, sub, actions, icon }: { title: string; sub?: string; actions?: ReactNode; icon?: ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-end justify-between gap-4 pb-6">
      <div className="flex items-center gap-3">
        {icon && <div className="grid size-10 place-items-center rounded-xl border border-line bg-card text-accent shadow-sm [&_svg]:size-5">{icon}</div>}
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
          {sub && <p className="mt-0.5 text-[13px] text-muted">{sub}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }): React.JSX.Element {
  return (
    <div className={cn('relative', className)}>
      <svg className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? 'Search…'} className="pl-9" />
    </div>
  )
}
