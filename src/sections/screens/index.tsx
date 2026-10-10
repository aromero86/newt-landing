import type { ReactNode } from 'react'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { ProposalScreen } from './proposal-screen'
import { DefinitionScreen } from './definition-screen'
import { BoardScreen } from './board-screen'
import { BugScreen } from './bug-screen'
import { useT } from '@/lib/i18n'

export default function Screens() {
  const t = useT()
  return (
    <Section id="screens">
      <SectionHeading
        eyebrow={t({ en: 'The app', es: 'La app' })}
        title={t({ en: 'Everything a product team reviews, in one place.', es: 'Todo lo que revisa un equipo de producto, en un solo sitio.' })}
      >
        {t({
          en: 'A review tool that feels like GitHub, built for product definitions instead of files. Design previews of what we are building.',
          es: 'Una herramienta de revisión que se siente como GitHub, pensada para definiciones de producto en vez de ficheros. Son avances de diseño de lo que estamos construyendo.',
        })}
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-5">
        <Tile
          className="lg:col-span-3"
          title={t({ en: 'A proposal', es: 'Una proposal' })}
          text={t({
            en: 'The document, its deltas with “viewed” checkboxes, the gate\'s findings and every revision.',
            es: 'El documento, sus deltas con casillas de “visto”, lo que encuentra la puerta y cada revision.',
          })}
        >
          <ProposalScreen />
        </Tile>
        <Tile
          className="lg:col-span-2"
          title={t({ en: 'Current vs planned', es: 'Vigente y prevista' })}
          text={t({
            en: 'How the product works today, and how it will once accepted proposals ship.',
            es: 'Cómo funciona el producto hoy, y cómo funcionará cuando salgan las proposals aceptadas.',
          })}
        >
          <DefinitionScreen />
        </Tile>
        <Tile
          className="lg:col-span-3"
          title={t({ en: 'The board', es: 'El board' })}
          text={t({
            en: 'Proposals and bugs in one view, filtered by any dimension of your product.',
            es: 'Proposals y bugs en una sola vista, filtrados por cualquier dimension de tu producto.',
          })}
        >
          <BoardScreen />
        </Tile>
        <Tile
          className="lg:col-span-2"
          title={t({ en: 'Bugs, grouped', es: 'Bugs agrupados' })}
          text={t({
            en: 'Crashes from monitoring land as one bug with its occurrences, linked to what it breaks.',
            es: 'Los crashes de la monitorización llegan como un único bug con sus ocurrencias, enlazado a lo que rompe.',
          })}
        >
          <BugScreen />
        </Tile>
      </div>
    </Section>
  )
}

function Tile({ title, text, children, className }: { title: string; text: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={`flex min-w-0 flex-col rounded-2xl border bg-card/50 p-4 sm:p-5 ${className ?? ''}`}>
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
      <div>{children}</div>
    </Reveal>
  )
}
