import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Section, SectionHeading } from '@/components/site/section'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { Stage } from './stages'
import { useT, type Bi } from '@/lib/i18n'

export const steps: { who: Bi; title: Bi; text: Bi }[] = [
  {
    who: { en: 'Product', es: 'Producto' },
    title: { en: 'Describe the change, in your words', es: 'Cuenta el cambio con tus palabras' },
    text: {
      en: 'Talk to Claude. It reads the current definition through newt, finds what is affected and asks what is not clear instead of guessing.',
      es: 'Habla con Claude. Lee la definición vigente a través de newt, encuentra lo afectado y pregunta lo que no está claro en vez de suponerlo.',
    },
  },
  {
    who: { en: 'Claude', es: 'Claude' },
    title: { en: 'A proposal is written', es: 'Se escribe una proposal' },
    text: {
      en: 'Claude writes the proposal document: context, problem and decisions. The document is the single source of the change.',
      es: 'Claude escribe el documento de la proposal: contexto, problema y decisiones. El documento es la única fuente del cambio.',
    },
  },
  {
    who: { en: 'newt', es: 'newt' },
    title: { en: 'newt extracts the deltas', es: 'newt extrae los deltas' },
    text: {
      en: 'Every concrete change to the definition becomes a delta: a rule changed, a state added to a lifecycle, a new parameter. Deltas are what gets approved, checked and shipped.',
      es: 'Cada cambio concreto en la definición es un delta: una rule que cambia, un estado nuevo en un lifecycle, un parameter nuevo. Los deltas son lo que se aprueba, se comprueba y se publica.',
    },
  },
  {
    who: { en: 'newt', es: 'newt' },
    title: { en: 'The gate checks the whole definition', es: 'La puerta revisa toda la definición' },
    text: {
      en: 'Not just what looks related: every artifact, in batches, with a closer look where scopes overlap. Conflicts come with an explanation, next to the delta that causes them.',
      es: 'No solo lo que parece relacionado: todos los artifacts, por bloques, y con más detalle donde los alcances se solapan. Los conflictos llegan explicados, junto al delta que los causa.',
    },
  },
  {
    who: { en: 'Product', es: 'Producto' },
    title: { en: 'Iterate without starting over', es: 'Itera sin empezar de cero' },
    text: {
      en: 'Edit the document and newt re-extracts the deltas. What did not change keeps its approval — like files marked “viewed” in a GitHub review.',
      es: 'Edita el documento y newt vuelve a extraer los deltas. Lo que no ha cambiado conserva su aprobación, como los ficheros marcados como «viewed» en una revisión de GitHub.',
    },
  },
  {
    who: { en: 'Product', es: 'Producto' },
    title: { en: 'Accepted means ready for development', es: 'Accepted significa lista para desarrollo' },
    text: {
      en: 'Every delta approved and the gate passed: the proposal is accepted, frozen, and lands in the development backlog. The planned definition moves ahead.',
      es: 'Todos los deltas aprobados y la puerta superada: la proposal pasa a accepted, queda congelada y entra en el backlog de desarrollo. La definición prevista avanza.',
    },
  },
  {
    who: { en: 'Development', es: 'Desarrollo' },
    title: { en: 'The pull request is checked against it', es: 'La pull request se comprueba contra ella' },
    text: {
      en: 'The PR declares the proposal it implements. newt checks the code against it and against the current definition, artifact by artifact, right in the diff.',
      es: 'La PR declara qué proposal implementa. newt comprueba el código contra ella y contra la definición vigente, artifact por artifact, en el propio diff.',
    },
  },
  {
    who: { en: 'Development', es: 'Desarrollo' },
    title: { en: 'Merge, and the definition moves', es: 'Merge, y la definición avanza' },
    text: {
      en: 'When the PR that completes the proposal is merged, the proposal becomes merged and its deltas join the current definition. Nobody updates a doc by hand.',
      es: 'Cuando se mergea la PR que completa la proposal, pasa a merged y sus deltas entran en la definición vigente. Nadie actualiza un documento a mano.',
    },
  },
  {
    who: { en: 'Everyone', es: 'Todos' },
    title: { en: 'Product and code ship as one version', es: 'Producto y código salen en una sola versión' },
    text: {
      en: 'A GitHub release creates the product release, with a changelog of what changed in the product and why.',
      es: 'Un release de GitHub crea la release de producto, con un changelog de qué cambió en el producto y por qué.',
    },
  },
]

export default function How() {
  const t = useT()
  const [active, setActive] = useState(0)
  return (
    <Section id="how">
      <SectionHeading
        eyebrow={t({ en: 'How it works', es: 'Cómo funciona' })}
        title={t({ en: 'From a sentence to production, without losing the thread.', es: 'De una frase a producción, sin perder el hilo.' })}
      >
        {t({
          en: 'One change, end to end: a product manager asks for something, newt keeps it coherent, a developer ships it, and the definition of the product is never out of date.',
          es: 'Un cambio de punta a punta: alguien de producto pide algo, newt lo mantiene coherente, desarrollo lo implementa y la definición del producto nunca se queda desactualizada.',
        })}
      </SectionHeading>
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <ol className="flex min-w-0 flex-col">
          {steps.map((s, i) => (
            <StepBlock key={s.title.en} index={i} active={active === i} onActive={() => setActive(i)} />
          ))}
        </ol>
        <div className="hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-8rem)] max-h-[720px] min-h-[600px] flex-col justify-center">
            <Progress active={active} />
            <div className="relative mt-4 h-[540px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.985 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0"
                >
                  <Stage step={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function StepBlock({ index, active, onActive }: { index: number; active: boolean; onActive: () => void }) {
  const t = useT()
  const ref = useRef<HTMLLIElement>(null)
  // A step is "current" while it crosses the middle of the screen.
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive()
  }, [inView, onActive])
  const s = steps[index]!
  return (
    <li ref={ref} className="flex flex-col justify-center py-8 lg:min-h-[64vh] lg:py-0">
      <div className={cn('transition-opacity duration-500', active ? 'lg:opacity-100' : 'lg:opacity-35')}>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className={cn('flex size-7 items-center justify-center rounded-full border', active ? 'border-brand text-brand' : 'text-muted-foreground')}>
            {index + 1}
          </span>
          <span className="tracking-widest text-muted-foreground uppercase">{t(s.who)}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">{t(s.title)}</h3>
        <p className="mt-3 text-pretty text-muted-foreground">{t(s.text)}</p>
      </div>
      {/* On small screens every step shows its own stage, inline. */}
      <div className="mt-6 h-[520px] lg:hidden">
        <InlineStage step={index} />
      </div>
    </li>
  )
}

/** Mounts the stage only when it scrolls into view, so its animation plays then. */
function InlineStage({ step }: { step: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  return (
    <div ref={ref} className="h-full">
      {inView && <Stage step={step} />}
    </div>
  )
}

function Progress({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {steps.map((s, i) => (
        <motion.span
          key={s.title.en}
          className="h-1 rounded-full"
          animate={{ width: i === active ? 36 : 14, backgroundColor: i <= active ? 'var(--brand)' : 'var(--border)' }}
          transition={{ duration: 0.4 }}
        />
      ))}
      <span className="ml-2 font-mono text-xs text-muted-foreground">
        {active + 1}/{steps.length}
      </span>
    </div>
  )
}
