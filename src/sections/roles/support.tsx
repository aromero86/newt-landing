import { InboxIcon, LifeBuoyIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { Typing } from '@/lib/typing'
import { useT, type Bi } from '@/lib/i18n'
import { ChatMessage, ChatPanel, ToolCall } from '@/components/mock/chat'
import { ArtifactTag, BugBadge, DimensionChip } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { Appear, Counter, Panel } from './parts'
import { useRolesStory } from './story'

export const supportSteps: Bi[] = [
  { en: 'A customer writes in: paying with Bizum crashes the app.', es: 'Escribe una clienta: al pagar con Bizum se cierra la app.' },
  { en: 'Support asks Claude, in plain words, if it is a known bug.', es: 'Soporte le pregunta a Claude, con sus palabras, si es un bug conocido.' },
  { en: 'newt finds BUG-77: confirmed, already seen 132 times.', es: 'newt encuentra BUG-77: confirmed y visto ya 132 veces.' },
  { en: 'Claude answers with the workaround product left on the bug.', es: 'Claude responde con el workaround que dejó producto en el bug.' },
  { en: 'This customer is one more occurrence, not a new ticket.', es: 'Esta clienta es una ocurrencia más, no un ticket nuevo.' },
]

export function SupportScene({ step }: { step: number }) {
  const t = useT()
  const { bug } = useRolesStory()
  const question = t({
    en: 'A customer says the app crashes when paying with Bizum on iOS. Is this a known bug?',
    es: 'Una clienta dice que la app se cierra al pagar con Bizum en iOS. ¿Es un bug conocido?',
  })

  return (
    <div className="grid h-full gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="flex flex-col gap-4">
        <Panel
          title={t({ en: 'Support inbox', es: 'Bandeja de soporte' })}
          icon={<InboxIcon className="size-3.5 text-muted-foreground" />}
          aside={<span className="text-muted-foreground">#4812</span>}
        >
          <div className="flex gap-2.5 text-sm">
            <Avatar name="Carmen" />
            <div>
              <p className="font-medium">
                Carmen R. <span className="font-normal text-muted-foreground">· iPhone · {t({ en: 'Spain', es: 'España' })}</span>
              </p>
              <p className="mt-1 leading-relaxed text-muted-foreground">
                {t({
                  en: '“I tried to pay with Bizum three times and the app closes every time. My order is stuck.”',
                  es: '«He intentado pagar con Bizum tres veces y la app se cierra cada vez. Mi pedido se ha quedado colgado.»',
                })}
              </p>
            </div>
          </div>
        </Panel>

        <Appear when={step >= 2}>
          <Panel title={bug.id} icon={<LifeBuoyIcon className="size-3.5 text-bad" />} aside={<BugBadge state="confirmed" />}>
            <p className="text-sm font-medium">{bug.title}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {bug.scope.map(s => {
                const [name, value] = s.split(': ')
                return <DimensionChip key={s} name={name} value={value} />
              })}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {t({ en: 'violates', es: 'incumple' })} <ArtifactTag kind={bug.violates.kind} id={bug.violates.id} />
              </span>
              <span className="flex items-baseline gap-1">
                <Counter value={step >= 4 ? bug.occurrences + 1 : bug.occurrences} className="text-base font-semibold text-foreground" />
                {t({ en: 'occurrences', es: 'ocurrencias' })}
              </span>
            </div>
          </Panel>
        </Appear>
      </div>

      <ChatPanel className="min-h-[300px]">
        {step >= 1 && (
          <ChatMessage from={people.support}>
            <Typing text={question} active={step >= 1} />
          </ChatMessage>
        )}
        {step >= 2 && (
          <ToolCall name="search_bugs">
            {t({ en: '"Bizum crash iOS"', es: '"Bizum se cierra iOS"' })} → {bug.id}
          </ToolCall>
        )}
        {step >= 3 && (
          <ChatMessage from="claude">
            <p>
              {t({
                en: <>Yes: it's <strong>{bug.id}</strong>, confirmed and still open. Workaround from product:</>,
                es: <>Sí: es <strong>{bug.id}</strong>, confirmado y todavía abierto. El workaround de producto:</>,
              })}
            </p>
            <p className="mt-1.5 text-muted-foreground">{bug.workaround}</p>
          </ChatMessage>
        )}
        {step >= 4 && (
          <>
            <ToolCall name="add_occurrence">{bug.id} ← ticket #4812</ToolCall>
            <ChatMessage from="claude">
              {t({
                en: `Added as occurrence #${bug.occurrences + 1}. I'll let you know when the fix is merged.`,
                es: `Añadida como ocurrencia n.º ${bug.occurrences + 1}. Te aviso cuando se mergee el arreglo.`,
              })}
            </ChatMessage>
          </>
        )}
      </ChatPanel>
    </div>
  )
}
