import type { ReactNode } from 'react'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { ProposalScreen } from './proposal-screen'
import { DefinitionScreen } from './definition-screen'
import { BoardScreen } from './board-screen'
import { BugScreen } from './bug-screen'

export default function Screens() {
  return (
    <Section id="screens">
      <SectionHeading eyebrow="The app" title="Everything a product team reviews, in one place.">
        A review tool that feels like GitHub, built for product definitions instead of files. Design previews of what
        we are building.
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-5">
        <Tile className="lg:col-span-3" title="A proposal" text="The document, its deltas with “viewed” checkboxes, the gate's findings and every revision.">
          <ProposalScreen />
        </Tile>
        <Tile className="lg:col-span-2" title="Current vs planned" text="How the product works today, and how it will once accepted proposals ship.">
          <DefinitionScreen />
        </Tile>
        <Tile className="lg:col-span-3" title="The board" text="Proposals and bugs in one view, filtered by any dimension of your product.">
          <BoardScreen />
        </Tile>
        <Tile className="lg:col-span-2" title="Bugs, grouped" text="Crashes from monitoring land as one bug with its occurrences, linked to what it breaks.">
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
