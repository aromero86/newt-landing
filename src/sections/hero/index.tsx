import { AnimatePresence, motion } from 'motion/react'
import { ArrowRightIcon, MessageSquareIcon, FileTextIcon, ShieldCheckIcon, GitPullRequestIcon, TagIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GithubMark } from '@/components/site/icons'
import { REPO_URL, DOCS_URL } from '@/lib/links'
import { useStepper, ease } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/mock/chat'
import { CheckLine, DeltaBadge, ProposalBadge, ArtifactTag } from '@/components/mock/status'
import { proposal, deltas, pr, rules, releases } from '@/lib/data'

const stages = [
  { icon: MessageSquareIcon, label: 'Talk' },
  { icon: FileTextIcon, label: 'Propose' },
  { icon: ShieldCheckIcon, label: 'Gate' },
  { icon: GitPullRequestIcon, label: 'Pull request' },
  { icon: TagIcon, label: 'Release' },
]

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
      <Backdrop />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.a
            href="#open-source"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur hover:text-foreground"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-warn opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-warn" />
            </span>
            Early preview · open source · in development
          </motion.a>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
          >
            Your product's definition, <span className="text-gradient">versioned like code.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground"
          >
            newt keeps every rule, entity and permission of your product in one living definition. Changes are proposed
            talking to Claude, approved delta by delta, refused if they contradict anything, and{' '}
            <span className="text-foreground">checked on every pull request</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <a href={REPO_URL}>
                <GithubMark className="size-4" /> Star on GitHub
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={DOCS_URL}>
                Read the quickstart <ArrowRightIcon />
              </a>
            </Button>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {['Self-hosted', 'Claude-native (MCP)', 'GitHub App', 'Bootstraps from your code'].map(t => (
              <li key={t} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brand" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>
        <Loop />
      </div>
    </section>
  )
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
      <div className="absolute top-40 -right-40 h-[400px] w-[500px] rounded-full bg-brand-2/15 blur-[120px]" />
    </div>
  )
}

/** The whole journey in one loop: talk, propose, gate, PR, release. */
function Loop() {
  const { ref, step } = useStepper(stages.length, { interval: 2600, hold: 1.4 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease }}
      className="relative"
      aria-label="Animated overview: a request becomes a proposal, passes the gate, is implemented in a pull request and ships in a release."
      role="img"
    >
      <div className="rounded-2xl border bg-card/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
        <ol className="relative mb-5 flex items-center justify-between">
          <div aria-hidden className="absolute top-4 right-4 left-4 h-px bg-border" />
          <motion.div
            aria-hidden
            className="absolute top-4 left-4 h-px bg-gradient-to-r from-brand to-brand-2"
            animate={{ width: `calc(${(step / (stages.length - 1)) * 100}% - ${(step / (stages.length - 1)) * 2}rem)` }}
            transition={{ duration: 0.6, ease }}
          />
          {stages.map((s, i) => (
            <li key={s.label} className="relative flex flex-col items-center gap-1.5">
              <motion.span
                animate={{ scale: i === step ? 1.12 : 1 }}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border bg-card transition-colors',
                  i <= step ? 'border-brand/60 text-brand' : 'text-muted-foreground',
                  i === step && 'shadow-[0_0_0_4px] shadow-brand/15',
                )}
              >
                <s.icon className="size-4" />
              </motion.span>
              <span className={cn('text-[10px] sm:text-[11px]', i === step ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</span>
            </li>
          ))}
        </ol>
        <div className="relative h-[290px] overflow-hidden rounded-xl border bg-background/70 p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="h-full"
            >
              {step === 0 && <TalkCard />}
              {step === 1 && <ProposeCard />}
              {step === 2 && <GateCard />}
              {step === 3 && <PrCard />}
              {step === 4 && <ReleaseCard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{children}</p>
}

function TalkCard() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <Caption>Product talks to Claude</Caption>
      <ChatMessage from="Lucía">{proposal.ask}</ChatMessage>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <ChatMessage from="claude">
          Today <b>{rules.guestsCannotPay.id}</b> says “{rules.guestsCannotPay.text}” Only Bizum, or every payment method? And up to what amount?
        </ChatMessage>
      </motion.div>
    </div>
  )
}

function ProposeCard() {
  return (
    <div>
      <Caption>A proposal, with its deltas</Caption>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{proposal.title}</span>
        <ProposalBadge state="in review" />
      </div>
      <ul className="flex flex-col gap-1.5">
        {deltas.slice(0, 4).map((d, i) => (
          <motion.li
            key={d.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.15 }}
            className="flex items-center justify-between gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-muted-foreground">{d.id}</span>
              <ArtifactTag kind={d.kind} id={d.artifact} />
              <span className="truncate">{d.after}</span>
            </span>
            <DeltaBadge state={i < 2 ? 'approved' : 'pending'} />
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function GateCard() {
  return (
    <div>
      <Caption>The gate checks the whole definition</Caption>
      <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1" aria-hidden>
        {Array.from({ length: 96 }, (_, i) => (
          <motion.span
            key={i}
            className={cn('aspect-square rounded-[3px]', i === 41 ? 'bg-bad' : 'bg-ok/50')}
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 1, i === 41 ? 1 : 0.55] }}
            transition={{ delay: (i % 24) * 0.03 + Math.floor(i / 24) * 0.12, duration: 0.5 }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-4 rounded-lg border border-bad/30 bg-bad/8 p-3 text-xs leading-relaxed"
      >
        <span className="font-medium text-bad">Conflict · Δ1 vs {rules.accountOver500.id}.</span> Guests could pay over €500
        with Bizum, but {rules.accountOver500.id} requires an account above that amount.
      </motion.div>
    </div>
  )
}

function PrCard() {
  return (
    <div>
      <Caption>On GitHub: newt checks PR #{pr.number}</Caption>
      <div className="rounded-lg border bg-card p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium">
          <GithubMark className="size-3.5" /> newt / product definition
        </div>
        <div className="flex flex-col gap-1.5">
          <CheckLine result="pass">
            <b>R-12</b> Guests pay only with Bizum — enforced
          </CheckLine>
          <CheckLine result="pass">
            <b>R-31</b> Guest invoice by email — tested
          </CheckLine>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <CheckLine result="fail">
              <b>R-07</b> €500 limit skipped for Bizum — <span className="font-mono">payment.ts:42</span>
            </CheckLine>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <CheckLine result="warn">
              <b>Order</b> “awaiting Bizum” has no test
            </CheckLine>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ReleaseCard() {
  const v = releases[1]!
  return (
    <div>
      <Caption>Product and code ship together</Caption>
      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
        <div>
          <div className="text-sm font-semibold">{v.version}</div>
          <div className="text-xs text-muted-foreground">GitHub release = product release</div>
        </div>
        <ProposalBadge state="merged" />
      </div>
      <ul className="mt-3 space-y-1.5 text-xs">
        {['Guests can pay with Bizum in the app (≤ €500)', "Guest invoices are emailed", 'Order: new “awaiting Bizum” state'].map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="flex gap-2"
          >
            <span className="text-ok">+</span> {t}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
