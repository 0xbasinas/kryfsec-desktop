/* global window, document */
// Close-up screenshots of UI components (2x scale) on a virtual display.
// Usage: npm run screenshots:components   (headless by default; set DISPLAY_NUM=:5 to use an X display; temp data dir)
const { _electron: electron } = require('playwright-core')
const { mkdtempSync, mkdirSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')

const OUT = join(__dirname, '..', 'screenshots', 'components')
const shots = []
let theme = 'dark'

// Never inherit the page-screenshot runner's variables.
function cleanEnv() {
  const env = { ...process.env }
  delete env.CJ_SCREENSHOT_DIR
  delete env.CJ_SHOTS
  return env
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  const ud = mkdtempSync(join(tmpdir(), 'cj-comp-'))
  const app = await electron.launch({
    executablePath: require('electron'),
    args: [
      '--no-sandbox',
      '--force-device-scale-factor=2',
      ...(process.env.DISPLAY_NUM ? [] : ['--ozone-platform=headless']),
      `--user-data-dir=${ud}`,
      join(__dirname, '..', 'out', 'main', 'main.js')
    ],
    env: process.env.DISPLAY_NUM ? { ...cleanEnv(), DISPLAY: process.env.DISPLAY_NUM } : cleanEnv()
  })
  const page = await app.firstWindow()
  await app.evaluate(({ BrowserWindow }) => {
    const w = BrowserWindow.getAllWindows()[0]
    w.setContentSize(1440, 900)
    w.show()
  })
  await page.waitForSelector('aside')
  await page.waitForTimeout(1500)
  await page.addStyleTag({ content: '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;caret-color:transparent!important}' })

  const cj = async (s) => {
    await page.evaluate((x) => window.__cj(x), s)
    await page.waitForTimeout(450)
  }
  const esc = async () => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await page.evaluate(() => document.activeElement && document.activeElement.blur())
    await page.mouse.move(1430, 890)
  }
  const name = (n) => (theme === 'light' ? `${n}-light` : n)
  const shot = async (n, label, loc, pad = 0) => {
    const file = `${name(n)}.png`
    const l = typeof loc === 'string' ? page.locator(loc).first() : loc
    await l.waitFor({ state: 'visible', timeout: 5000 })
    await l.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {})
    await page.waitForTimeout(150)
    const b = await l.boundingBox()
    const x = Math.max(0, b.x - pad)
    const y = Math.max(0, b.y - pad)
    await page.screenshot({ path: join(OUT, file), clip: { x, y, width: Math.min(1440 - x, b.width + pad * 2), height: Math.min(900 - y, b.height + pad * 2) } })
    shots.push({ file, label, theme })
    console.log('✓', file)
  }
  const union = async (n, label, locs, pad = 8) => {
    const bs = []
    for (const l of locs) bs.push(await l.first().boundingBox())
    const x = Math.min(...bs.map((b) => b.x)) - pad
    const y = Math.min(...bs.map((b) => b.y)) - pad
    const r = Math.max(...bs.map((b) => b.x + b.width)) + pad
    const btm = Math.max(...bs.map((b) => b.y + b.height)) + pad
    const file = `${name(n)}.png`
    await page.screenshot({ path: join(OUT, file), clip: { x: Math.max(0, x), y: Math.max(0, y), width: r - Math.max(0, x), height: btm - Math.max(0, y) } })
    shots.push({ file, label, theme })
    console.log('✓', file)
  }
  const openPalette = async () => {
    await page.mouse.move(1430, 890)
    await page.evaluate(() => document.activeElement && document.activeElement.blur())
    await page.keyboard.press('Control+K')
    await page.waitForSelector('[cmdk-input]')
    await page.keyboard.type('sql')
    await page.waitForTimeout(400)
  }
  const dialog = page.locator('[role=dialog]')
  const btn = (n) => page.getByRole('button', { name: n, exact: true })

  async function kit() {
    await cj('kit:on')
    await shot('btn-01-buttons', 'Buttons: primary, secondary, outline, ghost, danger, sizes', '#kit-buttons')
    await page.locator('#kit-hover-p').hover()
    await page.waitForTimeout(150)
    await page.locator('#kit-focus-s').focus()
    await page.keyboard.press('Shift')
    await page.locator('#kit-focus-p').focus()
    await page.evaluate(() => {
      // focus-visible only shows after keyboard use; mirror it for the second button
      document.getElementById('kit-focus-s').classList.add('ring-2', 'ring-accent/50')
      document.getElementById('kit-hover-s').classList.add('border-line-strong')
    })
    await shot('btn-02-states', 'Button states: rest, hover, focus ring', '#kit-states')
    await page.mouse.move(1400, 880)
    await shot('badge-01-tones', 'Badges: status tones and keyboard keys', '#kit-badges')
    await shot('ctl-07-progress', 'Progress bars and rings', '#kit-progress')
    await page.locator('#kit-focus-input').focus()
    await shot('ctl-01-inputs', 'Text inputs: empty, filled, focused, disabled', '#kit-inputs')
    await cj('kit:off')
  }

  // Window controls: rest, hover on close, and the maximized ("restore") state.
  async function winctl(light) {
    const sfx = light ? ' (light)' : ''
    const ctl = page.locator('#window-controls')
    await page.mouse.move(700, 500)
    await shot('nav-07-window-controls', 'Window controls at rest' + sfx, ctl, 14)
    const close = ctl.locator('button[aria-label="Close"]')
    await close.hover()
    // Headless Chromium reports (hover: none), so Tailwind's hover: styles don't apply;
    // mirror the close button's hover colours inline for this shot.
    await close.evaluate((el) => {
      el.style.background = 'color-mix(in srgb, var(--danger) 15%, transparent)'
      el.style.color = 'var(--danger)'
    })
    await page.waitForTimeout(700)
    const tip = page.locator('[data-radix-popper-content-wrapper]', { hasText: 'Close' })
    if (!light && (await tip.count())) await union('nav-07-window-controls-hover-close', 'Hover on close (muted danger) with tooltip', [ctl, tip], 14)
    else await shot('nav-07-window-controls-hover-close', 'Hover on close' + sfx, ctl, 14)
    await close.evaluate((el) => el.removeAttribute('style'))
    await page.mouse.move(700, 500)
    await page.keyboard.press('Escape')
    await tip.first().waitFor({ state: 'detached', timeout: 1500 }).catch(() => {})
    const hideTips = await page.addStyleTag({ content: '[data-radix-popper-content-wrapper]{display:none!important}' })
    // Headless windows may not really maximize, so send the same event main sends.
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.send('win:maximized', true))
    await page.waitForTimeout(300)
    await shot('nav-07-window-controls-maximized', 'Maximized: middle button shows restore' + sfx, ctl, 14)
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.send('win:maximized', false))
    await page.waitForTimeout(200)
    await hideTips.evaluate((el) => el.remove())
  }

  async function darkOnly() {
    // Navigation
    await cj('page:dashboard')
    await shot('nav-01-sidebar', 'Sidebar with active item and weekly card', 'aside')
    await shot('nav-02-search', 'Floating search pill (opens Ctrl+K)', '#search-pill', 12)
    await shot('nav-06-theme-switch', 'Theme switch next to Settings', '#theme-switch', 12)
    const tb = page.locator('#theme-switch button').first()
    await tb.hover()
    await page.waitForTimeout(700)
    await union('nav-04-tooltip', 'Tooltip on an icon button', [tb, page.locator('[data-radix-popper-content-wrapper]', { hasText: 'Light theme' })], 10)
    await page.mouse.move(700, 500)
    await winctl(false)
    // hide tooltips for the rest of the run (focus can reopen them behind other shots)
    await page.addStyleTag({ content: '[data-radix-popper-content-wrapper]{display:none!important}' })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    await openPalette()
    await shot('nav-03-command-palette', 'Command palette with results', '[cmdk-root]')
    await esc()

    // Dashboard cards
    const stats = page.locator('main .grid-cols-4 > .card')
    await union('card-01-stat-cards', 'Stat cards', [stats.nth(0), stats.nth(3)], 2)
    await shot('card-02-stat-streak', 'Stat card: streak', stats.nth(0), 2)
    const coming = page.locator('main .card', { hasText: 'Coming up' })
    await shot('card-08-coming-up', 'Coming up list', coming)
    await shot('card-09-coming-up-item', 'Coming up item', coming.locator('button, a, li, div.flex').filter({ hasText: 'Bandit' }).first(), 4)

    // Roadmap
    await cj('page:roadmap')
    await shot('card-03-topic-area', 'Skill area card (roadmap list)', page.locator('main button', { hasText: 'Linux' }).first(), 2)
    const row = page.locator('main .group.relative', { hasText: 'TCP, UDP and ports' }).first()
    await row.hover()
    await page.waitForTimeout(200)
    await shot('card-04-topic-row-hover', 'Topic row on hover: status switch, rename, delete', row, 4)
    await row.getByRole('button', { name: 'TCP, UDP and ports' }).click()
    await page.mouse.move(1400, 880)
    await shot('card-05-topic-notes', 'Topic with notes open', row, 4)
    await shot('ctl-02-add-topic', 'Add topic input', page.locator('main input[placeholder^="Add a topic"]').locator('..'), 6)
    await btn('Edit area').click()
    await shot('dlg-02-edit-area', 'Dialog: edit skill area', dialog)
    await esc()
    await row.hover()
    await row.getByRole('button', { name: 'Delete' }).click()
    await shot('dlg-07-confirm-delete', 'Dialog: confirm delete', dialog)
    await btn('Cancel').click()

    // Labs
    await cj('page:labs')
    await shot('card-06-lab-card', 'Lab card with platform, difficulty, tags', 'main button.card')
    await shot('badge-02-difficulty', 'Difficulty pills', page.locator('main .flex-col.rounded-\\[22px\\]').nth(2), 0)
    await shot('ctl-03-select', 'Select (closed) and segmented control', page.locator('main select').first().locator('xpath=ancestor::div[contains(@class,"items-center")][1]'), 4)
    await btn('New lab').click()
    await page.waitForTimeout(400)
    await shot('dlg-03-new-lab', 'Side sheet: new lab', dialog)
    await shot('ctl-04-segmented-status', 'Segmented controls: status and difficulty', dialog.locator('.rounded-full.border.p-0\\.5').first().locator('..'), 4)
    await esc()
    // remove the empty lab the sheet created
    await page.waitForTimeout(300)

    // Certifications
    await cj('page:certs')
    await shot('card-07-cert-card', 'Certification card', page.locator('main .card', { has: page.locator('input[type=range]') }).first())
    await btn('New certification').click()
    await shot('dlg-05-new-cert', 'Dialog: new certification (with slider and date)', dialog)
    await shot('ctl-05-slider', 'Range slider', dialog.locator('input[type=range]').locator('..'), 6)
    await shot('ctl-06-date', 'Date input', dialog.locator('input[type=date]'), 6)
    await esc()

    // Goals
    await cj('page:goals')
    await shot('card-10-goal-add', 'Add goal bar: input, date, select', page.locator('main .card', { has: page.locator('input[placeholder^="Add a goal"]') }))
    await shot('card-11-goals-checklist', 'Goal list with checklist', page.locator('main .card', { hasText: 'Open ·' }))

    // Resources + toast
    await cj('page:resources')
    await shot('card-12-resource-card', 'Resource card', page.locator('main .card', { hasText: 'TryHackMe' }).first())
    await btn('New resource').click()
    await shot('dlg-04-new-resource', 'Dialog: new resource', dialog)
    await dialog.locator('input').first().fill('Practical Networking')
    await dialog.getByRole('button', { name: /^(Add|Save)/ }).last().click()
    await page.waitForTimeout(700)
    await shot('nav-05-toast', 'Toast message', '[data-sonner-toast]', 1)
    await page.waitForTimeout(4500)

    // Journal: tags, editor, markdown
    await cj('page:journal')
    await shot('ctl-08-tag-filter', 'Tag filter chips', page.locator('main button.font-mono').first().locator('..'), 4)
    await cj('open:journal:new')
    await page.waitForTimeout(400)
    await page.locator('main input[placeholder^="What did you learn"]').fill('Markdown showcase')
    const ta = page.locator('main textarea').first()
    await ta.fill(MD)
    await page.locator('main .focus-within\\:ring-3 input').first().fill('web')
    await page.keyboard.press('Enter')
    await page.locator('main .focus-within\\:ring-3 input').first().fill('sqli')
    await page.keyboard.press('Enter')
    await page.mouse.click(1400, 880)
    await shot('ctl-09-tag-input', 'Tag input', page.locator('main .focus-within\\:ring-3').first(), 4)
    await shot('ctl-10-date-minutes', 'Date, minutes and topic fields', page.locator('main input[type=date]').locator('xpath=ancestor::div[contains(@class,"flex")][2]'), 2)
    await shot('ctl-11-segmented-editor', 'Segmented control: Write / Split / Preview', page.locator('main .rounded-full.border.p-0\\.5').first(), 4)
    await page.getByRole('button', { name: 'Preview' }).click()
    await page.waitForTimeout(300)
    const md = page.locator('main .md').first()
    await shot('md-01-preview', 'Markdown preview', md, 12)
    await shot('md-02-heading-code', 'Markdown: heading and code block', md.locator('pre').first(), 70)
    await shot('md-03-checklist', 'Markdown: checklist', md.locator('ul.contains-task-list').first(), 10)
    await shot('md-04-table', 'Markdown: table', md.locator('table').first(), 10)
    await shot('md-05-blockquote', 'Markdown: blockquote and inline code', md.locator('blockquote').first(), 10)

    // New area dialog
    await cj('page:roadmap')
    await btn('New area').click()
    await shot('dlg-01-new-area', 'Dialog: new skill area', dialog)
    await esc()
  }

  async function empty() {
    // Empty states (temp data dir only)
    await cj('page:settings')
    await page.getByRole('button', { name: 'Start fresh' }).click()
    await shot('dlg-08-confirm-reset', 'Dialog: confirm delete everything', dialog)
    await dialog.getByRole('button').last().click()
    await page.waitForTimeout(800)
    for (const [p, n, l] of [
      ['journal', 'empty-01-journal', 'Empty state: journal'],
      ['labs', 'empty-02-labs', 'Empty state: labs'],
      ['resources', 'empty-03-resources', 'Empty state: resources'],
      ['certs', 'empty-04-certs', 'Empty state: certifications'],
      ['goals', 'empty-05-goals', 'Empty state: goals']
    ]) {
      await cj(`page:${p}`)
      await shot(n, l, page.locator('main .animate-fade-up h3').last().locator('..'), 10)
    }
    await cj('page:dashboard')
    await shot('empty-06-dashboard', 'Dashboard with no data', page.locator('main .card', { hasText: 'Coming up' }))
  }

  async function lightSet() {
    theme = 'light'
    await cj('theme:light;page:dashboard')
    await kit()
    await shot('nav-01-sidebar', 'Sidebar (light)', 'aside')
    await shot('nav-02-search', 'Floating search pill (light)', '#search-pill', 12)
    await shot('nav-06-theme-switch', 'Theme switch (light)', '#theme-switch', 12)
    await winctl(true)
    const stats = page.locator('main .grid-cols-4 > .card')
    await union('card-01-stat-cards', 'Stat cards (light)', [stats.nth(0), stats.nth(3)], 2)
    await openPalette()
    await shot('nav-03-command-palette', 'Command palette (light)', '[cmdk-root]')
    await esc()
    await cj('page:resources')
    await shot('card-12-resource-card', 'Resource card (light)', page.locator('main .card', { hasText: 'TryHackMe' }).first())
    await btn('New resource').click()
    await shot('dlg-04-new-resource', 'Dialog: new resource (light)', dialog)
    await esc()
    await cj('page:labs')
    await shot('card-06-lab-card', 'Lab card (light)', 'main button.card')
    await cj('page:goals')
    await shot('card-11-goals-checklist', 'Goal list (light)', page.locator('main .card', { hasText: 'Open ·' }))
    await cj('page:journal')
    await page.locator('main button', { hasText: 'Markdown showcase' }).first().click()
    await page.getByRole('button', { name: 'Preview' }).click()
    await page.waitForTimeout(300)
    await shot('md-01-preview', 'Markdown preview (light)', page.locator('main .md').first(), 12)
  }

  try {
    await kit()
    await darkOnly()
    await lightSet()
    theme = 'dark'
    await cj('theme:dark')
    await empty()
  } catch (e) {
    await page.screenshot({ path: join(tmpdir(), 'cj-comp-fail.png') }).catch(() => {})
    throw e
  } finally {
    require('node:fs').writeFileSync(join(OUT, 'shots.json'), JSON.stringify(shots, null, 2))
    await app.close()
    rmSync(ud, { recursive: true, force: true })
  }
}

const MD = `## Markdown showcase

A short note about \`UNION\` attacks.

\`\`\`sql
' UNION SELECT username, password FROM users--
\`\`\`

### Checklist
- [x] Find the number of columns
- [x] Find a text column
- [ ] Try the blind SQLi labs

### Payloads
| Step | Payload | Result |
| --- | --- | --- |
| 1 | \`ORDER BY 3--\` | error at 4 |
| 2 | \`UNION SELECT NULL,'a'--\` | text column |

> Tip: always check how many columns the query returns first.
`

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
