import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { GitPullRequestIcon } from 'lucide-react'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { useStepper } from '@/lib/motion'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function Problem() {
  return (
    <Section id="problem">
      <SectionHeading eyebrow="The problem" title="Nobody knows for sure how the product should behave.">
        What the product must do lives in docs, tickets, chats and a few people's heads. The only real source of truth
        is the code — bugs included. And more and more of that code is written by agents.
      </SectionHeading>
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Product and code drift apart"
          text="The spec said one thing, the code does another, and six months later nobody remembers which one is right."
          delay={0}
        >
          <Drift />
        </Card>
        <Card
          title="Rules contradict each other"
          text="A decision from last spring clashes with one from yesterday. You find out in production."
          delay={0.08}
        >
          <Clash />
        </Card>
        <Card
          title="Reviewing agent PRs is the bottleneck"
          text="Code review checks that code is well written. Nobody checks that the product still does what it should."
          delay={0.16}
        >
          <Queue />
        </Card>
      </div>
    </Section>
  )
}

function Card({ title, text, children, delay }: { title: string; text: string; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative h-44 border-b bg-subtle" aria-hidden>
        {children}
      </div>
      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
    </Reveal>
  )
}

/** Two lines leave the same point and grow apart. */
function Drift() {
  const { ref, step } = useStepper(2, { interval: 2600, hold: 1 })
  return (
    <div ref={ref} className="absolute inset-0">
      <svg viewBox="0 0 300 170" className="size-full">
        <motion.path
          d="M20 85 C 110 85, 160 85, 280 40"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: step === 1 ? 1 : 0.35 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <motion.path
          d="M20 85 C 110 85, 160 85, 280 130"
          fill="none"
          stroke="var(--bad)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: step === 1 ? 1 : 0.35 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <circle cx="20" cy="85" r="5" fill="var(--foreground)" />
        <motion.text x="196" y="30" className="fill-brand text-[11px]" animate={{ opacity: step === 1 ? 1 : 0 }}>
          what the docs say
        </motion.text>
        <motion.text x="196" y="152" className="fill-bad text-[11px]" animate={{ opacity: step === 1 ? 1 : 0 }}>
          what the code does
        </motion.text>
      </svg>
    </div>
  )
}

/** Two rules slide in and collide. */
function Clash() {
  const { ref, step } = useStepper(3, { interval: 1500, hold: 2 })
  const hit = step >= 1
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center gap-1 px-4">
      <motion.div
        animate={{ x: hit ? 6 : -30, rotate: hit ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className={cn('w-36 rounded-lg border bg-card p-2.5 text-[11px] shadow-sm', step === 2 && 'border-bad/60')}
      >
        <div className="font-mono text-[10px] text-muted-foreground">rule R-07 · March</div>
        Payments over €500 require an account.
      </motion.div>
      <motion.div
        animate={{ x: hit ? -6 : 30, rotate: hit ? 2 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className={cn('w-36 rounded-lg border bg-card p-2.5 text-[11px] shadow-sm', step === 2 && 'border-bad/60')}
      >
        <div className="font-mono text-[10px] text-muted-foreground">ticket · yesterday</div>
        Guests can pay any amount with Bizum.
      </motion.div>
      <motion.span
        className="absolute rounded-full bg-bad px-2 py-0.5 text-[10px] font-semibold text-white"
        animate={{ opacity: step === 2 ? 1 : 0, scale: step === 2 ? 1 : 0.6, y: 52 }}
      >
        found in production
      </motion.span>
    </div>
  )
}

/** Pull requests pile up in front of one reviewer. */
function Queue() {
  const { ref, step } = useStepper(6, { interval: 700, hold: 3 })
  const prs = ['Bizum for guests', 'Refactor cart totals', 'Shipping rules MX', 'Fix invoice email', 'New admin roles', 'Order states']
  return (
    <div ref={ref} className="absolute inset-0 flex items-center gap-4 px-5">
      <div className="flex flex-1 flex-col gap-1.5">
        {prs.slice(0, step + 1).map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[10px]"
          >
            <GitPullRequestIcon className="size-3 text-ok" />
            <span className="truncate">{t}</span>
            <span className="ml-auto font-mono text-muted-foreground">#{311 + i}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
        <Avatar name="Marc" className="size-9 text-sm" />
        <span>1 reviewer</span>
        <motion.span className="font-mono text-bad" key={step} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>
          {step + 1} waiting
        </motion.span>
      </div>
    </div>
  )
}
