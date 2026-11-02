import { app, BrowserWindow, dialog, ipcMain, nativeTheme, shell } from 'electron'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { readFile, rename, writeFile, copyFile } from 'node:fs/promises'
import { join } from 'node:path'

const DATA_FILE = (): string => join(app.getPath('userData'), 'cyberjourney.json')

let win: BrowserWindow | null = null
let lastMaxChange = 0

function createWindow(): void {
  win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1040,
    minHeight: 680,
    show: false,
    backgroundColor: '#111110',
    // Frameless on Windows/Linux (custom window controls in the renderer);
    // macOS keeps its native traffic lights on a hidden title bar.
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden' as const } : { frame: false }),
    resizable: true,
    maximizable: true,
    minimizable: true,
    title: 'CyberJourney',
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  })

  // Tell the renderer when the window is maximized so the button can show "restore".
  const sendMax = (): void => {
    lastMaxChange = Date.now()
    win?.webContents.send('win:maximized', win.isMaximized())
  }
  win.on('maximize', sendMax)
  win.on('unmaximize', sendMax)
  win.on('enter-full-screen', sendMax)
  win.on('leave-full-screen', sendMax)

  win.once('ready-to-show', () => {
    if (!process.env['CJ_SCREENSHOT_DIR']) win?.show()
  })

  // External links go to the default browser, never a new Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:') && !url.startsWith(process.env['ELECTRON_RENDERER_URL'] ?? '\0')) {
      e.preventDefault()
      if (/^https?:/i.test(url)) void shell.openExternal(url)
    }
  })

  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (!app.isPackaged && devUrl) void win.loadURL(devUrl)
  else void win.loadFile(join(__dirname, '../renderer/index.html'))

  if (process.env['CJ_SCREENSHOT_DIR']) void runScreenshots(win, process.env['CJ_SCREENSHOT_DIR'])
}

// --- Data persistence: one JSON file in userData, atomic write + backup ---
ipcMain.handle('data:load', async () => {
  const file = DATA_FILE()
  for (const f of [file, file + '.bak']) {
    try {
      return JSON.parse(await readFile(f, 'utf8'))
    } catch {
      /* try next */
    }
  }
  return null
})

let writing = Promise.resolve()
ipcMain.handle('data:save', (_e, data: unknown) => {
  const file = DATA_FILE()
  writing = writing.then(async () => {
    mkdirSync(app.getPath('userData'), { recursive: true })
    const tmp = file + '.tmp'
    await writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
    if (existsSync(file)) await copyFile(file, file + '.bak').catch(() => undefined)
    await rename(tmp, file)
  })
  return writing.then(() => true)
})

ipcMain.handle('data:path', () => DATA_FILE())
ipcMain.handle('data:reveal', () => shell.showItemInFolder(DATA_FILE()))

ipcMain.handle(
  'file:save',
  async (_e, opts: { defaultName: string; content: string; filters: { name: string; extensions: string[] }[] }) => {
    if (!win) return null
    const res = await dialog.showSaveDialog(win, {
      defaultPath: join(app.getPath('documents'), opts.defaultName),
      filters: opts.filters
    })
    if (res.canceled || !res.filePath) return null
    await writeFile(res.filePath, opts.content, 'utf8')
    return res.filePath
  }
)

ipcMain.handle('file:open', async (_e, opts: { filters: { name: string; extensions: string[] }[] }) => {
  if (!win) return null
  const res = await dialog.showOpenDialog(win, { properties: ['openFile'], filters: opts.filters })
  if (res.canceled || !res.filePaths[0]) return null
  return readFile(res.filePaths[0], 'utf8')
})

ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('link:open', (_e, url: string) => {
  if (/^https?:\/\//i.test(url)) void shell.openExternal(url)
})
ipcMain.on('theme:set', (_e, theme: 'dark' | 'light') => {
  nativeTheme.themeSource = theme
  win?.setBackgroundColor(theme === 'dark' ? '#111110' : '#efefec')
})

// --- Custom window controls (frameless window) ---
const fromOurWindow = (e: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent): boolean => !!win && e.sender === win.webContents
ipcMain.on('win:minimize', (e) => {
  if (fromOurWindow(e)) win?.minimize()
})
ipcMain.on('win:toggle-maximize', (e, source?: string) => {
  if (!fromOurWindow(e) || !win) return
  // A double-click on the drag strip may also be handled by the OS itself;
  // skip ours if the OS just changed the state.
  if (source === 'dblclick' && Date.now() - lastMaxChange < 400) return
  if (win.isMaximized()) win.unmaximize()
  else win.maximize()
})
ipcMain.on('win:close', (e) => {
  if (fromOurWindow(e)) win?.close()
})
ipcMain.handle('win:is-maximized', (e) => (fromOurWindow(e) ? !!win?.isMaximized() : false))

// --- Screenshot mode (dev/QA only): CJ_SCREENSHOT_DIR=/path electron . ---
async function runScreenshots(w: BrowserWindow, dir: string): Promise<void> {
  mkdirSync(dir, { recursive: true })
  const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))
  await new Promise<void>((r) => w.webContents.once('did-finish-load', () => r()))
  w.setContentSize(1440, 900)
  w.showInactive()
  await wait(2500)
  const shots = (process.env['CJ_SHOTS'] ?? '').split(',').filter(Boolean)
  for (const s of shots) {
    const [name, script] = s.split('=')
    await w.webContents.executeJavaScript(`window.__cj && window.__cj(${JSON.stringify(script)})`)
    await wait(1400)
    const img = await w.webContents.capturePage()
    writeFileSync(join(dir, `${name}.png`), img.toPNG())
  }
  app.quit()
}

if (process.platform === 'win32') app.setAppUserModelId('io.github.0xbasinas.cyberjourney')

if (!process.env['CJ_SCREENSHOT_DIR'] && !app.requestSingleInstanceLock()) app.quit()
app.on('second-instance', () => {
  if (!win) return
  if (win.isMinimized()) win.restore()
  win.focus()
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
