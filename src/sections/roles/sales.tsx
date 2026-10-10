import { motion } from 'motion/react'
import { MailIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { Typing } from '@/lib/typing'
import { useT, type Bi } from '@/lib/i18n'
import { ChatMessage, ChatPanel, ToolCall } from '@/components/mock/chat'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag, DimensionChip, ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { Appear, Label, Panel } from './parts'
import { Screen } from './stage'
import { useRolesStory } from './story'

export const salesSteps: Bi[] = [
  {
    en: 'A prospect in Mexico asks if their customers can pay without an account.',
    es: 'Un posible cliente de México pregunta si sus clientes pueden pagar sin cuenta.',
  },
  { en: 'Paula asks Claude, filtering the definition by market and plan.', es: 'Paula le pregunta a Claude, filtrando la definición por mercado y plan.' },
  {
    en: 'newt shows what is true today and what is already planned, for Mexico.',
    es: 'newt enseña lo que es cierto hoy y lo que ya está previsto, para México.',
  },
  {
    en: 'Claude answers from the definition: nothing promised that is not there.',
    es: 'Claude responde desde la definición: no promete nada que no esté ahí.',
  },
  { en: 'The request becomes a draft proposal for product to weigh.', es: 'La petición se convierte en una proposal en draft para que producto la valore.' },
]

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
  const t = useT()
  const { dimension } = useRolesStory()
  const filter = [dimension('market', 'Mexico'), dimension('plan', 'Premium'), dimension('role', 'Guest')].map(d => `${d.name}: ${d.value}`).join(' · ')
  return (
    <div className="flex flex-col gap-4">
      <Panel
        title={t({ en: 'Re: Acme Shop for our stores in Mexico', es: 'Re: Acme Shop para nuestras tiendas en México' })}
        icon={<MailIcon className="size-3.5 text-muted-foreground" />}
        aside={<span className="text-muted-foreground">{t({ en: 'Premium plan', es: 'Plan Premium' })}</span>}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t({
            en: (
              <>
                “Looks great. One thing: <span className="text-foreground">can our customers in Mexico pay without creating an account?</span> It's a deal breaker for
                us.”
              </>
            ),
            es: (
              <>
                «Tiene muy buena pinta. Una cosa: <span className="text-foreground">¿nuestros clientes en México pueden pagar sin crearse una cuenta?</span> Para
                nosotros es imprescindible.»
              </>
            ),
          })}
        </p>
      </Panel>
      <Appear when={step >= 1}>
        <ChatPanel>
          <ChatMessage from={people.sales}>
            <Typing
              text={t({
                en: 'Can guests pay without an account in Mexico, on the Premium plan? Today, and in the next release?',
                es: '¿Los invitados pueden pagar sin cuenta en México, con el plan Premium? ¿Hoy y en la próxima release?',
              })}
              active={step >= 1}
            />
          </ChatMessage>
          <ToolCall name="definition">{filter}</ToolCall>
        </ChatPanel>
      </Appear>
    </div>
  )
}

function Definition() {
  const t = useT()
  const { rule, dimension, proposal } = useRolesStory()
  const current = [
    { id: 'R-12', text: rule('R-12') },
    { id: 'R-07', text: rule('R-07') },
  ]
  const spain = dimension('market', 'Spain')
  const chips = [
    { ...dimension('market', 'Mexico'), active: true },
    { ...dimension('plan', 'Premium'), active: true },
    { ...dimension('role', 'Guest'), active: true },
    { ...dimension('surface', 'any'), active: false },
  ]
  const planned = t({ en: 'Planned', es: 'Prevista' })
  return (
    <AppWindow
      crumbs={['acme-shop', t({ en: 'Definition', es: 'Definición' })]}
      tabs={[{ label: t({ en: 'Current', es: 'Vigente' }) }, { label: planned }, { label: 'Changelog' }]}
      active={planned}
    >
      <div className="space-y-3 p-4 text-xs">
        <div className="flex flex-wrap gap-1.5">
          {chips.map(c => (
            <DimensionChip key={c.name} name={c.name} value={c.value} active={c.active} />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <Label>{t({ en: 'Current · in production', es: 'Vigente · en producción' })}</Label>
            <ul className="space-y-2">
              {current.map((r, i) => (
                <motion.li key={r.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }}>
                  <ArtifactTag kind="rule" id={r.id} /> <span className="ml-1">{r.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-dashed p-3">
            <Label>{t({ en: 'Planned · accepted, not shipped', es: 'Prevista · accepted, sin publicar' })}</Label>
            <ul className="space-y-2">
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className={cn('opacity-60')}>
                <span className="font-mono text-muted-foreground">{proposal.id}</span> <ProposalBadge state="accepted" />
                <p className="mt-1">{proposal.title}</p>
                <p className="mt-0.5 text-warn">
                  {t({ en: 'Does not apply to Mexico', es: 'No aplica a México' })}:{' '}
                  {t({ en: `${spain.name}: ${spain.value} only`, es: `solo ${spain.name}: ${spain.value}` })}
                </p>
              </motion.li>
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground">
          {t({
            en: 'Filtered by dimension: only what applies to a guest in Mexico on Premium.',
            es: 'Filtrado por dimension: solo lo que aplica a un invitado en México con Premium.',
          })}
        </p>
      </div>
    </AppWindow>
  )
}

function Answer({ step }: { step: number }) {
  const t = useT()
  const title = t({ en: 'Guest checkout in Mexico', es: 'Checkout de invitados en México' })
  return (
    <div className="flex flex-col gap-4">
      <ChatPanel>
        <ChatMessage from="claude">
          <p>
            {t({
              en: (
                <>
                  <strong>Today: no.</strong> In Mexico guests can't pay (<span className="font-mono">R-12</span>).
                </>
              ),
              es: (
                <>
                  <strong>Hoy: no.</strong> En México los invitados no pueden pagar (<span className="font-mono">R-12</span>).
                </>
              ),
            })}
          </p>
          <p className="mt-1.5">
            {t({
              en: (
                <>
                  <strong>Next release:</strong> guests will pay with Bizum, but only in Spain (<span className="font-mono">PROP-42</span>). Nothing is planned for
                  Mexico, so I wouldn't promise it.
                </>
              ),
              es: (
                <>
                  <strong>Próxima release:</strong> los invitados pagarán con Bizum, pero solo en España (<span className="font-mono">PROP-42</span>). No hay nada
                  previsto para México, así que yo no lo prometería.
                </>
              ),
            })}
          </p>
          <p className="mt-1.5 text-muted-foreground">
            {t({ en: 'Want me to raise it with product as a draft proposal?', es: '¿Quieres que se lo plantee a producto como una proposal en draft?' })}
          </p>
        </ChatMessage>
        {step >= 4 && (
          <>
            <ChatMessage from={people.sales}>{t({ en: 'Yes, please.', es: 'Sí, por favor.' })}</ChatMessage>
            <ToolCall name="create_proposal">"{title}" → PROP-47</ToolCall>
          </>
        )}
      </ChatPanel>
      <Appear when={step >= 4}>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 text-xs shadow-xl shadow-black/10">
          <span className="font-mono text-muted-foreground">PROP-47</span>
          <span className="font-medium">{title}</span>
          <ProposalBadge state="draft" />
          <span className="text-muted-foreground">
            · {t({ en: 'requested by', es: 'pedida por' })} {people.sales} · {t({ en: 'waiting for product', es: 'pendiente de producto' })}
          </span>
        </div>
      </Appear>
    </div>
  )
}
