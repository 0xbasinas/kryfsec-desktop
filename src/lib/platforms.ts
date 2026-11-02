export const PLATFORMS = ['TryHackMe', 'Hack The Box', 'PortSwigger', 'OverTheWire', 'picoCTF', 'VulnHub', 'CyberDefenders', 'Blue Team Labs', 'Root-Me', 'PentesterLab', 'Other']

const COLORS: Record<string, string> = {
  tryhackme: 'var(--c-red)',
  'hack the box': 'var(--c-grass)',
  hackthebox: 'var(--c-grass)',
  portswigger: 'var(--c-orange)',
  overthewire: 'var(--c-sky)',
  picoctf: 'var(--c-iris)',
  vulnhub: 'var(--c-amber)',
  cyberdefenders: 'var(--c-cyan)',
  'blue team labs': 'var(--c-blue)',
  'root-me': 'var(--c-pink)',
  pentesterlab: 'var(--c-jade)'
}

export function platformColor(p: string): string {
  const c = COLORS[p.trim().toLowerCase()]
  if (c) return c
  let h = 0
  for (const ch of p) h = (h * 31 + ch.charCodeAt(0)) % 360
  const pool = ['jade', 'cyan', 'blue', 'iris', 'violet', 'pink', 'orange', 'amber', 'teal', 'plum']
  return `var(--c-${pool[h % pool.length]})`
}

export const DIFF_META = {
  easy: { label: 'Easy', color: 'var(--c-grass)' },
  medium: { label: 'Medium', color: 'var(--c-amber)' },
  hard: { label: 'Hard', color: 'var(--c-orange)' },
  insane: { label: 'Insane', color: 'var(--c-red)' }
} as const
