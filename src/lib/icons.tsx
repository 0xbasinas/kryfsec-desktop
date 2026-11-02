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
  course: { label: 'Course', icon: IconSchool, color: 'var(--c-jade)' },
  book: { label: 'Book', icon: IconBook, color: 'var(--c-amber)' },
  video: { label: 'Video', icon: IconVideo, color: 'var(--c-red)' },
  platform: { label: 'Platform', icon: IconDeviceGamepad2, color: 'var(--c-cyan)' },
  article: { label: 'Article', icon: IconArticle, color: 'var(--c-violet)' },
  tool: { label: 'Tool', icon: IconTool, color: 'var(--c-orange)' }
}

export const AREA_COLORS = ['var(--c-periwinkle)', 'var(--c-sage)', 'var(--c-sand)', 'var(--c-rose)', 'var(--c-slate)', 'var(--c-mauve)', 'var(--c-clay)', 'var(--c-teal)', 'var(--c-olive)']

export function AreaGlyph({ icon, color, size = 'md' }: { icon: AreaIcon; color: string; size?: 'sm' | 'md' | 'lg' }): React.JSX.Element {
  const I = AREA_ICONS[icon] ?? IconShield
  const box = size === 'sm' ? 'size-6 rounded-[8px]' : size === 'lg' ? 'size-11 rounded-[14px]' : 'size-8 rounded-[10px]'
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
