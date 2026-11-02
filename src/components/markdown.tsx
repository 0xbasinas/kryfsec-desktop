import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { IconBold, IconCode, IconColumns2, IconEye, IconH2, IconItalic, IconLink, IconList, IconListCheck, IconPencil, IconSourceCode } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Segmented } from './ui'

export function MarkdownView({ source, className }: { source: string; className?: string }): React.JSX.Element {
  return (
    <div className={cn('md prose prose-sm max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline prose-pre:font-mono prose-code:font-mono', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              onClick={(e) => {
                e.preventDefault()
                if (href) void window.api.openLink(href)
              }}
            >
              {children}
            </a>
          )
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

type Mode = 'write' | 'split' | 'preview'

export function MarkdownEditor({ value, onChange, placeholder, minHeight = 320, defaultMode = 'split' }: { value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: number; defaultMode?: Mode }): React.JSX.Element {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const ref = useRef<HTMLTextAreaElement>(null)

  const wrap = (before: string, after = before, fallback = 'text'): void => {
    const ta = ref.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const sel = value.slice(s, e) || fallback
    const next = value.slice(0, s) + before + sel + after + value.slice(e)
    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s + before.length, s + before.length + sel.length)
    })
  }
  const linePrefix = (prefix: string): void => {
    const ta = ref.current
    if (!ta) return
    const s = ta.selectionStart
    const lineStart = value.lastIndexOf('\n', s - 1) + 1
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart))
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s + prefix.length, s + prefix.length)
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.key.toLowerCase() === 'b') {
      e.preventDefault()
      wrap('**')
    } else if (mod && e.key.toLowerCase() === 'i') {
      e.preventDefault()
      wrap('*')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const s = ta.selectionStart
      onChange(value.slice(0, s) + '  ' + value.slice(ta.selectionEnd))
      requestAnimationFrame(() => ta.setSelectionRange(s + 2, s + 2))
    } else if (e.key === 'Enter') {
      // continue lists
      const ta = e.currentTarget
      const s = ta.selectionStart
      const lineStart = value.lastIndexOf('\n', s - 1) + 1
      const line = value.slice(lineStart, s)
      const m = line.match(/^(\s*)([-*] \[[ x]\] |[-*] |\d+\. )/)
      if (m) {
        e.preventDefault()
        if (line.trim() === m[2].trim()) {
          onChange(value.slice(0, lineStart) + value.slice(s))
          requestAnimationFrame(() => ta.setSelectionRange(lineStart, lineStart))
          return
        }
        let marker = m[2]
        if (/^\d+\. $/.test(marker)) marker = `${parseInt(marker) + 1}. `
        if (marker.includes('[x]')) marker = marker.replace('[x]', '[ ]')
        const ins = '\n' + m[1] + marker
        onChange(value.slice(0, s) + ins + value.slice(ta.selectionEnd))
        requestAnimationFrame(() => ta.setSelectionRange(s + ins.length, s + ins.length))
      }
    }
  }

  const tools = [
    { icon: IconH2, label: 'Heading', run: () => linePrefix('## ') },
    { icon: IconBold, label: 'Bold (Ctrl+B)', run: () => wrap('**') },
    { icon: IconItalic, label: 'Italic (Ctrl+I)', run: () => wrap('*') },
    { icon: IconCode, label: 'Inline code', run: () => wrap('`', '`', 'code') },
    { icon: IconSourceCode, label: 'Code block', run: () => wrap('\n```bash\n', '\n```\n', 'command') },
    { icon: IconList, label: 'List', run: () => linePrefix('- ') },
    { icon: IconListCheck, label: 'Checklist', run: () => linePrefix('- [ ] ') },
    { icon: IconLink, label: 'Link', run: () => wrap('[', '](https://)', 'link text') }
  ]

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-card-2/40 focus-within:border-accent/40">
      <div className="flex items-center gap-0.5 border-b border-line px-2 py-1.5">
        {tools.map((t) => (
          <button
            key={t.label}
            title={t.label}
            onClick={t.run}
            disabled={mode === 'preview'}
            className="grid size-7 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-card-2 hover:text-fg disabled:opacity-30"
          >
            <t.icon size={15} stroke={1.9} />
          </button>
        ))}
        <div className="flex-1" />
        <Segmented
          size="sm"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'write', label: <><IconPencil />Write</> },
            { value: 'split', label: <><IconColumns2 />Split</> },
            { value: 'preview', label: <><IconEye />Preview</> }
          ]}
        />
      </div>
      <div className={cn('grid flex-1', mode === 'split' ? 'grid-cols-2' : 'grid-cols-1')} style={{ minHeight }}>
        {mode !== 'preview' && (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder ?? 'Write in Markdown…'}
            spellCheck={false}
            className="h-full w-full resize-none bg-transparent px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-fg outline-none placeholder:text-faint"
          />
        )}
        {mode !== 'write' && (
          <div className={cn('overflow-y-auto px-5 py-3', mode === 'split' && 'border-l border-line')}>
            {value.trim() ? <MarkdownView source={value} /> : <p className="text-[13px] text-faint italic">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
