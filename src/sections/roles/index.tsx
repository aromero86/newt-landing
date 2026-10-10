import type { ComponentType } from 'react'
import { BriefcaseBusinessIcon, CodeXmlIcon, FlaskConicalIcon, LifeBuoyIcon, LightbulbIcon, type LucideIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { Section, SectionHeading } from '@/components/site/section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { Stage } from './stage'
import { SupportScene, supportSteps } from './support'
import { ProductScene, productSteps } from './product'
import { DevelopmentScene, developmentSteps } from './development'
import { QaScene, qaSteps } from './qa'
import { SalesScene, salesSteps } from './sales'

type Role = {
  id: string
  label: string
  icon: LucideIcon
  person: string
  gets: string
  steps: string[]
  Scene: ComponentType<{ step: number }>
}

const roles: Role[] = [
  {
    id: 'support',
    label: 'Support',
    icon: LifeBuoyIcon,
    person: people.support,
    gets: 'Knows in seconds whether a complaint is a known bug, with the workaround product left on it, and turns every repeat into an occurrence instead of a new ticket.',
    steps: supportSteps,
    Scene: SupportScene,
  },
  {
    id: 'product',
    label: 'Product',
    icon: LightbulbIcon,
    person: people.product,
    gets: 'Changes the product by talking it through, approves exactly what changes delta by delta, and cannot accept anything that contradicts what is already there.',
    steps: productSteps,
    Scene: ProductScene,
  },
  {
    id: 'development',
    label: 'Development',
    icon: CodeXmlIcon,
    person: people.dev,
    gets: 'Works from accepted proposals instead of guesses, and sees on the pull request itself which rule a line of code breaks.',
    steps: developmentSteps,
    Scene: DevelopmentScene,
  },
  {
    id: 'qa',
    label: 'QA',
    icon: FlaskConicalIcon,
    person: people.qa,
    gets: 'Tests against acceptance criteria that live with the rules, sees what has no test, and catches regressions against the current definition.',
    steps: qaSteps,
    Scene: QaScene,
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: BriefcaseBusinessIcon,
    person: people.sales,
    gets: 'Answers what the product does today, and what is already planned, for this market and this plan, without promising what the definition does not say.',
    steps: salesSteps,
    Scene: SalesScene,
  },
]

export default function Roles() {
  return (
    <Section id="roles">
      <SectionHeading eyebrow="Everyone, one definition" title={<>The same source of truth, <span className="text-gradient">seen from every seat</span></>}>
        Support, product, development, QA and sales stop keeping their own version of how the product works. Pick a role and watch a day with newt.
      </SectionHeading>

      <Tabs defaultValue="product" className="gap-6">
          <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <TabsList className="h-11">
              {roles.map(r => (
                <TabsTrigger key={r.id} value={r.id} className="px-3.5">
                  <r.icon aria-hidden /> {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {roles.map(r => (
            <TabsContent key={r.id} value={r.id} className="flex flex-col gap-6">
              <div className="flex max-w-3xl items-start gap-3">
                <Avatar name={r.person} className="mt-0.5 size-8 text-xs" />
                <p className="text-pretty text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {r.person}, {r.label === 'QA' ? 'QA' : r.label.toLowerCase()}.
                  </span>{' '}
                  {r.gets}
                </p>
              </div>
              <Stage steps={r.steps}>{step => <r.Scene step={step} />}</Stage>
            </TabsContent>
          ))}
      </Tabs>
    </Section>
  )
}
