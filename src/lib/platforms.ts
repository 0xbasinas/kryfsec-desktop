export const PLATFORMS = ['TryHackMe', 'Hack The Box', 'PortSwigger', 'OverTheWire', 'picoCTF', 'VulnHub', 'CyberDefenders', 'Blue Team Labs', 'Root-Me', 'PentesterLab', 'Other']

const COLORS: Record<string, string> = {
  tryhackme: '#ef4444',
  'hack the box': '#9fef00',
  hackthebox: '#9fef00',
  portswigger: '#ff6633',
  overthewire: '#38bdf8',
  picoctf: '#818cf8',
  vulnhub: '#f59e0b',
  cyberdefenders: '#22d3ee',
  'blue team labs': '#60a5fa',
  'root-me': '#f472b6',
  pentesterlab: '#34d399'
}

export function platformColor(p: string): string {
  const c = COLORS[p.trim().toLowerCase()]
  if (c) return c
  let h = 0
  for (const ch of p) h = (h * 31 + ch.charCodeAt(0)) % 360
  return `hsl(${h} 70% 60%)`
}

export const DIFF_META = {
  easy: { label: 'Easy', color: '#34d399' },
  medium: { label: 'Medium', color: '#facc15' },
  hard: { label: 'Hard', color: '#fb923c' },
  insane: { label: 'Insane', color: '#f87171' }
} as const
