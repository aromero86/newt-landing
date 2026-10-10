import { motion, AnimatePresence } from 'motion/react'
import { BugIcon, FileTextIcon, FilterIcon } from 'lucide-react'
import { AppWindow } from '@/components/mock/window'
import { DimensionChip } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { FakeCursor } from '@/lib/typing'
import { useStepper } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Item = { id: string; title: string; col: number; bug?: boolean; surface: string; who?: string }

const items: Item[] = [
  { id: 'PROP-51', title: 'Loyalty points', col: 0, surface: 'Web' },
  { id: 'BUG-80', title: 'Coupon field hidden on Android', col: 0, bug: true, surface: 'Mobile app' },
  { id: 'PROP-42', title: 'Guests pay with Bizum', col: 1, surface: 'Mobile app', who: 'Marc' },
  { id: 'PROP-45', title: 'Shipping rules for Mexico', col: 1, surface: 'Web', who: 'Ana' },
  { id: 'BUG-77', title: 'Crash on Bizum timeout (iOS)', col: 1, bug: true, surface: 'Mobile app', who: 'Marc' },
  { id: 'PROP-39', title: 'Refund approvals', col: 2, surface: 'Backoffice', who: 'Ana' },
  { id: 'PROP-40', title: 'Order history for guests', col: 2, surface: 'Mobile app', who: 'Marc' },
  { id: 'PROP-36', title: 'Saved addresses', col: 3, surface: 'Web' },
]
const cols = ['Product', 'To do', 'In progress', 'Done']

/** The board, filtering itself down to the mobile app and back. */
export function BoardScreen() {
  const { ref, step } = useStepper(3, { interval: 2200, hold: 1.4 })
  const filtered = step >= 1
  const visible = items.filter(i => !filtered || i.surface === 'Mobile app')
  return (
    <div ref={ref}>
      <AppWindow crumbs={['acme-shop', 'Board']} bodyClassName="p-3">
        <FakeCursor x={filtered ? 13 : 32} y={filtered ? 30 : 60} click={step === 1} visible={step < 2} />
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <DimensionChip name="surface" value="Mobile app" active={filtered} />
          <DimensionChip name="market" value="Any" />
          <DimensionChip name="type" value="Proposals & bugs" />
          <span className="ml-auto text-[11px] text-muted-foreground">{visible.length} items</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {cols.map((c, ci) => (
            <div key={c} className="min-h-[190px] rounded-lg bg-subtle p-1.5">
              <div className="mb-1.5 px-1 text-[11px] font-medium text-muted-foreground">{c}</div>
              <div className="flex flex-col gap-1.5">
                <AnimatePresence mode="popLayout">
                  {visible
                    .filter(i => i.col === ci)
                    .map(i => (
                      <motion.div
                        key={i.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        className={cn('rounded-md border bg-card p-1.5 text-[10px]', i.bug && 'border-bad/30')}
                      >
                        <div className="flex items-center gap-1 font-mono text-muted-foreground">
                          {i.bug ? <BugIcon className="size-2.5 text-bad" /> : <FileTextIcon className="size-2.5 text-brand" />}
                          {i.id}
                          {i.who && <Avatar name={i.who} className="ml-auto size-3.5 text-[7px]" />}
                        </div>
                        <div className="mt-0.5 leading-snug">{i.title}</div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </AppWindow>
    </div>
  )
}
