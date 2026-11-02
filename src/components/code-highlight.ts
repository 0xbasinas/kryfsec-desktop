/**
 * Syntax colors for code blocks in the note editor.
 * Uses refractor (Prism, MIT) and draws colors with ProseMirror decorations,
 * so the stored Markdown is not changed.
 */
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Node as PMNode } from '@tiptap/pm/model'
import { refractor } from 'refractor/core'
import bash from 'refractor/bash'
import powershell from 'refractor/powershell'
import python from 'refractor/python'
import sql from 'refractor/sql'
import http from 'refractor/http'
import javascript from 'refractor/javascript'
import json from 'refractor/json'
import markup from 'refractor/markup'
import c from 'refractor/c'
import php from 'refractor/php'
import yaml from 'refractor/yaml'

for (const l of [markup, bash, powershell, python, sql, http, javascript, json, c, php, yaml]) refractor.register(l)
refractor.alias({ bash: ['sh', 'shell', 'zsh', 'console'], powershell: ['ps1', 'pwsh'], python: ['py'], javascript: ['js'], markup: ['html', 'xml'] })

type HNode = { type: string; value?: string; children?: HNode[]; properties?: { className?: string[] } }

function flatten(nodes: HNode[], classes: string[] = [], out: { text: string; classes: string[] }[] = []): { text: string; classes: string[] }[] {
  for (const n of nodes) {
    if (n.type === 'text') out.push({ text: n.value ?? '', classes })
    else if (n.children) flatten(n.children, [...classes, ...(n.properties?.className ?? [])], out)
  }
  return out
}

function decorate(doc: PMNode): DecorationSet {
  const decos: Decoration[] = []
  doc.descendants((node, pos) => {
    if (node.type.name !== 'codeBlock') return true
    const lang = (node.attrs.language as string | null) ?? ''
    if (!lang || !refractor.registered(lang)) return false
    let from = pos + 1
    for (const part of flatten(refractor.highlight(node.textContent, lang).children as HNode[])) {
      const to = from + part.text.length
      if (part.classes.length) decos.push(Decoration.inline(from, to, { class: part.classes.join(' ') }))
      from = to
    }
    return false
  })
  return DecorationSet.create(doc, decos)
}

export const CodeHighlight = Extension.create({
  name: 'codeHighlight',
  addProseMirrorPlugins() {
    const key = new PluginKey('codeHighlight')
    return [
      new Plugin({
        key,
        state: {
          init: (_, { doc }) => decorate(doc),
          apply: (tr, old) => (tr.docChanged ? decorate(tr.doc) : old)
        },
        props: { decorations: (state) => key.getState(state) as DecorationSet }
      })
    ]
  }
})
