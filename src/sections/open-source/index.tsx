import { useState } from 'react'
import { motion } from 'motion/react'
import { ServerIcon, SparklesIcon, ScanSearchIcon, CopyIcon, CheckIcon, ArrowRightIcon } from 'lucide-react'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { GithubMark } from '@/components/site/icons'
import { REPO_URL } from '@/lib/links'
import { cn } from '@/lib/utils'

const pillars = [
  { icon: ServerIcon, title: 'Self-hosted', text: 'Your product definition is your company’s knowledge. Run newt on your own server; your data stays with you.' },
  { icon: SparklesIcon, title: 'Claude-native', text: 'newt speaks MCP. Product, support and developers work with it from Claude, in plain language.' },
  { icon: GithubMark, title: 'GitHub App', text: 'Checks on every pull request, proposals linked to PRs, product releases synced with your GitHub releases.' },
  { icon: ScanSearchIcon, title: 'Bootstraps from your code', text: 'Point it at an existing repository and Claude drafts the definition your code already follows, for your team to review.' },
]

/** The eight stages of the plan (RFC.md). `now` is where development is. */
const stages = [
  { name: 'Foundations', text: 'Repository, web shell, users' },
  { name: 'Define a product', text: 'Rules, proposals, deltas, releases' },
  { name: 'Claude', text: 'Proposals by conversation, first bootstrap' },
  { name: 'The gate', text: 'Nothing contradictory is accepted' },
  { name: 'Full model', text: 'Entities, lifecycles, actors, parameters' },
  { name: 'Bugs & board', text: 'Known bugs, monitoring, support' },
  { name: 'The team', text: 'Notifications, internal deployment' },
  { name: 'The code', text: 'GitHub App, PR checks, agents' },
]
const now = 0

const quickstart = `# coming with the first release
git clone <repo> newt && cd newt
bun install && bun run dev

# connect Claude to your newt
claude mcp add newt -- newt mcp`

export default function OpenSource() {
  return (
    <Section id="open-source">
      <SectionHeading eyebrow="Open source" title="Built in the open. Yours to run.">
        newt is being built in the open, phase by phase, starting with our own products. Follow along, try it early,
        and tell us where it breaks.
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="rounded-2xl border bg-card p-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
              <p.icon className="size-4" />
            </span>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold">Where we are</h3>
          <p className="mt-1 text-sm text-muted-foreground">Eight stages, each one usable on its own. We review every phase before starting the next.</p>
          <ol className="mt-5 space-y-2.5">
            {stages.map((s, i) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]',
                    i === now ? 'border-brand bg-brand text-primary-foreground' : 'text-muted-foreground',
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={cn('font-medium', i !== now && 'text-muted-foreground')}>{s.name}</span>
                <span className="hidden truncate text-muted-foreground sm:inline">· {s.text}</span>
                {i === now && <span className="ml-auto rounded-full bg-brand/15 px-2 py-0.5 text-[10px] text-brand">in progress</span>}
              </motion.li>
            ))}
          </ol>
        </Reveal>
        <Reveal id="quickstart" className="scroll-mt-24 rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quickstart</h3>
            <span className="rounded-full bg-warn/15 px-2 py-0.5 text-[10px] text-warn">preview: not runnable yet</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">What getting started will look like. Star the repository to know when the first release is out.</p>
          <Code text={quickstart} />
        </Reveal>
      </div>

      <Reveal className="relative mt-16 overflow-hidden rounded-3xl border bg-card p-8 text-center sm:p-14">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--brand)_0%,transparent_60%)] opacity-15" />
        <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Stop guessing how your product <span className="text-gradient">should behave.</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
          One living definition for product, support, QA, sales and the code. Versioned, coherent, and checked on every
          pull request.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href={REPO_URL}>
              <GithubMark className="size-4" /> Star on GitHub
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#how">
              See how it works <ArrowRightIcon />
            </a>
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}

function Code({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard can be blocked; the text is still selectable.
    }
  }
  return (
    <div className="relative mt-4 rounded-xl border bg-background">
      <Button variant="ghost" size="icon" onClick={copy} className="absolute top-2 right-2 size-7" aria-label="Copy commands">
        {copied ? <CheckIcon className="text-ok" /> : <CopyIcon />}
      </Button>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
        {text.split('\n').map((l, i) => (
          <div key={i} className={l.startsWith('#') ? 'text-muted-foreground' : ''}>
            {l === '' ? '\u00a0' : l.startsWith('#') ? l : <><span className="text-brand select-none">$ </span>{l}</>}
          </div>
        ))}
      </pre>
    </div>
  )
}
