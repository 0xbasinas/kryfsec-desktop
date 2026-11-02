/**
 * Rich note editor for journal entries and lab writeups.
 * Built on TipTap (MIT). Notes are still stored as Markdown, so the data
 * stays the same as before. All looks come from the app theme (index.css).
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorContent, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, useEditorState, type Editor, type NodeViewProps } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { Placeholder } from '@tiptap/extensions'
import CodeBlock from '@tiptap/extension-code-block'
import { CodeHighlight } from './code-highlight'
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconCheck,
  IconCode,
  IconCopy,
  IconEye,
  IconH1,
  IconH2,
  IconH3,
  IconItalic,
  IconLink,
  IconList,
  IconListCheck,
  IconListNumbers,
  IconMinus,
  IconPencil,
  IconQuote,
  IconStrikethrough,
  IconTerminal2,
  IconUnlink,
  type Icon
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Segmented } from './ui'

const LANGS = [
  ['bash', 'Bash'],
  ['powershell', 'PowerShell'],
  ['python', 'Python'],
  ['sql', 'SQL'],
  ['http', 'HTTP'],
  ['javascript', 'JavaScript'],
  ['json', 'JSON'],
  ['markup', 'HTML'],
  ['php', 'PHP'],
  ['yaml', 'YAML'],
  ['c', 'C']
] as const

/** Code block with a language picker and a copy button. */
function CodeBlockView({ node, updateAttributes, editor }: NodeViewProps): React.JSX.Element {
  const [copied, setCopied] = useState(false)
  const lang = (node.attrs.language as string | null) ?? ''
  const known = LANGS.some(([v]) => v === lang)
  return (
    <NodeViewWrapper className="cj-code">
      <div className="cj-code-head" contentEditable={false}>
        <IconTerminal2 size={13} stroke={1.8} />
        {editor.isEditable ? (
          <select value={lang} onChange={(e) => updateAttributes({ language: e.target.value || null })}>
            <option value="">Plain</option>
            {!known && lang && <option value={lang}>{lang}</option>}
            {LANGS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        ) : (
          <span>{LANGS.find(([v]) => v === lang)?.[1] ?? (lang || 'Code')}</span>
        )}
        <button
          type="button"
          title="Copy"
          onClick={() => {
            void navigator.clipboard.writeText(node.textContent)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
        >
          {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <NodeViewContent<'code'> as="code" />
      </pre>
    </NodeViewWrapper>
  )
}

type Cmd = { id: string; label: string; hint: string; icon: Icon; keys?: string[]; run: (e: Editor) => void }

const SLASH: Cmd[] = [
  { id: 'h1', label: 'Big heading', hint: 'Title of a section', icon: IconH1, keys: ['h1', 'title'], run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'h2', label: 'Heading', hint: 'Section heading', icon: IconH2, keys: ['h2'], run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'h3', label: 'Small heading', hint: 'Sub heading', icon: IconH3, keys: ['h3'], run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'list', label: 'List', hint: 'Simple bullet list', icon: IconList, keys: ['bullet', 'ul'], run: (e) => e.chain().focus().toggleBulletList().run() },
  { id: 'num', label: 'Numbered list', hint: 'Steps in order', icon: IconListNumbers, keys: ['ol', 'steps'], run: (e) => e.chain().focus().toggleOrderedList().run() },
  { id: 'todo', label: 'Checklist', hint: 'Things to do', icon: IconListCheck, keys: ['todo', 'task', 'check'], run: (e) => e.chain().focus().toggleTaskList().run() },
  { id: 'cmd', label: 'Command', hint: 'Shell commands', icon: IconTerminal2, keys: ['bash', 'shell', 'terminal', 'code'], run: (e) => e.chain().focus().toggleCodeBlock({ language: 'bash' }).run() },
  { id: 'payload', label: 'Payload', hint: 'SQL, HTTP or other code', icon: IconCode, keys: ['sql', 'http', 'code', 'snippet'], run: (e) => e.chain().focus().toggleCodeBlock({ language: 'sql' }).run() },
  { id: 'quote', label: 'Quote', hint: 'A tip or note', icon: IconQuote, keys: ['tip', 'note'], run: (e) => e.chain().focus().toggleBlockquote().run() },
  { id: 'line', label: 'Divider', hint: 'A thin line', icon: IconMinus, keys: ['hr', 'rule'], run: (e) => e.chain().focus().setHorizontalRule().run() }
]

/** Finds "/word" typed at the start of an empty paragraph. */
function slashQuery(editor: Editor): { q: string; from: number; to: number } | null {
  const { $from, empty } = editor.state.selection
  if (!empty || $from.parent.type.name !== 'paragraph') return null
  const text = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc')
  const m = text.match(/^\/([\w-]*)$/)
  if (!m) return null
  return { q: m[1].toLowerCase(), from: $from.pos - text.length, to: $from.pos }
}

/** Markdown out of the editor, tidied a little. */
function toMarkdown(editor: Editor): string {
  return editor
    .getMarkdown()
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export type EditorMode = 'edit' | 'read'

export function NoteEditor({ value, onChange, placeholder, minHeight = 320, defaultMode = 'edit' }: { value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: number; defaultMode?: EditorMode }): React.JSX.Element {
  const [mode, setMode] = useState<EditorMode>(defaultMode)
  const last = useRef(value)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const [slash, setSlash] = useState<{ q: string; from: number; to: number; x: number; y: number } | null>(null)
  const [slashIdx, setSlashIdx] = useState(0)
  const [linkOpen, setLinkOpen] = useState(false)
  const slashRef = useRef<{ items: Cmd[]; idx: number; open: boolean; range: { from: number; to: number } | null }>({ items: [], idx: 0, open: false, range: null })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, underline: false, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noreferrer' } } }),
      CodeBlock.extend({ addNodeView: () => ReactNodeViewRenderer(CodeBlockView) }).configure({ defaultLanguage: null, enableTabIndentation: true }),
      CodeHighlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: ({ editor: ed }) => (ed.isEmpty ? (placeholder ?? 'Write something, or type / for blocks') : 'Type / for blocks') }),
      Markdown
    ],
    content: value,
    contentType: 'markdown',
    editable: defaultMode === 'edit',
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: { class: 'cj-prose', spellcheck: 'false' },
      handleKeyDown: (_view, event) => {
        const s = slashRef.current
        if (s.open && s.items.length) {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const n = s.items.length
            setSlashIdx((i) => (event.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n))
            return true
          }
          if (event.key === 'Enter' || event.key === 'Tab') {
            runSlash(s.items[s.idx])
            return true
          }
          if (event.key === 'Escape') {
            setSlash(null)
            return true
          }
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
          setLinkOpen(true)
          return true
        }
        return false
      },
      handleClickOn: (_view, _pos, _node, _nodePos, event) => {
        const a = (event.target as HTMLElement).closest('a')
        if (a && (!editorRef.current?.isEditable || event.ctrlKey || event.metaKey)) {
          event.preventDefault()
          void window.api.openLink(a.href)
          return true
        }
        return false
      }
    },
    onUpdate: ({ editor: ed }) => {
      const md = toMarkdown(ed)
      if (md !== last.current) {
        last.current = md
        onChangeRef.current(md)
      }
    },
    onSelectionUpdate: ({ editor: ed }) => updateSlash(ed),
    onTransaction: ({ editor: ed }) => updateSlash(ed)
  })
  const editorRef = useRef<Editor | null>(editor)
  editorRef.current = editor

  function updateSlash(ed: Editor): void {
    const s = ed.isEditable ? slashQuery(ed) : null
    if (!s) {
      if (slashRef.current.open) setSlash(null)
      return
    }
    const c = ed.view.coordsAtPos(s.to)
    const box = ed.view.dom.closest('.cj-editor')?.getBoundingClientRect()
    const menuH = 300
    const below = c.bottom + menuH + 12 < window.innerHeight
    setSlash({ ...s, x: c.left - (box?.left ?? 0), y: below ? c.bottom - (box?.top ?? 0) + 6 : -((box?.bottom ?? 0) - c.top + 6) })
  }

  function runSlash(cmd: Cmd | undefined): void {
    const ed = editorRef.current
    const r = slashRef.current.range
    if (!ed || !cmd || !r) return
    ed.chain().focus().deleteRange(r).run()
    cmd.run(ed)
    setSlash(null)
  }

  const items = useMemo(() => {
    if (!slash) return []
    const q = slash.q
    return SLASH.filter((c) => !q || c.label.toLowerCase().includes(q) || c.id.includes(q) || c.keys?.some((k) => k.startsWith(q)))
  }, [slash])
  useEffect(() => setSlashIdx(0), [slash?.q])
  slashRef.current = { items, idx: Math.min(slashIdx, Math.max(0, items.length - 1)), open: !!slash, range: slash ? { from: slash.from, to: slash.to } : null }

  // Outside value change (for example a different entry): load it.
  useEffect(() => {
    if (editor && value !== last.current) {
      last.current = value
      editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
    }
  }, [editor, value])

  useEffect(() => {
    editor?.setEditable(mode === 'edit')
    if (mode === 'read') {
      setSlash(null)
      editor?.commands.blur()
      window.getSelection()?.removeAllRanges()
    }
  }, [editor, mode])

  return (
    <div className={cn('cj-editor relative flex flex-col rounded-[18px] border border-line bg-card shadow-[var(--shadow)] transition-colors', mode === 'edit' && 'focus-within:border-line-strong')}>
      <Toolbar editor={editor} mode={mode} setMode={setMode} onLink={() => setLinkOpen(true)} />
      {linkOpen && editor && <LinkBar editor={editor} onClose={() => setLinkOpen(false)} />}
      <div className="cursor-text px-7 pt-5 pb-7" style={{ minHeight }} onClick={(e) => e.target === e.currentTarget && editor?.chain().focus('end').run()}>
        <EditorContent editor={editor} />
      </div>
      {slash && items.length > 0 && (
        <div className="cj-slash animate-fade-in" style={slash.y >= 0 ? { left: Math.max(12, slash.x - 8), top: slash.y } : { left: Math.max(12, slash.x - 8), bottom: -slash.y }} onMouseDown={(e) => e.preventDefault()}>
          {items.map((c, i) => (
            <button key={c.id} className={cn(i === slashRef.current.idx && 'is-active')} onMouseEnter={() => setSlashIdx(i)} onClick={() => runSlash(c)}>
              <span className="cj-slash-icon">
                <c.icon size={15} stroke={1.8} />
              </span>
              <span className="flex flex-col text-left">
                <span className="text-[12.5px] font-medium text-fg">{c.label}</span>
                <span className="text-[11px] text-faint">{c.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Toolbar({ editor, mode, setMode, onLink }: { editor: Editor | null; mode: EditorMode; setMode: (m: EditorMode) => void; onLink: () => void }): React.JSX.Element {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h1: e.isActive('heading', { level: 1 }),
            h2: e.isActive('heading', { level: 2 }),
            h3: e.isActive('heading', { level: 3 }),
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            strike: e.isActive('strike'),
            code: e.isActive('code'),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
            task: e.isActive('taskList'),
            quote: e.isActive('blockquote'),
            codeBlock: e.isActive('codeBlock'),
            link: e.isActive('link'),
            undo: e.can().undo(),
            redo: e.can().redo()
          }
        : null
  })
  const c = (): ReturnType<Editor['chain']> => editor!.chain().focus()
  type T = { icon: Icon; label: string; on?: boolean; run: () => void; off?: boolean } | 'sep'
  const tools: T[] = [
    { icon: IconH1, label: 'Big heading (Ctrl+Alt+1)', on: st?.h1, run: () => c().toggleHeading({ level: 1 }).run() },
    { icon: IconH2, label: 'Heading (Ctrl+Alt+2)', on: st?.h2, run: () => c().toggleHeading({ level: 2 }).run() },
    { icon: IconH3, label: 'Small heading (Ctrl+Alt+3)', on: st?.h3, run: () => c().toggleHeading({ level: 3 }).run() },
    'sep',
    { icon: IconBold, label: 'Bold (Ctrl+B)', on: st?.bold, run: () => c().toggleBold().run() },
    { icon: IconItalic, label: 'Italic (Ctrl+I)', on: st?.italic, run: () => c().toggleItalic().run() },
    { icon: IconStrikethrough, label: 'Strike (Ctrl+Shift+S)', on: st?.strike, run: () => c().toggleStrike().run() },
    { icon: IconCode, label: 'Inline code (Ctrl+E)', on: st?.code, run: () => c().toggleCode().run() },
    { icon: IconLink, label: 'Link (Ctrl+K)', on: st?.link, run: onLink },
    'sep',
    { icon: IconList, label: 'List (Ctrl+Shift+8)', on: st?.bullet, run: () => c().toggleBulletList().run() },
    { icon: IconListNumbers, label: 'Numbered list (Ctrl+Shift+7)', on: st?.ordered, run: () => c().toggleOrderedList().run() },
    { icon: IconListCheck, label: 'Checklist (Ctrl+Shift+9)', on: st?.task, run: () => c().toggleTaskList().run() },
    'sep',
    { icon: IconQuote, label: 'Quote (Ctrl+Shift+B)', on: st?.quote, run: () => c().toggleBlockquote().run() },
    { icon: IconTerminal2, label: 'Code block (Ctrl+Alt+C)', on: st?.codeBlock, run: () => c().toggleCodeBlock({ language: 'bash' }).run() },
    'sep',
    { icon: IconArrowBackUp, label: 'Undo (Ctrl+Z)', off: !st?.undo, run: () => c().undo().run() },
    { icon: IconArrowForwardUp, label: 'Redo (Ctrl+Shift+Z)', off: !st?.redo, run: () => c().redo().run() }
  ]
  return (
    <div className="cj-toolbar">
      {mode === 'edit' ? (
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {tools.map((t, i) =>
            t === 'sep' ? (
              <span key={i} className="mx-1 h-4 w-px shrink-0 bg-line" />
            ) : (
              <button key={t.label} type="button" title={t.label} disabled={!editor || t.off} onMouseDown={(e) => e.preventDefault()} onClick={t.run} className={cn('cj-tool', t.on && 'is-active')}>
                <t.icon size={16} stroke={1.8} />
              </button>
            )
          )}
        </div>
      ) : (
        <span className="flex-1 pl-2 text-[12px] text-faint">Reading view</span>
      )}
      <Segmented
        size="sm"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'edit', label: <><IconPencil />Edit</> },
          { value: 'read', label: <><IconEye />Read</> }
        ]}
      />
    </div>
  )
}

function LinkBar({ editor, onClose }: { editor: Editor; onClose: () => void }): React.JSX.Element {
  const [url, setUrl] = useState<string>(() => (editor.getAttributes('link').href as string | undefined) ?? '')
  const apply = (): void => {
    const u = url.trim()
    if (!u) editor.chain().focus().extendMarkRange('link').unsetLink().run()
    else {
      const href = /^[a-z]+:\/\//i.test(u) ? u : `https://${u}`
      if (editor.state.selection.empty && !editor.isActive('link')) editor.chain().focus().insertContent({ type: 'text', text: u, marks: [{ type: 'link', attrs: { href } }] }).run()
      else editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    }
    onClose()
  }
  return (
    <div className="flex items-center gap-2 border-b border-line px-3 py-2 animate-fade-in">
      <IconLink size={15} className="text-faint" />
      <input
        autoFocus
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') apply()
          if (e.key === 'Escape') {
            onClose()
            editor.commands.focus()
          }
        }}
        placeholder="Paste a link, then press Enter"
        className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
      />
      {editor.isActive('link') && (
        <button type="button" className="cj-tool" title="Remove link" onClick={() => (editor.chain().focus().extendMarkRange('link').unsetLink().run(), onClose())}>
          <IconUnlink size={15} />
        </button>
      )}
      <button type="button" className="cj-tool" title="Save link" onClick={apply}>
        <IconCheck size={15} />
      </button>
    </div>
  )
}
