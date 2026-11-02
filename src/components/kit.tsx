import { create } from 'zustand'
import { IconDownload, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { Badge, Button, Card, Input, Kbd, Progress, Ring } from './ui'

// QA-only gallery of the real UI components, used by the component
// screenshot runner (scripts/component-shots.cjs). Never shown otherwise.
export const useKit = create<{ on: boolean }>(() => ({ on: false }))

export function Kit(): React.JSX.Element | null {
  const on = useKit((s) => s.on)
  if (!on) return null
  return (
    <div className="fixed inset-0 z-[70] overflow-auto bg-bg p-8">
      <div className="flex w-[760px] flex-col gap-6">
        <Card id="kit-buttons" className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">
              <IconPlus />
              Primary
            </Button>
            <Button>Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">
              <IconTrash />
              Delete
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              <IconPlus />
              Small
            </Button>
            <Button size="sm">
              <IconDownload />
              Small
            </Button>
            <Button variant="ghost" size="sm">
              Small ghost
            </Button>
            <Button size="icon" aria-label="Edit">
              <IconPencil />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Delete">
              <IconTrash />
            </Button>
          </div>
        </Card>
        <Card id="kit-states" className="flex items-center gap-6 p-5">
          {(['rest', 'hover', 'focus'] as const).map((st) => (
            <div key={st} className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                <Button id={`kit-${st}-p`} variant="primary">
                  Primary
                </Button>
                <Button id={`kit-${st}-s`}>Secondary</Button>
              </div>
              <span className="text-[11px] text-faint">{st}</span>
            </div>
          ))}
        </Card>
        <Card id="kit-badges" className="flex flex-wrap items-center gap-2 p-5">
          <Badge>Default</Badge>
          <Badge tone="accent">Done</Badge>
          <Badge tone="info">Learning</Badge>
          <Badge tone="muted">Not started</Badge>
          <Badge tone="success" dot>
            Passed
          </Badge>
          <Badge tone="warn">In 5 days</Badge>
          <Badge tone="danger">2 days late</Badge>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </Card>
        <Card id="kit-progress" className="flex items-center gap-6 p-5">
          <div className="flex w-64 flex-col gap-3">
            <Progress value={25} />
            <Progress value={60} />
            <Progress value={100} />
          </div>
          <Ring value={16} size={52}>
            16%
          </Ring>
          <Ring value={72} size={52}>
            72%
          </Ring>
        </Card>
        <Card id="kit-inputs" className="grid grid-cols-2 gap-3 p-5">
          <Input placeholder="Empty input" />
          <Input defaultValue="Typed value" />
          <Input id="kit-focus-input" defaultValue="Focused input" />
          <Input disabled defaultValue="Disabled" />
        </Card>
      </div>
    </div>
  )
}
