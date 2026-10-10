import { motion } from 'motion/react'
import { GitMergeIcon, LayersIcon, TagIcon } from 'lucide-react'
import { useStepper } from '@/lib/motion'
import { proposal, releases } from '@/lib/data'
import { GithubMark } from '@/components/site/icons'
import { cn } from '@/lib/utils'
import { InfoCard, StepDots } from './card'

/** What gets merged between v2.3.0 and v2.4.0, on both sides, in order. */
const between = [
  { prop: 'PROP-39', pr: 301, at: 0.3 },
  { prop: 'PROP-40', pr: 309, at: 0.5 },
  { prop: proposal.id, pr: 318, at: 0.72 },
]

/** What v2.4.0 changed in the product, as developers read it. */
const changelog = [
  { kind: 'Changed', tone: 'text-warn', text: 'Guests can pay only with Bizum, in the mobile app, up to €500. (was: Guests cannot pay.)' },
  { kind: 'New', tone: 'text-ok', text: "A guest's invoice is emailed to the address used at checkout." },
  { kind: 'New', tone: 'text-ok', text: 'Order lifecycle: created → awaiting Bizum → paid → shipped.' },
]

const steps = [
  `${releases[0].version}: the same version on both sides.`,
  'Proposals get merged as their PRs get merged on GitHub.',
  `${proposal.id} lands with PR #318.`,
  `A GitHub release creates the product release: ${releases[1].version}, with its changelog.`,
]

export function Versions({ className }: { className?: string }) {
  const { ref, step, setStep } = useStepper(steps.length, { interval: 2300 })
  const progress = [0.12, 0.55, 0.78, 1][step]!
  const shown = between.filter(b => b.at <= progress)

  return (
    <InfoCard
      stepperRef={ref}
      index={5}
      title="Product and code share one version"
      lead="A proposal is merged when its code is. A release is the same moment in newt and on GitHub."
      caption={steps[step]}
      captionKey={step}
      className={className}
    >
      <div className="relative rounded-xl border bg-background/50 px-3 py-4">
        {/* Lane labels */}
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium">
          <LayersIcon className="size-3.5 text-brand" /> Product · newt
        </div>
        <Lane progress={progress} items={shown.map(b => ({ key: b.prop, at: b.at, label: b.prop, tone: 'product' as const }))} releaseShown={step >= 3} />

        <div className="mt-5 mb-2 flex items-center gap-1.5 text-[11px] font-medium">
          <GithubMark className="size-3.5" /> Code · GitHub
        </div>
        <Lane progress={progress} items={shown.map(b => ({ key: `pr-${b.pr}`, at: b.at, label: `#${b.pr}`, tone: 'code' as const }))} releaseShown={step >= 3} />

        {/* The release markers, linked across lanes */}
        <ReleaseLink at={0.06} version={releases[0].version} shown />
        <ReleaseLink at={0.96} version={releases[1].version} shown={step >= 3} />
      </div>

      {/* The changelog the release comes with */}
      <motion.div
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0.35 }}
        transition={{ duration: 0.5 }}
        className="mt-3 rounded-xl border bg-background/50 p-3"
      >
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium">
          <TagIcon className="size-3 text-brand" /> {releases[1].version} · changelog
        </p>
        <ul className="space-y-1 text-[11px]">
          {changelog.map(c => (
            <li key={c.text} className="flex gap-2">
              <span className={cn('w-16 shrink-0 font-mono', c.tone)}>{c.kind}</span>
              <span className="text-foreground/85">{c.text}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <StepDots count={steps.length} step={step} onPick={setStep} />
    </InfoCard>
  )
}

function Lane({
  progress,
  items,
  releaseShown,
}: {
  progress: number
  items: { key: string; at: number; label: string; tone: 'product' | 'code' }[]
  releaseShown: boolean
}) {
  return (
    <div className="relative h-9">
      <div className="absolute inset-x-0 top-2 h-px bg-border" />
      <motion.div
        aria-hidden
        className="absolute top-2 left-0 h-px bg-gradient-to-r from-brand to-brand-2"
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {items.map(item => (
        <motion.div
          key={item.key}
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${item.at * 100}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span className="flex size-4 items-center justify-center rounded-full border border-[#8250df]/50 bg-[#8250df]/20">
            <GitMergeIcon className="size-2.5 text-[#a371f7]" />
          </span>
          <span className="mt-0.5 font-mono text-[9px] whitespace-nowrap text-muted-foreground sm:text-[10px]">{item.label}</span>
        </motion.div>
      ))}
      <span className={cn('absolute top-[3px] left-[6%] size-3 -translate-x-1/2 rounded-full border-2 border-brand bg-card')} />
      <span
        className={cn(
          'absolute top-[3px] left-[96%] size-3 -translate-x-1/2 rounded-full border-2 bg-card transition-colors duration-500',
          releaseShown ? 'border-brand' : 'border-border',
        )}
      />
    </div>
  )
}

/** A dashed vertical line joining the same release on both lanes, with its tag. */
function ReleaseLink({ at, version, shown }: { at: number; version: string; shown: boolean }) {
  return (
    <motion.div
      aria-hidden={!shown}
      className="pointer-events-none absolute top-8 bottom-1 flex -translate-x-1/2 flex-col items-center"
      style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${at})` }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-px flex-1 border-l border-dashed border-brand/60" />
      <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-brand/40 bg-card px-1.5 py-0.5 font-mono text-[9px] whitespace-nowrap text-brand sm:text-[10px]">
        <TagIcon className="size-2.5" /> {version}
      </span>
    </motion.div>
  )
}
