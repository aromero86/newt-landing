import type { ComponentType } from 'react'
import { BriefcaseBusinessIcon, CodeXmlIcon, FlaskConicalIcon, LifeBuoyIcon, LightbulbIcon, type LucideIcon } from 'lucide-react'
import { people } from '@/lib/data'
import { useT, type Bi } from '@/lib/i18n'
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
  label: Bi
  icon: LucideIcon
  person: string
  gets: Bi
  steps: Bi[]
  Scene: ComponentType<{ step: number }>
}

const roles: Role[] = [
  {
    id: 'support',
    label: { en: 'Support', es: 'Soporte' },
    icon: LifeBuoyIcon,
    person: people.support,
    gets: {
      en: 'Knows in seconds whether a complaint is a known bug, with the workaround product left on it, and turns every repeat into an occurrence instead of a new ticket.',
      es: 'Sabe en segundos si una queja es un bug conocido, con el workaround que dejó producto, y convierte cada repetición en una ocurrencia en vez de un ticket nuevo.',
    },
    steps: supportSteps,
    Scene: SupportScene,
  },
  {
    id: 'product',
    label: { en: 'Product', es: 'Producto' },
    icon: LightbulbIcon,
    person: people.product,
    gets: {
      en: 'Changes the product by talking it through, approves exactly what changes delta by delta, and cannot accept anything that contradicts what is already there.',
      es: 'Cambia el producto conversando, aprueba exactamente lo que cambia, delta a delta, y no puede aceptar nada que contradiga lo que ya existe.',
    },
    steps: productSteps,
    Scene: ProductScene,
  },
  {
    id: 'development',
    label: { en: 'Development', es: 'Desarrollo' },
    icon: CodeXmlIcon,
    person: people.dev,
    gets: {
      en: 'Works from accepted proposals instead of guesses, and sees on the pull request itself which rule a line of code breaks.',
      es: 'Trabaja a partir de proposals aceptadas en vez de suposiciones, y ve en la propia pull request qué rule rompe una línea de código.',
    },
    steps: developmentSteps,
    Scene: DevelopmentScene,
  },
  {
    id: 'qa',
    label: { en: 'QA', es: 'QA' },
    icon: FlaskConicalIcon,
    person: people.qa,
    gets: {
      en: 'Tests against acceptance criteria that live with the rules, sees what has no test, and catches regressions against the current definition.',
      es: 'Prueba contra criterios de aceptación que viven junto a las rules, ve lo que no tiene test y detecta regresiones contra la definición vigente.',
    },
    steps: qaSteps,
    Scene: QaScene,
  },
  {
    id: 'sales',
    label: { en: 'Sales', es: 'Ventas' },
    icon: BriefcaseBusinessIcon,
    person: people.sales,
    gets: {
      en: 'Answers what the product does today, and what is already planned, for this market and this plan, without promising what the definition does not say.',
      es: 'Responde qué hace hoy el producto y qué está ya previsto, para este mercado y este plan, sin prometer lo que la definición no dice.',
    },
    steps: salesSteps,
    Scene: SalesScene,
  },
]

export default function Roles() {
  const t = useT()
  return (
    <Section id="roles">
      <SectionHeading
        eyebrow={t({ en: 'Everyone, one definition', es: 'Todo el mundo, una definición' })}
        title={t({
          en: <>The same source of truth, <span className="text-gradient">seen from every seat</span></>,
          es: <>La misma fuente de verdad, <span className="text-gradient">vista desde cada puesto</span></>,
        })}
      >
        {t({
          en: 'Support, product, development, QA and sales stop keeping their own version of how the product works. Pick a role and watch a day with newt.',
          es: 'Soporte, producto, desarrollo, QA y ventas dejan de tener cada uno su versión de cómo funciona el producto. Elige un rol y mira un día con newt.',
        })}
      </SectionHeading>

      <Tabs defaultValue="product" className="gap-6">
          <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <TabsList className="h-11">
              {roles.map(r => (
                <TabsTrigger key={r.id} value={r.id} className="px-3.5">
                  <r.icon aria-hidden /> {t(r.label)}
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
                    {r.person}, {r.id === 'qa' ? 'QA' : t(r.label).toLowerCase()}.
                  </span>{' '}
                  {t(r.gets)}
                </p>
              </div>
              <Stage steps={r.steps.map(s => t(s))}>{step => <r.Scene step={step} />}</Stage>
            </TabsContent>
          ))}
      </Tabs>
    </Section>
  )
}
