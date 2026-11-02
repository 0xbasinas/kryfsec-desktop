import { useState } from 'react'
import { IconX } from '@tabler/icons-react'

export function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }): React.JSX.Element {
  const [text, setText] = useState('')
  const add = (): void => {
    const t = text.trim().toLowerCase().replace(/^#/, '')
    if (t && !value.includes(t)) onChange([...value, t])
    setText('')
  }
  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-card-2 px-2 py-1.5 focus-within:border-accent/60 focus-within:ring-3 focus-within:ring-accent/15">
      {value.map((t) => (
        <span key={t} className="inline-flex h-6 items-center gap-1 rounded-md bg-accent-soft pr-1 pl-2 font-mono text-[11px] text-accent">
          #{t}
          <button className="cursor-pointer rounded p-0.5 hover:bg-accent/20" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
            <IconX size={11} />
          </button>
        </span>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault()
            add()
          } else if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1))
        }}
        onBlur={add}
        placeholder={value.length ? '' : (placeholder ?? 'Add tag and press Enter')}
        className="min-w-24 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
      />
    </div>
  )
}
