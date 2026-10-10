import type { ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { GitMergeIcon, GitPullRequestIcon } from 'lucide-react'
import { ease, useStepper } from '@/lib/motion'
import { pr, proposal, rules } from '@/lib/data'
import { ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { InfoCard, StepDots } from './card'

const steps = [
  'PROP-42 is accepted: it joins the planned definition, waiting for its code.',
  `PR #${pr.number} implements it and gets merged on GitHub.`,
  'PROP-42 is merged: the current definition catches up with the plan.',
]

/** Current (merged) vs planned (+ accepted) definition, and PROP-42 moving across. */
export function CurrentVsPlanned({ className }: { className?: string }) {
  const { ref, step, setStep } = useStepper(steps.length, { interval: 2600 })
  const merged = step >= 2

  return (
    <InfoCard
      stepperRef={ref}
      index={1}
      title="Current vs planned definition"
      lead="What the product does today, and what it will do once accepted proposals ship."
      caption={steps[step]}
      captionKey={step}
      className={className}
    >
      <LayoutGroup>
        <div className="grid grid-cols-2 gap-3">
          <Column title="Current" hint="merged · in production" tone="current">
            <RuleRow id={rules.paidOrderImmutable.id} text={rules.paidOrderImmutable.text} />
            <RuleRow id={rules.freeShipping.id} text={rules.freeShipping.text} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={merged ? 'new' : 'old'}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease }}
              >
                <RuleRow
                  id={rules.guestsCannotPay.id}
                  text={merged ? 'Guests can pay only with Bizum, in the mobile app.' : rules.guestsCannotPay.text}
                  changed={merged}
                />
              </motion.div>
            </AnimatePresence>
            {merged && <ProposalChip state="merged" />}
          </Column>

          <Column title="Planned" hint="current + accepted" tone="planned">
            <p className="text-[11px] text-muted-foreground">Everything in current, plus:</p>
            {!merged ? (
              <ProposalChip state="accepted" />
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-dashed px-2 py-3 text-center text-[11px] text-muted-foreground"
              >
                Nothing pending: planned = current
              </motion.p>
            )}
          </Column>
        </div>
      </LayoutGroup>

      <div className="mt-3 flex h-6 items-center justify-center">
        <AnimatePresence>
          {step >= 1 && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px]',
                merged ? 'border-[#8250df]/40 bg-[#8250df]/15 text-[#a371f7]' : 'border-ok/40 bg-ok/12 text-ok',
              )}
            >
              {merged ? <GitMergeIcon className="size-3" /> : <GitPullRequestIcon className="size-3" />}
              PR #{pr.number} {merged ? 'merged' : 'open'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <StepDots count={steps.length} step={step} onPick={setStep} />
    </InfoCard>
  )
}

function Column({ title, hint, tone, children }: { title: string; hint: string; tone: 'current' | 'planned'; children: ReactNode }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2 rounded-xl border p-3', tone === 'current' ? 'bg-background/50' : 'border-dashed border-brand/40 bg-brand/5')}>
      <div className="mb-0.5">
        <p className="text-sm font-semibold">{title}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
  )
}

function RuleRow({ id, text, changed }: { id: string; text: string; changed?: boolean }) {
  return (
    <div className={cn('rounded-md border bg-card px-2 py-1.5 transition-colors duration-500', changed && 'border-[#8250df]/40 bg-[#8250df]/10')}>
      <span className="font-mono text-[10px] text-brand">{id}</span>
      <p className="text-[11px] leading-snug text-foreground/85">{text}</p>
    </div>
  )
}

function ProposalChip({ state }: { state: 'accepted' | 'merged' }) {
  return (
    <motion.div
      layoutId="prop-42-chip"
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="rounded-lg border bg-card px-2 py-2 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[10px] text-muted-foreground">{proposal.id}</span>
        <ProposalBadge state={state} />
      </div>
      <p className="mt-1 text-[11px] leading-snug">{proposal.title}</p>
    </motion.div>
  )
}
