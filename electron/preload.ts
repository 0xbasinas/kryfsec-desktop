import { contextBridge, ipcRenderer } from 'electron'

type Filter = { name: string; extensions: string[] }

const api = {
  platform: process.platform,
  loadData: (): Promise<unknown> => ipcRenderer.invoke('data:load'),
  saveData: (data: unknown): Promise<boolean> => ipcRenderer.invoke('data:save', data),
  dataPath: (): Promise<string> => ipcRenderer.invoke('data:path'),
  revealData: (): Promise<void> => ipcRenderer.invoke('data:reveal'),
  saveFile: (defaultName: string, content: string, filters: Filter[]): Promise<string | null> =>
    ipcRenderer.invoke('file:save', { defaultName, content, filters }),
  openFile: (filters: Filter[]): Promise<string | null> => ipcRenderer.invoke('file:open', { filters }),
  openLink: (url: string): Promise<void> => ipcRenderer.invoke('link:open', url),
  setTheme: (theme: 'dark' | 'light'): void => ipcRenderer.send('theme:set', theme),
  version: (): Promise<string> => ipcRenderer.invoke('app:version'),
  win: {
    minimize: (): void => ipcRenderer.send('win:minimize'),
    toggleMaximize: (source?: 'button' | 'dblclick'): void => ipcRenderer.send('win:toggle-maximize', source),
    close: (): void => ipcRenderer.send('win:close'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('win:is-maximized'),
    /** Calls cb(true/false) when the window is maximized or restored. Returns an unsubscribe function. */
    onMaximizedChange: (cb: (maximized: boolean) => void): (() => void) => {
      const h = (_e: Electron.IpcRendererEvent, v: boolean): void => cb(!!v)
      ipcRenderer.on('win:maximized', h)
      return () => ipcRenderer.removeListener('win:maximized', h)
    }
  }
}

export type Api = typeof api

contextBridge.exposeInMainWorld('api', api)
