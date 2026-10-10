import { motion } from 'motion/react'
import { CheckIcon, FlaskConicalIcon, ListChecksIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { useT, type Bi } from '@/lib/i18n'
import { AppWindow, GitHubWindow } from '@/components/mock/window'
import { ArtifactTag, BugBadge, CheckLine, DimensionChip } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Appear, Code, Label } from './parts'
import { Screen } from './stage'
import { useRolesStory } from './story'

export const qaSteps: Bi[] = [
  { en: 'Every delta comes with acceptance criteria: given, when, then.', es: 'Cada delta trae sus criterios de aceptación: dado, cuando, entonces.' },
  { en: 'Criteria map to tests. The check flags the one that has none.', es: 'Los criterios se enlazan con tests. El check señala el que no tiene ninguno.' },
  {
    en: 'A guest says the invoice never arrived. Ana follows the steps and reproduces it.',
    es: 'Un invitado dice que nunca le llegó la factura. Ana sigue los pasos y lo reproduce.',
  },
  { en: 'Confirmed, and linked to the rule it breaks: R-31.', es: 'Confirmed, y enlazado a la rule que incumple: R-31.' },
  {
    en: 'Another PR quietly breaks a rule that worked: the check catches the regression.',
    es: 'Otra PR rompe sin hacer ruido una rule que funcionaba: el check detecta la regresión.',
  },
]

const criteria: { given: Bi; when: Bi; then: Bi; test: string | null }[] = [
  {
    given: { en: 'a guest in the mobile app', es: 'un invitado en la app móvil' },
    when: { en: 'pays €40 with Bizum', es: 'paga 40 € con Bizum' },
    then: { en: 'the order is paid', es: 'el pedido queda pagado' },
    test: 'guest-bizum.spec.ts › pays under limit',
  },
  {
    given: { en: 'a guest in the mobile app', es: 'un invitado en la app móvil' },
    when: { en: 'pays €620 with Bizum', es: 'paga 620 € con Bizum' },
    then: { en: 'checkout asks to sign up', es: 'el checkout le pide registrarse' },
    test: 'guest-bizum.spec.ts › blocks over €500',
  },
  {
    given: { en: 'a guest paid with Bizum', es: 'un invitado ha pagado con Bizum' },
    when: { en: 'the order is confirmed', es: 'se confirma el pedido' },
    then: { en: 'the invoice is emailed to them', es: 'le llega la factura por email' },
    test: null,
  },
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
  const t = useT()
  const { rules } = useRolesStory()
  const mapped = step >= 1
  const tab = t({ en: 'Acceptance criteria', es: 'Criterios de aceptación' })
  return (
    <AppWindow crumbs={['acme-shop', 'proposals', 'PROP-42', 'Δ1']} tabs={[{ label: 'Delta' }, { label: tab, count: 3 }, { label: 'Tests' }]} active={tab}>
      <div className="space-y-2.5 p-4 text-xs">
        <p className="flex flex-wrap items-center gap-1.5">
          <ArtifactTag kind="rule" id="R-12" />{' '}
          {rules.guestsPayBizum.text}
        </p>
        {criteria.map((c, i) => (
          <motion.div
            key={c.when.en}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className={cn('rounded-lg border p-3', mapped && !c.test && 'border-warn/50 bg-warn/8')}
          >
            <p className="leading-relaxed">
              <span className="font-mono text-brand">{t({ en: 'Given', es: 'Dado' })}</span> {t(c.given)}{' '}
              <span className="font-mono text-brand">{t({ en: 'when', es: 'cuando' })}</span> {t(c.when)}{' '}
              <span className="font-mono text-brand">{t({ en: 'then', es: 'entonces' })}</span> {t(c.then)}.
            </p>
            <Appear when={mapped} delay={0.2 * i}>
              <div className="mt-2 border-t pt-2">
                {c.test ? (
                  <CheckLine result="pass">
                    <span className="font-mono text-muted-foreground">{c.test}</span>
                  </CheckLine>
                ) : (
                  <CheckLine result="warn">
                    <span className="text-warn">{t({ en: 'No test covers this criterion.', es: 'Ningún test cubre este criterio.' })}</span>{' '}
                    <span className="text-muted-foreground">
                      {t({ en: "newt's check will say so on every PR until one does.", es: 'El check de newt lo dirá en cada PR hasta que lo haya.' })}
                    </span>
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
  const t = useT()
  const { rule, dimension } = useRolesStory()
  const confirmed = step >= 3
  const steps: Bi[] = [
    { en: 'Guest checkout in the iOS app', es: 'Checkout como invitado en la app de iOS' },
    { en: 'Pay €35 with Bizum', es: 'Pagar 35 € con Bizum' },
    { en: 'Wait for the confirmation email', es: 'Esperar el email de confirmación' },
  ]
  const chips = [dimension('surface', 'Mobile app'), dimension('role', 'Guest'), dimension('market', 'Spain')]
  return (
    <AppWindow
      crumbs={['acme-shop', 'bugs', 'BUG-81']}
      tabs={[{ label: 'Bug' }, { label: t({ en: 'Occurrences', es: 'Ocurrencias' }), count: 4 }, { label: t({ en: 'Activity', es: 'Actividad' }) }]}
      active="Bug"
    >
      <div className="space-y-3 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{t({ en: 'Guest invoice email never arrives', es: 'Al invitado nunca le llega el email con la factura' })}</h3>
          <motion.span key={confirmed ? 'c' : 'r'} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <BugBadge state={confirmed ? 'confirmed' : 'reported'} />
          </motion.span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map(c => (
            <DimensionChip key={c.name} name={c.name} value={c.value} />
          ))}
        </div>
        <div className="rounded-lg border p-3">
          <Label>{t({ en: 'Steps to reproduce', es: 'Pasos para reproducirlo' })}</Label>
          <ul className="space-y-1.5">
            {steps.map((s, i) => (
              <li key={s.en} className="flex items-center gap-2">
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
                {t(s)}
              </li>
            ))}
          </ul>
          <Appear when={step >= 2} delay={1.9}>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Avatar name={people.qa} className="size-5" />{' '}
              {t({ en: 'Reproduced: no email after 10 minutes.', es: 'Reproducido: ni rastro del email tras 10 minutos.' })}
            </p>
          </Appear>
        </div>
        <Appear when={confirmed}>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-bad/40 bg-bad/10 p-3">
            <ListChecksIcon className="size-4 text-bad" />
            <span>{t({ en: 'Breaks', es: 'Incumple' })}</span> <ArtifactTag kind="rule" id="R-31" />
            <span className="text-muted-foreground">{rule('R-31')}</span>
          </div>
        </Appear>
      </div>
    </AppWindow>
  )
}

function Regression() {
  const t = useT()
  const { rule } = useRolesStory()
  return (
    <GitHubWindow
      number={321}
      title={t({ en: 'refactor(cart): recompute totals when a coupon changes', es: 'refactor(cart): recalcular los totales al cambiar un cupón' })}
      state="blocked"
      active="Files changed"
    >
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
            <span className="ml-auto font-normal text-muted-foreground">{t({ en: 'regression', es: 'regresión' })}</span>
          </div>
          <div className="space-y-1.5 p-3">
            <CheckLine result="fail">
              <ArtifactTag kind="rule" id="R-02" /> {rule('R-02')}{' '}
              <span className="text-muted-foreground">
                {t({
                  en: 'Line 19 changes the amount of orders that are already paid. No proposal changes this rule.',
                  es: 'La línea 19 cambia el importe de pedidos que ya están pagados. Ninguna proposal cambia esta rule.',
                })}
              </span>
            </CheckLine>
            <CheckLine result="pass">
              <ArtifactTag kind="lifecycle" id="Order" /> {t({ en: 'no new transitions', es: 'sin transiciones nuevas' })}
            </CheckLine>
          </div>
        </div>
        <p className="text-muted-foreground">
          {t({
            en: 'Caught before merge, against the current definition, not against what someone remembered.',
            es: 'Detectado antes del merge, contra la definición vigente, no contra lo que alguien recordaba.',
          })}
        </p>
      </div>
    </GitHubWindow>
  )
}
