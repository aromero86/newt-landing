import { motion } from 'motion/react'
import { CircleDotIcon, GitMergeIcon, LoaderCircleIcon, MessageSquareWarningIcon } from 'lucide-react'
import { bug, people, pr, proposal } from '@/lib/data'
import { FakeCursor } from '@/lib/typing'
import { AppWindow, GitHubWindow } from '@/components/mock/window'
import { ArtifactTag, BugBadge, CheckLine, ProposalBadge } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Appear, Code, Label } from './parts'
import { Screen } from './stage'

export const developmentSteps = [
  'The backlog is the accepted proposals and the confirmed bugs. Marc picks PROP-42.',
  'His pull request declares what it implements: PROP-42.',
  "newt's check reads the diff against the proposal and the current definition.",
  'A rule is broken, and GitHub shows it on the exact line.',
  'One commit later every artifact passes. Merge.',
  'PROP-42 becomes merged on its own: its deltas are now the current definition.',
]

export function DevelopmentScene({ step }: { step: number }) {
  const screen = step === 0 ? 'board' : step <= 4 ? 'pr' : 'newt'
  return (
    <Screen id={screen} className="h-full">
      {screen === 'board' && <Backlog />}
      {screen === 'pr' && <PullRequest step={step} />}
      {screen === 'newt' && <Merged />}
    </Screen>
  )
}

function Backlog() {
  const items = [
    { id: proposal.id, title: proposal.title, kind: 'proposal' as const },
    { id: 'PROP-39', title: 'Free shipping threshold per market', kind: 'proposal' as const },
    { id: bug.id, title: bug.title, kind: 'bug' as const },
  ]
  return (
    <AppWindow crumbs={['acme-shop', 'board']} tabs={[{ label: 'To do', count: 3 }, { label: 'In progress', count: 2 }, { label: 'Done' }]} active="To do">
      <div className="relative space-y-2 p-4">
        <Label>Ready for development</Label>
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={cn('flex items-center gap-3 rounded-lg border bg-card p-3 text-xs', i === 0 && 'ring-1 ring-brand/50')}
          >
            <span className="font-mono text-muted-foreground">{it.id}</span>
            <span className="min-w-0 flex-1 truncate">{it.title}</span>
            {it.kind === 'proposal' ? <ProposalBadge state="accepted" /> : <BugBadge state="confirmed" />}
            {i === 0 ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }}>
                <Avatar name={people.dev} />
              </motion.span>
            ) : (
              <span className="size-6 rounded-full border border-dashed" aria-hidden />
            )}
          </motion.div>
        ))}
        <FakeCursor x={88} y={44} click />
      </div>
    </AppWindow>
  )
}

function PullRequest({ step }: { step: number }) {
  const checking = step === 2
  const failed = step === 3
  const passed = step >= 4
  const files = step >= 3

  return (
    <GitHubWindow number={pr.number} title={pr.title} state={passed ? 'open' : 'blocked'} active={files ? 'Files changed' : 'Conversation'}>
      <div className="space-y-3 p-4">
        {!files && (
          <div className="rounded-lg border p-3 text-xs">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Avatar name={pr.author} /> <span className="font-medium text-foreground">{pr.author}</span> opened this pull request
            </p>
            <p className="mt-2 font-mono">
              Implements <span className="text-brand">newt:{proposal.id}</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              ↳ {proposal.title} <ProposalBadge state="accepted" />
            </p>
          </div>
        )}

        {files && (
          <div className="space-y-2">
            <p className="font-mono text-[11px] text-muted-foreground">{pr.file}</p>
            <Code
              lines={
                passed
                  ? [
                      { n: 41, text: "if (user.role === 'guest') {" },
                      { n: 42, text: "  if (method !== 'bizum') return reject('sign-up')", mark: 'add' },
                      { n: 43, text: '  if (amount > limits.guestBizum) return reject(\'sign-up\')', mark: 'add' },
                      { n: 44, text: '}' },
                    ]
                  : [
                      { n: 41, text: "if (user.role === 'guest') {" },
                      { n: 42, text: "  if (method !== 'bizum') return reject('sign-up')" },
                      { n: 43, text: '  return allow()', mark: 'hit' },
                      { n: 44, text: '}' },
                    ]
              }
            />
            <Appear when={failed}>
              <div className="flex gap-2 rounded-lg border border-bad/40 bg-bad/10 p-2.5 text-xs">
                <MessageSquareWarningIcon className="mt-0.5 size-3.5 shrink-0 text-bad" />
                <p>
                  <span className="font-medium">newt</span> · line 43 · <ArtifactTag kind="rule" id="R-07" />{' '}
                  <span className="text-muted-foreground">Payments over €500 require a registered account: this lets a guest through at any amount.</span>
                </p>
              </div>
            </Appear>
          </div>
        )}

        <div className="rounded-lg border">
          <div className="flex items-center gap-2 border-b px-3 py-2 text-xs font-medium">
            {checking ? (
              <LoaderCircleIcon className="size-3.5 animate-spin text-warn" />
            ) : (
              <CircleDotIcon className={cn('size-3.5', passed ? 'text-ok' : step >= 3 ? 'text-bad' : 'text-muted-foreground')} />
            )}
            newt / product check
            <span className="ml-auto font-normal text-muted-foreground">
              {step < 2 ? 'queued' : checking ? 'reading the diff…' : passed ? '5 of 5 artifacts pass' : '1 failing'}
            </span>
          </div>
          {step >= 3 && (
            <div className="space-y-1.5 p-3">
              <CheckLine result="pass">
                <ArtifactTag kind="rule" id="R-12" /> guests can pay only with Bizum
              </CheckLine>
              <CheckLine result={passed ? 'pass' : 'fail'}>
                <ArtifactTag kind="rule" id="R-07" /> payments over €500 need an account
              </CheckLine>
              <CheckLine result="pass">
                <ArtifactTag kind="parameter" id="bizum.guest_limit" /> read from configuration
              </CheckLine>
              <CheckLine result="pass">
                <ArtifactTag kind="lifecycle" id="Order" /> new state “awaiting Bizum”
              </CheckLine>
            </div>
          )}
        </div>

        <Appear when={passed}>
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-between rounded-lg bg-[#1f883d] px-3 py-2 text-xs font-medium text-white"
          >
            <span className="flex items-center gap-1.5">
              <GitMergeIcon className="size-3.5" /> All checks passed
            </span>
            <span className="rounded-md bg-white/15 px-2 py-0.5">Merge pull request</span>
          </motion.div>
        </Appear>
      </div>
    </GitHubWindow>
  )
}

function Merged() {
  return (
    <AppWindow crumbs={['acme-shop', 'proposals', proposal.id]} tabs={[{ label: 'Document' }, { label: 'Deltas', count: 5 }, { label: 'Delivery', count: 1 }]} active="Delivery">
      <div className="space-y-3 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{proposal.title}</h3>
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <ProposalBadge state="merged" />
          </motion.span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <GitMergeIcon className="size-4 text-[#a371f7]" />
          <span>
            <span className="font-mono">acme/shop#{pr.number}</span> merged by {pr.author}
          </span>
        </div>
        <div className="rounded-lg border bg-subtle p-3">
          <Label>Current definition updated</Label>
          <ul className="space-y-1.5">
            {['R-12', 'R-31', 'Order', 'bizum.guest_limit', 'Guest'].map((id, i) => (
              <motion.li key={id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + 0.12 * i }} className="flex items-center gap-2">
                <span className="text-ok">●</span> <span className="font-mono">{id}</span>
                <span className="text-muted-foreground">from planned to current</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="text-muted-foreground">Nobody touched newt: the merge on GitHub did it.</p>
      </div>
    </AppWindow>
  )
}
