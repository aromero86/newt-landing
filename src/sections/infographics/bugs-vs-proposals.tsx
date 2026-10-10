import { AnimatePresence, motion } from 'motion/react'
import { ActivityIcon, CheckIcon, GitPullRequestIcon, MinusIcon } from 'lucide-react'
import { ease, useStepper } from '@/lib/motion'
import { bug } from '@/lib/data'
import { ArtifactTag, BugBadge, ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { InfoCard, StepDots } from './card'
import { CountUp } from './count-up'

const steps = [
  `Monitoring reports a crash. Repeats become occurrences of ${bug.id}, not new bugs.`,
  `Reproduced: ${bug.id} is confirmed and linked to the lifecycle it breaks.`,
  'The code was wrong: a fix PR resolves it. The definition does not change.',
  'Or fixing it needs a decision: a correction proposal changes the definition first.',
]

const compare = [
  { what: 'Changes the definition', bug: false, proposal: true },
  { what: 'Has deltas', bug: false, proposal: true },
  { what: 'Goes through the gate', bug: false, proposal: true },
  { what: 'Linked to artifacts', bug: true, proposal: true },
]

export function BugsVsProposals({ className }: { className?: string }) {
  const { ref, step, setStep } = useStepper(steps.length, { interval: 2600 })

  return (
    <InfoCard
      stepperRef={ref}
      index={6}
      title="Bugs are not proposals"
      lead="Like an issue and a pull request: a bug says the product misbehaves; a proposal changes what it should do."
      caption={steps[step]}
      captionKey={step}
      className={className}
    >
      {/* The bug's journey */}
      <div className="rounded-xl border bg-background/50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{bug.id}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={step < 1 ? 'r' : step < 2 ? 'c' : 'x'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <BugBadge state={step === 0 ? 'reported' : step === 1 ? 'confirmed' : step === 2 ? 'resolved' : 'confirmed'} />
            </motion.span>
          </AnimatePresence>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <ActivityIcon className="size-3" /> <CountUp to={bug.occurrences} run duration={2.2} /> occurrences
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-snug">{bug.title}</p>

        <div className="mt-2 flex min-h-6 flex-wrap items-center gap-1.5">
          <AnimatePresence>
            {step >= 1 && (
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                breaks <ArtifactTag kind={bug.violates.kind} id={bug.violates.id} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* How it gets resolved */}
        <div className="mt-2 min-h-[2.4rem]">
          <AnimatePresence mode="wait" initial={false}>
            {step === 2 && (
              <motion.div key="pr" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }} className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ok/8 px-2.5 py-1.5 text-[11px]">
                <GitPullRequestIcon className="size-3.5 shrink-0 text-ok" />
                <span><span className="font-mono">PR #326</span> fix(orders): keep order awaiting Bizum on timeout → <span className="text-ok">resolves {bug.id}</span></span>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="prop" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }} className="flex flex-wrap items-center gap-2 rounded-lg border border-warn/40 bg-warn/8 px-2.5 py-1.5 text-[11px]">
                <span className="font-mono">PROP-47</span> correction: cancel unpaid Bizum orders after 15 min
                <ProposalBadge state="in review" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bug vs proposal, side by side */}
      <table className="mt-3 w-full text-left text-[11px]">
        <thead>
          <tr className="text-muted-foreground">
            <th className="py-1 font-normal" />
            <th className="w-16 py-1 text-center font-medium">Bug</th>
            <th className="w-16 py-1 text-center font-medium">Proposal</th>
          </tr>
        </thead>
        <tbody>
          {compare.map(row => (
            <tr key={row.what} className="border-t">
              <td className="py-1 pr-2 text-foreground/85">{row.what}</td>
              <td className="text-center"><Mark yes={row.bug} /></td>
              <td className="text-center"><Mark yes={row.proposal} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <StepDots count={steps.length} step={step} onPick={setStep} />
    </InfoCard>
  )
}

function Mark({ yes }: { yes: boolean }) {
  return yes ? (
    <CheckIcon className={cn('mx-auto size-3.5 text-ok')} aria-label="yes" />
  ) : (
    <MinusIcon className="mx-auto size-3.5 text-muted-foreground/60" aria-label="no" />
  )
}
