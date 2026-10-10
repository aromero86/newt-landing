import { useCallback, useState, type ComponentType } from 'react'
import { motion } from 'motion/react'
import { CheckCheckIcon, GitMergeIcon, GitPullRequestIcon, LockIcon, ZapIcon, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { GithubMark } from '@/components/site/icons'
import { useT, type Bi } from '@/lib/i18n'
import { BlockedScene, LinkedScene, NoProposalScene, ReleasedScene, UrgentScene, type SceneProps } from './scenes'

const scenes: { id: string; label: Bi; icon: LucideIcon; Scene: ComponentType<SceneProps> }[] = [
  { id: 'linked', label: { en: 'Linked & checked', es: 'Enlazada y comprobada' }, icon: CheckCheckIcon, Scene: LinkedScene },
  { id: 'blocked', label: { en: 'Not accepted, not checked', es: 'Sin aceptar, sin comprobar' }, icon: LockIcon, Scene: BlockedScene },
  { id: 'no-proposal', label: { en: 'PRs with no proposal', es: 'PRs sin proposal' }, icon: GitPullRequestIcon, Scene: NoProposalScene },
  { id: 'urgent', label: { en: 'The urgent lane', es: 'El carril urgente' }, icon: ZapIcon, Scene: UrgentScene },
  { id: 'released', label: { en: 'Merged & released', es: 'Mergeada y publicada' }, icon: GitMergeIcon, Scene: ReleasedScene },
]

/** Where newt meets the code: every scene is a PR on github.com with newt installed. */
export default function GitHubSection() {
  const t = useT()
  const [current, setCurrent] = useState(0)
  const next = useCallback(() => setCurrent(c => (c + 1) % scenes.length), [])
  const { Scene, id } = scenes[current]!

  return (
    <Section id="github">
      <SectionHeading
        eyebrow={t({ en: 'GitHub integration', es: 'Integración con GitHub' })}
        title={t({
          en: (
            <>
              A dev never has to leave GitHub <span className="text-gradient">to know what doesn’t comply.</span>
            </>
          ),
          es: (
            <>
              Un dev nunca tiene que salir de GitHub <span className="text-gradient">para saber qué no cumple.</span>
            </>
          ),
        })}
      >
        {t({
          en: 'newt is a required check on every pull request. It knows which proposal the PR implements, checks the code against it and against the current definition, and points at the exact line that breaks a rule.',
          es: 'newt es un check obligatorio en cada pull request. Sabe qué proposal implementa la PR, comprueba el código contra ella y contra la definición vigente, y señala la línea exacta que rompe una rule.',
        })}
      </SectionHeading>

      <Reveal>
        <div role="tablist" aria-label={t({ en: 'GitHub scenarios', es: 'Escenarios en GitHub' })} className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {scenes.map((s, i) => {
            const Icon = s.icon
            const active = i === current
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="github-scene"
                onClick={() => setCurrent(i)}
                className={cn(
                  'relative isolate flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  active ? 'border-brand/40 text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && <motion.span layoutId="github-scene-pill" className="absolute inset-0 -z-10 rounded-full bg-brand/10" transition={{ duration: 0.35, ease }} />}
                <Icon className={cn('size-4', active && 'text-brand')} />
                {t(s.label)}
              </button>
            )
          })}
        </div>

        <div id="github-scene" role="tabpanel" className="relative">
          {/* Keyed: a new scene remounts, plays its entrance and starts its own timeline. */}
          <div key={id} className="animate-in fade-in slide-in-from-bottom-3 duration-500 motion-reduce:animate-none">
            <Scene onDone={next} />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          t({
            en: { title: 'Linked like issues', text: '“Implements PROP-42” in a PR works like “Closes #123”: merge it and the proposal is merged in newt.' },
            es: { title: 'Enlazada como una issue', text: '“Implements PROP-42” en una PR funciona como “Closes #123”: al mergearla, la proposal pasa a merged en newt.' },
          }),
          t({
            en: { title: 'Annotated like a linter', text: 'Each artifact gets a line in the report, and failures land on the diff line that causes them.' },
            es: { title: 'Anotada como un linter', text: 'Cada artifact tiene su línea en el informe, y los fallos aparecen en la línea del diff que los provoca.' },
          }),
          t({
            en: { title: 'Released together', text: 'A GitHub release is a product release, so the changelog and the code always speak about the same version.' },
            es: { title: 'Publicadas a la vez', text: 'Un release de GitHub es una release del producto: el changelog y el código siempre hablan de la misma versión.' },
          }),
        ].map(card => (
          <div key={card.title} className="rounded-xl border bg-card/60 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <GithubMark className="size-4" /> {card.title}
            </div>
            <p className="text-sm text-muted-foreground">{card.text}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
