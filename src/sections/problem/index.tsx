import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { GitPullRequestIcon } from 'lucide-react'
import { Section, SectionHeading, Reveal } from '@/components/site/section'
import { useStepper } from '@/lib/motion'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useT, type Bi } from '@/lib/i18n'

export default function Problem() {
  const t = useT()
  return (
    <Section id="problem">
      <SectionHeading
        eyebrow={t({ en: 'The problem', es: 'El problema' })}
        title={t({ en: 'Nobody knows for sure how the product should behave.', es: 'Nadie sabe con certeza cómo debe comportarse el producto.' })}
      >
        {t({
          en: "What the product must do lives in docs, tickets, chats and a few people's heads. The only real source of truth is the code — bugs included. And more and more of that code is written by agents.",
          es: 'Lo que el producto debe hacer vive repartido en documentos, tickets, chats y la cabeza de unas pocas personas. La única fuente de verdad real es el código, con sus bugs incluidos. Y cada vez más de ese código lo escriben agentes.',
        })}
      </SectionHeading>
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title={t({ en: 'Product and code drift apart', es: 'Producto y código se separan' })}
          text={t({
            en: 'The spec said one thing, the code does another, and six months later nobody remembers which one is right.',
            es: 'La especificación decía una cosa, el código hace otra y seis meses después nadie recuerda cuál era la buena.',
          })}
          delay={0}
        >
          <Drift />
        </Card>
        <Card
          title={t({ en: 'Rules contradict each other', es: 'Las reglas se contradicen' })}
          text={t({
            en: 'A decision from last spring clashes with one from yesterday. You find out in production.',
            es: 'Una decisión de la primavera pasada choca con una de ayer. Te enteras en producción.',
          })}
          delay={0.08}
        >
          <Clash />
        </Card>
        <Card
          title={t({ en: 'Reviewing agent PRs is the bottleneck', es: 'Revisar las PRs de agentes es el cuello de botella' })}
          text={t({
            en: 'Code review checks that code is well written. Nobody checks that the product still does what it should.',
            es: 'La revisión de código comprueba que el código está bien escrito. Nadie comprueba que el producto siga haciendo lo que debe.',
          })}
          delay={0.16}
        >
          <Queue />
        </Card>
      </div>
    </Section>
  )
}

function Card({ title, text, children, delay }: { title: string; text: string; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative h-44 border-b bg-subtle" aria-hidden>
        {children}
      </div>
      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
    </Reveal>
  )
}

/** Two lines leave the same point and grow apart. */
function Drift() {
  const t = useT()
  const { ref, step } = useStepper(2, { interval: 2600, hold: 1 })
  return (
    <div ref={ref} className="absolute inset-0">
      <svg viewBox="0 0 300 170" className="size-full">
        <motion.path
          d="M20 85 C 110 85, 160 85, 280 40"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: step === 1 ? 1 : 0.35 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <motion.path
          d="M20 85 C 110 85, 160 85, 280 130"
          fill="none"
          stroke="var(--bad)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: step === 1 ? 1 : 0.35 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <circle cx="20" cy="85" r="5" fill="var(--foreground)" />
        <motion.text x="196" y="30" className="fill-brand text-[11px]" animate={{ opacity: step === 1 ? 1 : 0 }}>
          {t({ en: 'what the docs say', es: 'lo que dicen los docs' })}
        </motion.text>
        <motion.text x="196" y="152" className="fill-bad text-[11px]" animate={{ opacity: step === 1 ? 1 : 0 }}>
          {t({ en: 'what the code does', es: 'lo que hace el código' })}
        </motion.text>
      </svg>
    </div>
  )
}

/** Two rules slide in and collide. */
function Clash() {
  const t = useT()
  const { ref, step } = useStepper(3, { interval: 1500, hold: 2 })
  const hit = step >= 1
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center gap-1 px-4">
      <motion.div
        animate={{ x: hit ? 6 : -30, rotate: hit ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className={cn('w-36 rounded-lg border bg-card p-2.5 text-[11px] shadow-sm', step === 2 && 'border-bad/60')}
      >
        <div className="font-mono text-[10px] text-muted-foreground">rule R-07 · {t({ en: 'March', es: 'marzo' })}</div>
        {t({ en: 'Payments over €500 require an account.', es: 'Los pagos de más de 500 € requieren cuenta.' })}
      </motion.div>
      <motion.div
        animate={{ x: hit ? -6 : 30, rotate: hit ? 2 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className={cn('w-36 rounded-lg border bg-card p-2.5 text-[11px] shadow-sm', step === 2 && 'border-bad/60')}
      >
        <div className="font-mono text-[10px] text-muted-foreground">ticket · {t({ en: 'yesterday', es: 'ayer' })}</div>
        {t({ en: 'Guests can pay any amount with Bizum.', es: 'Los invitados pueden pagar cualquier importe con Bizum.' })}
      </motion.div>
      <motion.span
        className="absolute rounded-full bg-bad px-2 py-0.5 text-[10px] font-semibold text-white"
        animate={{ opacity: step === 2 ? 1 : 0, scale: step === 2 ? 1 : 0.6, y: 52 }}
      >
        {t({ en: 'found in production', es: 'descubierto en producción' })}
      </motion.span>
    </div>
  )
}

/** Pull requests pile up in front of one reviewer. */
const queued: Bi[] = [
  { en: 'Bizum for guests', es: 'Bizum para invitados' },
  { en: 'Refactor cart totals', es: 'Refactor de totales del carrito' },
  { en: 'Shipping rules MX', es: 'Reglas de envío MX' },
  { en: 'Fix invoice email', es: 'Arreglar email de factura' },
  { en: 'New admin roles', es: 'Nuevos roles de admin' },
  { en: 'Order states', es: 'Estados del pedido' },
]

function Queue() {
  const t = useT()
  const { ref, step } = useStepper(6, { interval: 700, hold: 3 })
  const prs = queued.map(q => t(q))
  return (
    <div ref={ref} className="absolute inset-0 flex items-center gap-4 px-5">
      <div className="flex flex-1 flex-col gap-1.5">
        {prs.slice(0, step + 1).map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[10px]"
          >
            <GitPullRequestIcon className="size-3 text-ok" />
            <span className="truncate">{t}</span>
            <span className="ml-auto font-mono text-muted-foreground">#{311 + i}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
        <Avatar name="Marc" className="size-9 text-sm" />
        <span>{t({ en: '1 reviewer', es: '1 revisor' })}</span>
        <motion.span className="font-mono text-bad" key={step} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>
          {step + 1} {t({ en: 'waiting', es: 'en espera' })}
        </motion.span>
      </div>
    </div>
  )
}
