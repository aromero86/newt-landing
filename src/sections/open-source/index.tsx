import type React from 'react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { ServerIcon, SparklesIcon, ScanSearchIcon, CopyIcon, CheckIcon, ArrowRightIcon } from 'lucide-react'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { GithubMark } from '@/components/site/icons'
import { REPO_URL } from '@/lib/links'
import { cn } from '@/lib/utils'
import { useT, type Bi } from '@/lib/i18n'

const pillars: { icon: React.ComponentType<{ className?: string }>; title: Bi; text: Bi }[] = [
  {
    icon: ServerIcon,
    title: { en: 'Self-hosted', es: 'En tus servidores' },
    text: {
      en: 'Your product definition is your company’s knowledge. Run newt on your own server; your data stays with you.',
      es: 'La definición de tu producto es el conocimiento de tu empresa. Ejecuta newt en tu propio servidor: tus datos se quedan contigo.',
    },
  },
  {
    icon: SparklesIcon,
    title: { en: 'Claude-native', es: 'Hecho para Claude' },
    text: {
      en: 'newt speaks MCP. Product, support and developers work with it from Claude, in plain language.',
      es: 'newt habla MCP. Producto, soporte y desarrollo trabajan con él desde Claude, en lenguaje natural.',
    },
  },
  {
    icon: GithubMark,
    title: { en: 'GitHub App', es: 'App de GitHub' },
    text: {
      en: 'Checks on every pull request, proposals linked to PRs, product releases synced with your GitHub releases.',
      es: 'Comprobaciones en cada pull request, proposals enlazadas a PRs y releases de producto sincronizadas con las de GitHub.',
    },
  },
  {
    icon: ScanSearchIcon,
    title: { en: 'Bootstraps from your code', es: 'Arranca desde tu código' },
    text: {
      en: 'Point it at an existing repository and Claude drafts the definition your code already follows, for your team to review.',
      es: 'Apúntalo a un repositorio existente y Claude redacta la definición que tu código ya cumple, para que tu equipo la revise.',
    },
  },
]

/** The eight stages of the plan (RFC.md). `now` is where development is. */
const stages: { name: Bi; text: Bi }[] = [
  { name: { en: 'Foundations', es: 'Cimientos' }, text: { en: 'Repository, web shell, users', es: 'Repositorio, esqueleto web, usuarios' } },
  { name: { en: 'Define a product', es: 'Definir un producto' }, text: { en: 'Rules, proposals, deltas, releases', es: 'Rules, proposals, deltas, releases' } },
  { name: { en: 'Claude', es: 'Claude' }, text: { en: 'Proposals by conversation, first bootstrap', es: 'Proposals conversando, primer arranque' } },
  { name: { en: 'The gate', es: 'La puerta' }, text: { en: 'Nothing contradictory is accepted', es: 'No se acepta nada contradictorio' } },
  { name: { en: 'Full model', es: 'Modelo completo' }, text: { en: 'Entities, lifecycles, actors, parameters', es: 'Entities, lifecycles, actors, parameters' } },
  { name: { en: 'Bugs & board', es: 'Bugs y board' }, text: { en: 'Known bugs, monitoring, support', es: 'Bugs conocidos, monitorización, soporte' } },
  { name: { en: 'The team', es: 'El equipo' }, text: { en: 'Notifications, internal deployment', es: 'Avisos, despliegue interno' } },
  { name: { en: 'The code', es: 'El código' }, text: { en: 'GitHub App, PR checks, agents', es: 'App de GitHub, checks en PRs, agentes' } },
]
const now = 0

const quickstart = (t: (v: Bi) => string) => `# ${t({ en: 'coming with the first release', es: 'llegará con la primera release' })}
git clone <repo> newt && cd newt
bun install && bun run dev

# ${t({ en: 'connect Claude to your newt', es: 'conecta Claude a tu newt' })}
claude mcp add newt -- newt mcp`

export default function OpenSource() {
  const t = useT()
  return (
    <Section id="open-source">
      <SectionHeading
        eyebrow="Open source"
        title={t({ en: 'Built in the open. Yours to run.', es: 'Hecho en abierto. Tuyo para usarlo.' })}
      >
        {t({
          en: 'newt is being built in the open, phase by phase, starting with our own products. Follow along, try it early, and tell us where it breaks.',
          es: 'newt se está construyendo en abierto, fase a fase, empezando por nuestros propios productos. Síguelo, pruébalo pronto y cuéntanos dónde falla.',
        })}
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <Reveal key={p.title.en} delay={i * 0.06} className="rounded-2xl border bg-card p-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
              <p.icon className="size-4" />
            </span>
            <h3 className="mt-4 font-semibold">{t(p.title)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(p.text)}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold">{t({ en: 'Where we are', es: 'Dónde estamos' })}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({
              en: 'Eight stages, each one usable on its own. We review every phase before starting the next.',
              es: 'Ocho etapas, cada una útil por sí sola. Revisamos cada fase antes de empezar la siguiente.',
            })}
          </p>
          <ol className="mt-5 space-y-2.5">
            {stages.map((s, i) => (
              <motion.li
                key={s.name.en}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]',
                    i === now ? 'border-brand bg-brand text-primary-foreground' : 'text-muted-foreground',
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={cn('font-medium', i !== now && 'text-muted-foreground')}>{t(s.name)}</span>
                <span className="hidden truncate text-muted-foreground sm:inline">· {t(s.text)}</span>
                {i === now && (
                  <span className="ml-auto shrink-0 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] text-brand">
                    {t({ en: 'in progress', es: 'en marcha' })}
                  </span>
                )}
              </motion.li>
            ))}
          </ol>
        </Reveal>
        <Reveal id="quickstart" className="scroll-mt-24 rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t({ en: 'Quickstart', es: 'Cómo empezar' })}</h3>
            <span className="rounded-full bg-warn/15 px-2 py-0.5 text-[10px] text-warn">
              {t({ en: 'preview: not runnable yet', es: 'avance: aún no funciona' })}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({
              en: 'What getting started will look like. Star the repository to know when the first release is out.',
              es: 'Así será empezar. Dale una estrella al repositorio para enterarte cuando salga la primera release.',
            })}
          </p>
          <Code text={quickstart(t)} />
        </Reveal>
      </div>

      <Reveal className="relative mt-16 overflow-hidden rounded-3xl border bg-card p-8 text-center sm:p-14">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--brand)_0%,transparent_60%)] opacity-15" />
        <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t({ en: 'Stop guessing how your product ', es: 'Deja de adivinar cómo ' })}
          <span className="text-gradient">{t({ en: 'should behave.', es: 'debe comportarse tu producto.' })}</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
          {t({
            en: 'One living definition for product, support, QA, sales and the code. Versioned, coherent, and checked on every pull request.',
            es: 'Una única definición viva para producto, soporte, QA, ventas y el código. Versionada, coherente y comprobada en cada pull request.',
          })}
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href={REPO_URL}>
              <GithubMark className="size-4" /> {t({ en: 'Star on GitHub', es: 'Estrella en GitHub' })}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#how">
              {t({ en: 'See how it works', es: 'Mira cómo funciona' })} <ArrowRightIcon />
            </a>
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}

function Code({ text }: { text: string }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard can be blocked; the text is still selectable.
    }
  }
  return (
    <div className="relative mt-4 rounded-xl border bg-background">
      <Button variant="ghost" size="icon" onClick={copy} className="absolute top-2 right-2 size-7" aria-label={t({ en: 'Copy commands', es: 'Copiar comandos' })}>
        {copied ? <CheckIcon className="text-ok" /> : <CopyIcon />}
      </Button>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
        {text.split('\n').map((l, i) => (
          <div key={i} className={l.startsWith('#') ? 'text-muted-foreground' : ''}>
            {l === '' ? '\u00a0' : l.startsWith('#') ? l : <><span className="text-brand select-none">$ </span>{l}</>}
          </div>
        ))}
      </pre>
    </div>
  )
}
