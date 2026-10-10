import { motion } from 'motion/react'
import { CheckIcon, FlaskConicalIcon, ListChecksIcon } from 'lucide-react'
import { people, rules } from '@/lib/data'
import { AppWindow, GitHubWindow } from '@/components/mock/window'
import { ArtifactTag, BugBadge, CheckLine, DimensionChip } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Appear, Code, Label } from './parts'
import { Screen } from './stage'

export const qaSteps = [
  'Every delta comes with acceptance criteria: given, when, then.',
  'Criteria map to tests. The check flags the one that has none.',
  'A guest says the invoice never arrived. Ana follows the steps and reproduces it.',
  'Confirmed, and linked to the rule it breaks: R-31.',
  'Another PR quietly breaks a rule that worked: the check catches the regression.',
]

const criteria = [
  { given: 'a guest in the mobile app', when: 'pays €40 with Bizum', then: 'the order is paid', test: 'guest-bizum.spec.ts › pays under limit' },
  { given: 'a guest in the mobile app', when: 'pays €620 with Bizum', then: 'checkout asks to sign up', test: 'guest-bizum.spec.ts › blocks over €500' },
  { given: 'a guest paid with Bizum', when: 'the order is confirmed', then: 'the invoice is emailed to them', test: null },
]

export function QaScene({ step }: { step: number }) {
  const screen = step <= 1 ? 'criteria' : step <= 3 ? 'bug' : 'regression'
  return (
    <Screen id={screen} className="h-full">
      {screen === 'criteria' && <Criteria step={step} />}
      {screen === 'bug' && <Reproduce step={step} />}
      {screen === 'regression' && <Regression />}
    </Screen>
  )
}

function Criteria({ step }: { step: number }) {
  const mapped = step >= 1
  return (
    <AppWindow crumbs={['acme-shop', 'proposals', 'PROP-42', 'Δ1']} tabs={[{ label: 'Delta' }, { label: 'Acceptance criteria', count: 3 }, { label: 'Tests' }]} active="Acceptance criteria">
      <div className="space-y-2.5 p-4 text-xs">
        <p className="flex flex-wrap items-center gap-1.5">
          <ArtifactTag kind="rule" id="R-12" /> Guests can pay only with Bizum, in the mobile app, up to €500.
        </p>
        {criteria.map((c, i) => (
          <motion.div
            key={c.when}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className={cn('rounded-lg border p-3', mapped && !c.test && 'border-warn/50 bg-warn/8')}
          >
            <p className="leading-relaxed">
              <span className="font-mono text-brand">Given</span> {c.given} <span className="font-mono text-brand">when</span> {c.when}{' '}
              <span className="font-mono text-brand">then</span> {c.then}.
            </p>
            <Appear when={mapped} delay={0.2 * i}>
              <div className="mt-2 border-t pt-2">
                {c.test ? (
                  <CheckLine result="pass">
                    <span className="font-mono text-muted-foreground">{c.test}</span>
                  </CheckLine>
                ) : (
                  <CheckLine result="warn">
                    <span className="text-warn">No test covers this criterion.</span>{' '}
                    <span className="text-muted-foreground">newt's check will say so on every PR until one does.</span>
                  </CheckLine>
                )}
              </div>
            </Appear>
          </motion.div>
        ))}
      </div>
    </AppWindow>
  )
}

function Reproduce({ step }: { step: number }) {
  const confirmed = step >= 3
  const steps = ['Guest checkout in the iOS app', 'Pay €35 with Bizum', 'Wait for the confirmation email']
  return (
    <AppWindow crumbs={['acme-shop', 'bugs', 'BUG-81']} tabs={[{ label: 'Bug' }, { label: 'Occurrences', count: 4 }, { label: 'Activity' }]} active="Bug">
      <div className="space-y-3 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">Guest invoice email never arrives</h3>
          <motion.span key={confirmed ? 'c' : 'r'} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <BugBadge state={confirmed ? 'confirmed' : 'reported'} />
          </motion.span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <DimensionChip name="surface" value="Mobile app" />
          <DimensionChip name="role" value="Guest" />
          <DimensionChip name="market" value="Spain" />
        </div>
        <div className="rounded-lg border p-3">
          <Label>Steps to reproduce</Label>
          <ul className="space-y-1.5">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="relative flex size-4 items-center justify-center rounded border">
                  {step >= 2 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + 0.45 * i }}
                      className="absolute inset-0 flex items-center justify-center rounded bg-ok"
                    >
                      <CheckIcon className="size-3 text-background" />
                    </motion.span>
                  )}
                </span>
                {s}
              </li>
            ))}
          </ul>
          <Appear when={step >= 2} delay={1.9}>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Avatar name={people.qa} className="size-5" /> Reproduced: no email after 10 minutes.
            </p>
          </Appear>
        </div>
        <Appear when={confirmed}>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-bad/40 bg-bad/10 p-3">
            <ListChecksIcon className="size-4 text-bad" />
            <span>Breaks</span> <ArtifactTag kind="rule" id={rules.invoiceByEmail.id} />
            <span className="text-muted-foreground">{rules.invoiceByEmail.text}</span>
          </div>
        </Appear>
      </div>
    </AppWindow>
  )
}

function Regression() {
  return (
    <GitHubWindow number={321} title="refactor(cart): recompute totals when a coupon changes" state="blocked" active="Files changed">
      <div className="space-y-3 p-4 text-xs">
        <p className="font-mono text-[11px] text-muted-foreground">src/cart/totals.ts</p>
        <Code
          lines={[
            { n: 18, text: 'export function applyCoupon(order, coupon) {' },
            { n: 19, text: '  order.amount = recompute(order, coupon)', mark: 'hit' },
            { n: 20, text: '}' },
          ]}
        />
        <div className="rounded-lg border">
          <div className="flex items-center gap-2 border-b px-3 py-2 font-medium">
            <FlaskConicalIcon className="size-3.5 text-bad" /> newt / product check
            <span className="ml-auto font-normal text-muted-foreground">regression</span>
          </div>
          <div className="space-y-1.5 p-3">
            <CheckLine result="fail">
              <ArtifactTag kind="rule" id={rules.paidOrderImmutable.id} /> {rules.paidOrderImmutable.text}{' '}
              <span className="text-muted-foreground">Line 19 changes the amount of orders that are already paid. No proposal changes this rule.</span>
            </CheckLine>
            <CheckLine result="pass">
              <ArtifactTag kind="lifecycle" id="Order" /> no new transitions
            </CheckLine>
          </div>
        </div>
        <p className="text-muted-foreground">Caught before merge, against the current definition, not against what someone remembered.</p>
      </div>
    </GitHubWindow>
  )
}
