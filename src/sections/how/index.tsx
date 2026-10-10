import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Section, SectionHeading } from '@/components/site/section'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { Stage } from './stages'

export const steps = [
  { who: 'Product', title: 'Describe the change, in your words', text: 'Talk to Claude. It reads the current definition through newt, finds what is affected and asks what is not clear instead of guessing.' },
  { who: 'Claude', title: 'A proposal is written', text: 'Claude writes the proposal document: context, problem and decisions. The document is the single source of the change.' },
  { who: 'newt', title: 'newt extracts the deltas', text: 'Every concrete change to the definition becomes a delta: a rule changed, a state added to a lifecycle, a new parameter. Deltas are what gets approved, checked and shipped.' },
  { who: 'newt', title: 'The gate checks the whole definition', text: 'Not just what looks related: every artifact, in batches, with a closer look where scopes overlap. Conflicts come with an explanation, next to the delta that causes them.' },
  { who: 'Product', title: 'Iterate without starting over', text: 'Edit the document and newt re-extracts the deltas. What did not change keeps its approval — like files marked “viewed” in a GitHub review.' },
  { who: 'Product', title: 'Accepted means ready for development', text: 'Every delta approved and the gate passed: the proposal is accepted, frozen, and lands in the development backlog. The planned definition moves ahead.' },
  { who: 'Development', title: 'The pull request is checked against it', text: 'The PR declares the proposal it implements. newt checks the code against it and against the current definition, artifact by artifact, right in the diff.' },
  { who: 'Development', title: 'Merge, and the definition moves', text: 'When the PR that completes the proposal is merged, the proposal becomes merged and its deltas join the current definition. Nobody updates a doc by hand.' },
  { who: 'Everyone', title: 'Product and code ship as one version', text: 'A GitHub release creates the product release, with a changelog of what changed in the product and why.' },
]

export default function How() {
  const [active, setActive] = useState(0)
  return (
    <Section id="how">
      <SectionHeading eyebrow="How it works" title="From a sentence to production, without losing the thread.">
        One change, end to end: a product manager asks for something, newt keeps it coherent, a developer ships it, and
        the definition of the product is never out of date.
      </SectionHeading>
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <ol className="flex flex-col">
          {steps.map((s, i) => (
            <StepBlock key={s.title} index={i} active={active === i} onActive={() => setActive(i)} />
          ))}
        </ol>
        <div className="hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-8rem)] max-h-[680px] min-h-[560px] flex-col justify-center">
            <Progress active={active} />
            <div className="relative mt-4 h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.985 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0"
                >
                  <Stage step={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function StepBlock({ index, active, onActive }: { index: number; active: boolean; onActive: () => void }) {
  const ref = useRef<HTMLLIElement>(null)
  // A step is "current" while it crosses the middle of the screen.
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive()
  }, [inView, onActive])
  const s = steps[index]!
  return (
    <li ref={ref} className="flex flex-col justify-center py-8 lg:min-h-[64vh] lg:py-0">
      <div className={cn('transition-opacity duration-500', active ? 'lg:opacity-100' : 'lg:opacity-35')}>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className={cn('flex size-7 items-center justify-center rounded-full border', active ? 'border-brand text-brand' : 'text-muted-foreground')}>
            {index + 1}
          </span>
          <span className="tracking-widest text-muted-foreground uppercase">{s.who}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">{s.title}</h3>
        <p className="mt-3 text-pretty text-muted-foreground">{s.text}</p>
      </div>
      {/* On small screens every step shows its own stage, inline. */}
      <div className="mt-6 h-[460px] lg:hidden">
        <InlineStage step={index} />
      </div>
    </li>
  )
}

/** Mounts the stage only when it scrolls into view, so its animation plays then. */
function InlineStage({ step }: { step: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  return (
    <div ref={ref} className="h-full">
      {inView && <Stage step={step} />}
    </div>
  )
}

function Progress({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {steps.map((s, i) => (
        <motion.span
          key={s.title}
          className="h-1 rounded-full"
          animate={{ width: i === active ? 36 : 14, backgroundColor: i <= active ? 'var(--brand)' : 'var(--border)' }}
          transition={{ duration: 0.4 }}
        />
      ))}
      <span className="ml-2 font-mono text-xs text-muted-foreground">
        {active + 1}/{steps.length}
      </span>
    </div>
  )
}
