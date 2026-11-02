// Writes THIRD_PARTY_NOTICES.md from the packages that end up in the app bundle.
// Run: node scripts/notices.cjs
const fs = require('node:fs')
const path = require('node:path')
const root = path.join(__dirname, '..')
const roots = ['react', 'react-dom', 'zustand', 'recharts', 'react-markdown', 'remark-gfm', 'cmdk',
  '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip', '@radix-ui/react-popover',
  '@tabler/icons-react', 'clsx', 'tailwind-merge', 'date-fns', 'sonner', 'nanoid', 'tailwindcss', '@tailwindcss/typography']
const seen = new Map()
function visit(name) {
  if (seen.has(name)) return
  const dir = path.join(root, 'node_modules', name)
  let pkg
  try { pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')) } catch { return }
  const license = pkg.license || (pkg.licenses || []).map((l) => l.type).join(' / ') || 'unknown'
  let repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url || pkg.homepage || ''
  repo = repo.replace(/^git\+/, '').replace(/\.git$/, '').replace(/^github:/, 'https://github.com/')
  const file = fs.readdirSync(dir).find((f) => /^(licen[cs]e|copying)/i.test(f))
  seen.set(name, { version: pkg.version, license, repo, text: file ? fs.readFileSync(path.join(dir, file), 'utf8').trim() : '' })
  for (const d of Object.keys(pkg.dependencies || {})) visit(d)
}
roots.forEach(visit)
const electron = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/electron/package.json'), 'utf8'))
const list = [...seen].sort(([a], [b]) => a.localeCompare(b))
let md = `# Third-party notices

CyberJourney is MIT licensed (see LICENSE). It is built with the open-source
software below. No third-party fonts, images or icon files are bundled: the app
icon and logo were drawn for this project, and the UI uses fonts already
installed on your computer (Inter / Segoe UI, JetBrains Mono / Cascadia Mono / Consolas).

## Runtime

| Package | Version | License |
|---|---|---|
| [electron](https://github.com/electron/electron) | ${electron.version} | MIT |

Electron includes Chromium and Node.js. Their licenses are shipped with the
app as \`LICENSE.electron.txt\` and \`LICENSES.chromium.html\` in the install folder.

## Packages bundled into the app (${list.length})

Almost all are MIT. A few small helpers used inside recharts, react-markdown and
Radix use other permissive licenses (ISC, BSD-3-Clause, 0BSD); their full texts are below.

| Package | Version | License |
|---|---|---|
${list.map(([n, i]) => `| ${i.repo ? `[${n}](${i.repo})` : n} | ${i.version} | ${i.license} |`).join('\n')}

## Build tools (not shipped)

electron-vite, Vite, TypeScript, ESLint, typescript-eslint, @vitejs/plugin-react,
@tailwindcss/vite and electron-builder (all MIT; TypeScript is Apache-2.0).
\`scripts/nsis-no-wine\` calls electron-builder's own \`UninstallerReader\` (MIT).

## License texts for non-MIT packages
`
for (const [n, i] of list) {
  if (i.license === 'MIT') continue
  md += `\n### ${n}@${i.version} (${i.license})\n\n\`\`\`text\n${i.text || '(see package)'}\n\`\`\`\n`
}
md += `\n## MIT License texts\n\nEach MIT package keeps its own copyright line in its LICENSE file. The common text is:\n\n\`\`\`text\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\`\`\`\n\nCopyright lines:\n\n`
for (const [n, i] of list) {
  if (i.license !== 'MIT') continue
  const c = (i.text.match(/^.*copyright.*$/im) || [''])[0].trim()
  md += `- ${n}: ${c || 'see package LICENSE'}\n`
}
fs.writeFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), md)
console.log('packages:', list.length)
