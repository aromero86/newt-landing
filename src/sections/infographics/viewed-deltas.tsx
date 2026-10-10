import { AnimatePresence, motion } from 'motion/react'
import { FileTextIcon } from 'lucide-react'
import { ease, useStepper } from '@/lib/motion'
import { useStory } from '@/lib/data'
import { useT, type Bi } from '@/lib/i18n'
import type { DeltaState } from '@/lib/data'
import { ArtifactTag, DeltaBadge, ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { InfoCard, StepDots } from './card'

/** Revision 2 rewrites the payment paragraph: only Δ1 changes. */
const changedInR2 = 'Δ1'

const steps: Bi[] = [
  {
    en: 'Revision 1: newt extracts five deltas from the document. All pending.',
    es: 'Revision 1: newt extrae cinco deltas del documento. Todos pending.',
  },
  { en: 'Reviewers approve them one by one.', es: 'Quienes revisan los aprueban uno a uno.' },
  {
    en: 'Revision 2 edits one paragraph. Only Δ1 changed: it goes back to pending, showing what changed.',
    es: 'La revision 2 cambia un párrafo. Solo cambió Δ1: vuelve a pending y enseña qué cambió.',
  },
  {
    en: 'Δ1 is approved again. The other four never had to be looked at twice.',
    es: 'Δ1 se vuelve a aprobar. Los otros cuatro no hubo que mirarlos dos veces.',
  },
]

export function ViewedDeltas({ className }: { className?: string }) {
  const t = useT()
  const { deltas, proposal, rules } = useStory()
  const { ref, step, setStep } = useStepper(steps.length, { interval: 2600 })

  const stateOf = (id: string): DeltaState => {
    if (step === 0) return 'pending'
    if (step === 2 && id === changedInR2) return 'pending'
    return 'approved'
  }

  return (
    <InfoCard
      stepperRef={ref}
      index={3}
      title={t({ en: 'Deltas work like viewed files', es: 'Los deltas funcionan como ficheros vistos' })}
      lead={t({
        en: "Iterating a proposal doesn't reset the review: approved deltas that don't change stay approved.",
        es: 'Iterar una proposal no reinicia la revisión: los deltas aprobados que no cambian siguen aprobados.',
      })}
      caption={t(steps[step]!)}
      captionKey={step}
      className={className}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
        <FileTextIcon className="size-3.5 text-muted-foreground" />
        <span className="font-mono text-muted-foreground">{proposal.id}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={step >= 2 ? 'r2' : 'r1'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="rounded-md border bg-background/60 px-1.5 py-0.5 font-mono">
            revision {step >= 2 ? 2 : 1}
          </motion.span>
        </AnimatePresence>
        <span className="ml-auto">
          <ProposalBadge state="in review" />
        </span>
      </div>

      <ul className="space-y-1.5">
        {deltas.map((d, i) => {
          const state = stateOf(d.id)
          const changed = d.id === changedInR2 && step >= 2
          return (
            <motion.li
              key={d.id}
              layout
              className={cn(
                'rounded-lg border px-2.5 py-1.5 transition-colors duration-500',
                changed && step === 2 ? 'border-warn/50 bg-warn/8' : 'bg-background/50',
              )}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  aria-hidden
                  className={cn(
                    'flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-300',
                    state === 'approved' ? 'border-ok bg-ok' : 'border-muted-foreground/40',
                  )}
                  animate={state === 'approved' ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35, delay: step === 1 ? i * 0.18 : 0 }}
                >
                  {state === 'approved' && (
                    <svg viewBox="0 0 12 12" className="size-2.5 text-background">
                      <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.span>
                <span className="font-mono text-[11px]">{d.id}</span>
                <ArtifactTag kind={d.kind} id={d.artifact} />
                <span className="ml-auto">
                  <DeltaBadge state={state} />
                </span>
              </div>
              <AnimatePresence initial={false}>
                {changed && step === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <p className="mt-1.5 text-[11px] leading-snug">
                      <span className="text-bad line-through decoration-bad/60">{d.after}</span>
                      <br />
                      <span className="text-ok">{rules.guestsPayBizum.text}</span>
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-warn">{t({ en: 'changed since your approval', es: 'cambió desde tu aprobación' })}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ul>
      <StepDots count={steps.length} step={step} onPick={setStep} />
    </InfoCard>
  )
}
