import { AnimatePresence, motion } from 'motion/react'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag } from '@/components/mock/status'
import { useStepper } from '@/lib/motion'
import { cn } from '@/lib/utils'

const items = [
  { kind: 'rule' as const, id: 'R-12', current: 'Guests cannot pay.', planned: 'Guests can pay only with Bizum, up to €500, in the app.' },
  { kind: 'rule' as const, id: 'R-31', current: null, planned: "A guest's invoice is emailed to the checkout address." },
  { kind: 'lifecycle' as const, id: 'Order', current: 'created → paid → shipped', planned: 'created → awaiting Bizum → paid → shipped' },
  { kind: 'rule' as const, id: 'R-04', current: 'Shipping is free above the threshold.', planned: 'Shipping is free above the threshold.' },
  { kind: 'parameter' as const, id: 'free_shipping', current: '€50 (Spain)', planned: '€40 (Spain)' },
]

/** Flips between the current definition and the planned one, highlighting what changes. */
export function DefinitionScreen() {
  const { ref, step } = useStepper(2, { interval: 2800, hold: 1 })
  const planned = step === 1
  return (
    <div ref={ref}>
      <AppWindow crumbs={['acme-shop', 'Definition']} bodyClassName="p-3">
        <div className="mb-3 flex items-center gap-1 rounded-lg bg-muted p-1 text-[11px]">
          {['Current', 'Planned'].map((t, i) => (
            <span key={t} className="relative flex-1 rounded-md py-1 text-center">
              {(i === 1) === planned && <motion.span layoutId="def-tab" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
              <span className="relative">{t}</span>
            </span>
          ))}
        </div>
        <ul className="flex flex-col gap-1.5 text-[11px]">
          {items.map(it => {
            const text = planned ? it.planned : it.current
            const changed = it.current !== it.planned
            return (
              <li key={it.id} className={cn('flex min-h-9 items-start gap-2 rounded-md border bg-card p-2 transition-colors', planned && changed && 'border-brand/50 bg-brand/5')}>
                <ArtifactTag kind={it.kind} id={it.id} />
                <AnimatePresence mode="wait">
                  <motion.span key={String(planned)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className={cn('leading-snug', !text && 'text-muted-foreground italic')}>
                    {text ?? 'not yet'}
                  </motion.span>
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {planned ? 'Includes PROP-42 and PROP-45, accepted and waiting for their code.' : 'What is merged and running in production today.'}
        </p>
      </AppWindow>
    </div>
  )
}
