import type { ReactNode, Ref } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

/**
 * One infographic of the bento grid: a title, the animated visual, and a caption
 * that explains the current step. `stepperRef` comes from useStepper, so the
 * animation only runs while the card is on screen.
 */
export function InfoCard({
  stepperRef,
  index,
  title,
  lead,
  caption,
  captionKey,
  children,
  className,
}: {
  stepperRef: Ref<HTMLDivElement>
  index: number
  title: string
  lead: string
  caption: ReactNode
  captionKey: string | number
  children: ReactNode
  className?: string
}) {
  return (
    <div
      ref={stepperRef}
      className={cn(
        'group relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-6',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-brand/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />
      <header className="relative mb-4">
        <p className="mb-1.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          {String(index).padStart(2, '0')}
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-balance">{title}</h3>
        <p className="mt-1 text-sm text-pretty text-muted-foreground">{lead}</p>
      </header>

      <div className="relative flex flex-1 flex-col justify-center">{children}</div>

      <div className="relative mt-4 min-h-[2.75rem] border-t pt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={captionKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease }}
            className="text-sm text-pretty text-foreground/90"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Progress dots under a visual: which step of the story we are on. */
export function StepDots({ count, step, onPick }: { count: number; step: number; onPick: (n: number) => void }) {
  const t = useT()
  return (
    <div className="mt-3 flex justify-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={t({ en: `Show step ${i + 1} of ${count}`, es: `Ver el paso ${i + 1} de ${count}` })}
          aria-current={i === step ? 'step' : undefined}
          onClick={() => onPick(i)}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i === step ? 'w-5 bg-brand' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60',
          )}
        />
      ))}
    </div>
  )
}
