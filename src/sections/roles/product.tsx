import { motion } from 'motion/react'
import { CheckCircle2Icon, FileTextIcon, ShieldAlertIcon } from 'lucide-react'
import { conflict, deltas, people, proposal } from '@/lib/data'
import { Typing } from '@/lib/typing'
import { ChatMessage, ChatPanel, ToolCall } from '@/components/mock/chat'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag, DeltaBadge, ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { Appear, Label } from './parts'
import { Screen } from './stage'

export const productSteps = [
  'Lucía tells Claude what she wants, in her own words.',
  'Claude checks the current definition and asks what is not clear.',
  'Claude writes PROP-42: the story behind the change.',
  'newt extracts the deltas: what exactly changes in the definition.',
  'The gate finds a conflict with R-07, with an explanation.',
  'One edit later only Δ1 needs a new look. All approved: accepted.',
]

/** Δ1 in revision 2: capped at €500, so it no longer clashes with R-07. */
const fixedDelta1 = 'Guests can pay only with Bizum, in the mobile app, up to €500.'

export function ProductScene({ step }: { step: number }) {
  const inApp = step >= 2
  return (
    <Screen id={inApp ? 'app' : 'chat'} className="h-full">
      {inApp ? <ProposalPage step={step} /> : <Conversation step={step} />}
    </Screen>
  )
}

function Conversation({ step }: { step: number }) {
  return (
    <ChatPanel className="min-h-[440px]">
      <ChatMessage from={people.product}>
        <Typing text={proposal.ask} active />
      </ChatMessage>
      {step >= 1 && (
        <>
          <ToolCall name="search">"guests pay" → rule R-12, rule R-07</ToolCall>
          <ChatMessage from="claude">
            <p>
              Today <strong>R-12</strong> says <em>“Guests cannot pay.”</em> Before I write the proposal:
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-muted-foreground">
              <li>Only Bizum, or every payment method?</li>
              <li>Only in the mobile app?</li>
              <li>Where does a guest get the invoice?</li>
            </ul>
          </ChatMessage>
        </>
      )}
    </ChatPanel>
  )
}

function ProposalPage({ step }: { step: number }) {
  const showDeltas = step >= 3
  const conflicted = step === 4
  const done = step >= 5
  const state = done ? 'accepted' : 'in review'

  return (
    <AppWindow crumbs={['acme-shop', 'proposals', proposal.id]} tabs={[{ label: 'Document' }, { label: 'Deltas', count: 5 }, { label: 'Revisions', count: done ? 2 : 1 }]} active="Deltas">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{proposal.title}</h3>
          <ProposalBadge state={state} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {proposal.feature} · by {proposal.author} · revision {done ? 2 : 1}
        </p>

        {!showDeltas && (
          <div className="mt-4 space-y-2 rounded-lg border bg-subtle p-3 text-xs leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <FileTextIcon className="size-3.5" /> Document
            </p>
            {proposal.document.map((line, i) => (
              <motion.p key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 * i }}>
                {line}
              </motion.p>
            ))}
          </div>
        )}

        {showDeltas && (
          <div className="mt-4">
            <Label>Deltas extracted from the document</Label>
            <ul className="divide-y rounded-lg border">
              {deltas.map((d, i) => {
                const isConflict = d.id === conflict.delta
                const text = done && isConflict ? fixedDelta1 : d.after
                return (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step === 3 ? 0.12 * i : 0 }}
                    className={cn('flex items-start gap-2.5 px-3 py-2 text-xs', conflicted && isConflict && 'bg-bad/8')}
                  >
                    <span className="mt-0.5 font-mono text-muted-foreground">{d.id}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <ArtifactTag kind={d.kind} id={d.artifact} />
                        <span className="text-muted-foreground">{d.op}</span>
                      </div>
                      <p className="mt-1 leading-snug">{text}</p>
                    </div>
                    <span className="shrink-0">
                      <DeltaBadge state={done || (conflicted && !isConflict) ? 'approved' : 'pending'} />
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        )}

        <Appear when={conflicted} className="mt-3">
          <div className="flex gap-2 rounded-lg border border-bad/40 bg-bad/10 p-3 text-xs">
            <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-bad" />
            <div>
              <p className="font-medium text-bad">
                Conflict: {conflict.delta} ↔ {conflict.with.id}
              </p>
              <p className="mt-1 leading-relaxed text-muted-foreground">{conflict.explanation}</p>
            </div>
          </div>
        </Appear>

        <Appear when={done} className="mt-3">
          <div className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ok/10 p-3 text-xs">
            <CheckCircle2Icon className="size-4 shrink-0 text-ok" />
            <p>
              <span className="font-medium text-ok">Accepted.</span>{' '}
              <span className="text-muted-foreground">Δ2–Δ5 kept their approval; only Δ1 changed. It is now in the development backlog.</span>
            </p>
          </div>
        </Appear>
      </div>
    </AppWindow>
  )
}
