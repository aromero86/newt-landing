import { useCallback, useState, type ComponentType } from 'react'
import { motion } from 'motion/react'
import { CheckCheckIcon, GitMergeIcon, GitPullRequestIcon, LockIcon, ZapIcon, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { GithubMark } from '@/components/site/icons'
import { BlockedScene, LinkedScene, NoProposalScene, ReleasedScene, UrgentScene, type SceneProps } from './scenes'

const scenes: { id: string; label: string; icon: LucideIcon; Scene: ComponentType<SceneProps> }[] = [
  { id: 'linked', label: 'Linked & checked', icon: CheckCheckIcon, Scene: LinkedScene },
  { id: 'blocked', label: 'Not accepted, not checked', icon: LockIcon, Scene: BlockedScene },
  { id: 'no-proposal', label: 'PRs with no proposal', icon: GitPullRequestIcon, Scene: NoProposalScene },
  { id: 'urgent', label: 'The urgent lane', icon: ZapIcon, Scene: UrgentScene },
  { id: 'released', label: 'Merged & released', icon: GitMergeIcon, Scene: ReleasedScene },
]

/** Where newt meets the code: every scene is a PR on github.com with newt installed. */
export default function GitHubSection() {
  const [current, setCurrent] = useState(0)
  const next = useCallback(() => setCurrent(c => (c + 1) % scenes.length), [])
  const { Scene, id } = scenes[current]!

  return (
    <Section id="github">
      <SectionHeading
        eyebrow="GitHub integration"
        title={
          <>
            A dev never has to leave GitHub <span className="text-gradient">to know what doesn’t comply.</span>
          </>
        }
      >
        newt is a required check on every pull request. It knows which proposal the PR implements, checks the code against it and against the current
        definition, and points at the exact line that breaks a rule.
      </SectionHeading>

      <Reveal>
        <div role="tablist" aria-label="GitHub scenarios" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {scenes.map((s, i) => {
            const Icon = s.icon
            const active = i === current
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="github-scene"
                onClick={() => setCurrent(i)}
                className={cn(
                  'relative isolate flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  active ? 'border-brand/40 text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && <motion.span layoutId="github-scene-pill" className="absolute inset-0 -z-10 rounded-full bg-brand/10" transition={{ duration: 0.35, ease }} />}
                <Icon className={cn('size-4', active && 'text-brand')} />
                {s.label}
              </button>
            )
          })}
        </div>

        <div id="github-scene" role="tabpanel" className="relative">
          {/* Keyed: a new scene remounts, plays its entrance and starts its own timeline. */}
          <div key={id} className="animate-in fade-in slide-in-from-bottom-3 duration-500 motion-reduce:animate-none">
            <Scene onDone={next} />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Linked like issues', text: '“Implements PROP-42” in a PR works like “Closes #123”: merge it and the proposal is merged in newt.' },
          { title: 'Annotated like a linter', text: 'Each artifact gets a line in the report, and failures land on the diff line that causes them.' },
          { title: 'Released together', text: 'A GitHub release is a product release, so the changelog and the code always speak about the same version.' },
        ].map(card => (
          <div key={card.title} className="rounded-xl border bg-card/60 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <GithubMark className="size-4" /> {card.title}
            </div>
            <p className="text-sm text-muted-foreground">{card.text}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
