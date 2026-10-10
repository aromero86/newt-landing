import { motion } from 'motion/react'
import { MailIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { Typing } from '@/lib/typing'
import { ChatMessage, ChatPanel, ToolCall } from '@/components/mock/chat'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag, DimensionChip, ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { Appear, Label, Panel } from './parts'
import { Screen } from './stage'

export const salesSteps = [
  'A prospect in Mexico asks if their customers can pay without an account.',
  'Paula asks Claude, filtering the definition by market and plan.',
  'newt shows what is true today and what is already planned, for Mexico.',
  'Claude answers from the definition: nothing promised that is not there.',
  'The request becomes a draft proposal for product to weigh.',
]

const current = [
  { id: 'R-12', text: 'Guests cannot pay.', applies: true },
  { id: 'R-07', text: 'Payments over €500 require a registered account.', applies: true },
]
const planned = [{ id: 'PROP-42', text: 'Guests can pay with Bizum in the mobile app', note: 'market: Spain only', applies: false }]

export function SalesScene({ step }: { step: number }) {
  const screen = step <= 1 ? 'ask' : step === 2 ? 'definition' : 'answer'
  return (
    <Screen id={screen} className="h-full">
      {screen === 'ask' && <Ask step={step} />}
      {screen === 'definition' && <Definition />}
      {screen === 'answer' && <Answer step={step} />}
    </Screen>
  )
}

function Ask({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Panel title="Re: Acme Shop for our stores in Mexico" icon={<MailIcon className="size-3.5 text-muted-foreground" />} aside={<span className="text-muted-foreground">Premium plan</span>}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          “Looks great. One thing: <span className="text-foreground">can our customers in Mexico pay without creating an account?</span> It's a deal breaker for us.”
        </p>
      </Panel>
      <Appear when={step >= 1}>
        <ChatPanel>
          <ChatMessage from={people.sales}>
            <Typing text="Can guests pay without an account in Mexico, on the Premium plan? Today, and in the next release?" active={step >= 1} />
          </ChatMessage>
          <ToolCall name="definition">market: Mexico · plan: Premium · role: Guest</ToolCall>
        </ChatPanel>
      </Appear>
    </div>
  )
}

function Definition() {
  return (
    <AppWindow crumbs={['acme-shop', 'definition']} tabs={[{ label: 'Current' }, { label: 'Planned' }, { label: 'Changelog' }]} active="Planned">
      <div className="space-y-3 p-4 text-xs">
        <div className="flex flex-wrap gap-1.5">
          <DimensionChip name="market" value="Mexico" active />
          <DimensionChip name="plan" value="Premium" active />
          <DimensionChip name="role" value="Guest" active />
          <DimensionChip name="surface" value="any" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <Label>Current · in production</Label>
            <ul className="space-y-2">
              {current.map((r, i) => (
                <motion.li key={r.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }}>
                  <ArtifactTag kind="rule" id={r.id} /> <span className="ml-1">{r.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-dashed p-3">
            <Label>Planned · accepted, not shipped</Label>
            <ul className="space-y-2">
              {planned.map(p => (
                <motion.li key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className={cn(!p.applies && 'opacity-60')}>
                  <span className="font-mono text-muted-foreground">{p.id}</span> <ProposalBadge state="accepted" />
                  <p className="mt-1">{p.text}</p>
                  <p className="mt-0.5 text-warn">Does not apply to Mexico: {p.note}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground">Filtered by dimension: only what applies to a guest in Mexico on Premium.</p>
      </div>
    </AppWindow>
  )
}

function Answer({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-4">
      <ChatPanel>
        <ChatMessage from="claude">
          <p>
            <strong>Today: no.</strong> In Mexico guests can't pay (<span className="font-mono">R-12</span>).
          </p>
          <p className="mt-1.5">
            <strong>Next release:</strong> guests will pay with Bizum, but only in Spain (<span className="font-mono">PROP-42</span>). Nothing is planned for Mexico, so
            I wouldn't promise it.
          </p>
          <p className="mt-1.5 text-muted-foreground">Want me to raise it with product as a draft proposal?</p>
        </ChatMessage>
        {step >= 4 && (
          <>
            <ChatMessage from={people.sales}>Yes, please.</ChatMessage>
            <ToolCall name="create_proposal">"Guest checkout in Mexico" → PROP-47</ToolCall>
          </>
        )}
      </ChatPanel>
      <Appear when={step >= 4}>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 text-xs shadow-xl shadow-black/10">
          <span className="font-mono text-muted-foreground">PROP-47</span>
          <span className="font-medium">Guest checkout in Mexico</span>
          <ProposalBadge state="draft" />
          <span className="text-muted-foreground">· requested by {people.sales} · waiting for product</span>
        </div>
      </Appear>
    </div>
  )
}
