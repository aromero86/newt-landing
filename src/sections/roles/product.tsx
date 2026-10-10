import { motion } from 'motion/react'
import { CheckCircle2Icon, FileTextIcon, ShieldAlertIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { Typing } from '@/lib/typing'
import { useT, type Bi } from '@/lib/i18n'
import { ChatMessage, ChatPanel, ToolCall } from '@/components/mock/chat'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag, DeltaBadge, ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { Appear, Label } from './parts'
import { Screen } from './stage'
import { useRolesStory } from './story'

export const productSteps: Bi[] = [
  { en: 'Lucía tells Claude what she wants, in her own words.', es: 'Lucía le cuenta a Claude lo que quiere, con sus palabras.' },
  { en: 'Claude checks the current definition and asks what is not clear.', es: 'Claude revisa la definición vigente y pregunta lo que no está claro.' },
  { en: 'Claude writes PROP-42: the story behind the change.', es: 'Claude escribe PROP-42: el relato detrás del cambio.' },
  { en: 'newt extracts the deltas: what exactly changes in the definition.', es: 'newt extrae los deltas: qué cambia exactamente en la definición.' },
  { en: 'The gate finds a conflict with R-07, with an explanation.', es: 'La puerta encuentra un conflicto con R-07, y lo explica.' },
  { en: 'One edit later only Δ1 needs a new look. All approved: accepted.', es: 'Tras un cambio, solo Δ1 necesita otra mirada. Todo approved: accepted.' },
]

export function ProductScene({ step }: { step: number }) {
  const inApp = step >= 2
  return (
    <Screen id={inApp ? 'app' : 'chat'} className="h-full">
      {inApp ? <ProposalPage step={step} /> : <Conversation step={step} />}
    </Screen>
  )
}

function Conversation({ step }: { step: number }) {
  const t = useT()
  const { proposal, rule } = useRolesStory()
  return (
    <ChatPanel className="min-h-[440px]">
      <ChatMessage from={people.product}>
        <Typing text={proposal.ask} active />
      </ChatMessage>
      {step >= 1 && (
        <>
          <ToolCall name="search">{t({ en: '"guests pay"', es: '"invitados pagar"' })} → rule R-12, rule R-07</ToolCall>
          <ChatMessage from="claude">
            <p>
              {t({
                en: <>Today <strong>R-12</strong> says <em>“{rule('R-12')}”</em> Before I write the proposal:</>,
                es: <>Hoy <strong>R-12</strong> dice <em>«{rule('R-12')}»</em> Antes de escribir la proposal:</>,
              })}
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-muted-foreground">
              <li>{t({ en: 'Only Bizum, or every payment method?', es: '¿Solo Bizum o todos los medios de pago?' })}</li>
              <li>{t({ en: 'Only in the mobile app?', es: '¿Solo en la app móvil?' })}</li>
              <li>{t({ en: 'Where does a guest get the invoice?', es: '¿Dónde recibe la factura un invitado?' })}</li>
            </ul>
          </ChatMessage>
        </>
      )}
    </ChatPanel>
  )
}

function ProposalPage({ step }: { step: number }) {
  const t = useT()
  const { proposal, deltas, conflict, rules } = useRolesStory()
  const showDeltas = step >= 3
  const conflicted = step === 4
  const done = step >= 5
  const state = done ? 'accepted' : 'in review'

  return (
    <AppWindow
      crumbs={['acme-shop', 'proposals', proposal.id]}
      tabs={[{ label: t({ en: 'Document', es: 'Documento' }) }, { label: 'Deltas', count: 5 }, { label: 'Revisions', count: done ? 2 : 1 }]}
      active="Deltas"
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{proposal.title}</h3>
          <ProposalBadge state={state} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {proposal.feature} · {t({ en: 'by', es: 'de' })} {proposal.author} · revision {done ? 2 : 1}
        </p>

        {!showDeltas && (
          <div className="mt-4 space-y-2 rounded-lg border bg-subtle p-3 text-xs leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <FileTextIcon className="size-3.5" /> {t({ en: 'Document', es: 'Documento' })}
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
            <Label>{t({ en: 'Deltas extracted from the document', es: 'Deltas extraídos del documento' })}</Label>
            <ul className="divide-y rounded-lg border">
              {deltas.map((d, i) => {
                const isConflict = d.id === conflict.delta
                const text = done && isConflict ? rules.guestsPayBizum.text : d.after
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
                        <span className="text-muted-foreground">{d.opLabel}</span>
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
                {t({ en: 'Conflict', es: 'Conflicto' })}: {conflict.delta} ↔ {conflict.with.id}
              </p>
              <p className="mt-1 leading-relaxed text-muted-foreground">{conflict.explanation}</p>
            </div>
          </div>
        </Appear>

        <Appear when={done} className="mt-3">
          <div className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ok/10 p-3 text-xs">
            <CheckCircle2Icon className="size-4 shrink-0 text-ok" />
            <p>
              <span className="font-medium text-ok">{t({ en: 'Accepted.', es: 'Aceptada.' })}</span>{' '}
              <span className="text-muted-foreground">
                {t({
                  en: 'Δ2–Δ5 kept their approval; only Δ1 changed. It is now in the development backlog.',
                  es: 'Δ2–Δ5 conservan su aprobación; solo cambió Δ1. Ya está en el backlog de desarrollo.',
                })}
              </span>
            </p>
          </div>
        </Appear>
      </div>
    </AppWindow>
  )
}
