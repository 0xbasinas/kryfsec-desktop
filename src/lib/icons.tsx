import {
  IconArticle,
  IconBook,
  IconCloudLock,
  IconCode,
  IconDeviceGamepad2,
  IconKey,
  IconNetwork,
  IconSchool,
  IconShield,
  IconShieldHalf,
  IconSword,
  IconTerminal2,
  IconTool,
  IconVideo,
  IconWorldWww,
  type Icon
} from '@tabler/icons-react'
import type { AreaIcon, ResourceKind } from './types'

export const AREA_ICONS: Record<AreaIcon, Icon> = {
  network: IconNetwork,
  linux: IconTerminal2,
  web: IconWorldWww,
  crypto: IconKey,
  pentest: IconSword,
  blue: IconShieldHalf,
  cloud: IconCloudLock,
  code: IconCode,
  shield: IconShield
}

export const KIND_META: Record<ResourceKind, { label: string; icon: Icon; color: string }> = {
  course: { label: 'Course', icon: IconSchool, color: '#34d399' },
  book: { label: 'Book', icon: IconBook, color: '#facc15' },
  video: { label: 'Video', icon: IconVideo, color: '#f87171' },
  platform: { label: 'Platform', icon: IconDeviceGamepad2, color: '#22d3ee' },
  article: { label: 'Article', icon: IconArticle, color: '#a78bfa' },
  tool: { label: 'Tool', icon: IconTool, color: '#fb923c' }
}

export const AREA_COLORS = ['#22d3ee', '#34d399', '#facc15', '#fb923c', '#f87171', '#f472b6', '#a78bfa', '#60a5fa']

export function AreaGlyph({ icon, color, size = 'md' }: { icon: AreaIcon; color: string; size?: 'sm' | 'md' | 'lg' }): React.JSX.Element {
  const I = AREA_ICONS[icon] ?? IconShield
  const box = size === 'sm' ? 'size-6 rounded-md' : size === 'lg' ? 'size-11 rounded-xl' : 'size-8 rounded-lg'
  const ic = size === 'sm' ? 14 : size === 'lg' ? 22 : 17
  return (
    <span
      className={`grid shrink-0 place-items-center ${box}`}
      style={{ color, background: `color-mix(in srgb, ${color} 13%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <I size={ic} stroke={1.8} />
    </span>
  )
}
