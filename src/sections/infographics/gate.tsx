import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2Icon, ScanSearchIcon, XCircleIcon } from 'lucide-react'
import { ease, useStepper } from '@/lib/motion'
import { useStory } from '@/lib/data'
import { useT, type Bi } from '@/lib/i18n'
import { ProposalBadge } from '@/components/mock/status'
import { cn } from '@/lib/utils'
import { InfoCard, StepDots } from './card'

/**
 * The definition, split in blocks by area. Each dot is an artifact. The gate
 * sweeps every block: nothing is left out. `conflictAt` marks R-07's dot.
 */
const blocks: { name: Bi; dots: number; conflictAt?: number }[] = [
  { name: { en: 'Catalog', es: 'Catálogo' }, dots: 34 },
  { name: { en: 'Accounts', es: 'Cuentas' }, dots: 26 },
  { name: { en: 'Checkout › Payments', es: 'Checkout › Pagos' }, dots: 38, conflictAt: 21 },
  { name: { en: 'Orders', es: 'Pedidos' }, dots: 31 },
  { name: { en: 'Shipping', es: 'Envíos' }, dots: 22 },
  { name: { en: 'Backoffice', es: 'Backoffice' }, dots: 29 },
]
const TOTAL = blocks.reduce((n, b) => n + b.dots, 0)

const SWEEP = blocks.length // steps 0..5 sweep each block
const STEPS = SWEEP + 2

export function Gate({ className }: { className?: string }) {
  const t = useT()
  const { conflict, deltas, proposal } = useStory()
  const steps: string[] = [
    ...blocks.map((b, i) =>
      i < 2
        ? t({
            en: `Revision 1: checking ${proposal.id}'s deltas against ${b.name.en}…`,
            es: `Revision 1: comprobando los deltas de ${proposal.id} contra ${b.name.es}…`,
          })
        : i === 2
          ? t({ en: `Conflict: ${conflict.explanation}`, es: `Conflicto: ${conflict.explanation}` })
          : t({
              en: `The conflict stays open. Still checking ${b.name.en}: the gate reviews everything.`,
              es: `El conflicto sigue abierto. Sigue comprobando ${b.name.es}: la puerta lo revisa todo.`,
            }),
    ),
    t({
      en: 'Revision 2 caps Δ1 at €500. Only the changed delta is checked again.',
      es: 'La revision 2 limita Δ1 a 500 €. Solo se vuelve a comprobar el delta que cambió.',
    }),
    t({ en: 'No conflicts detected: PROP-42 can be accepted.', es: 'No se detectan conflictos: PROP-42 se puede aceptar.' }),
  ]
  const { ref, step, setStep } = useStepper(STEPS, { interval: 1700, hold: 3 })
  const sweeping = step < SWEEP ? step : -1
  const conflictFound = step >= 2
  const fixed = step >= SWEEP
  const accepted = step === steps.length - 1

  return (
    <InfoCard
      stepperRef={ref}
      index={2}
      title={t({ en: 'The gate checks everything', es: 'La puerta lo revisa todo' })}
      lead={t({
        en: 'Before a proposal is accepted, newt checks every delta against the whole planned definition, block by block.',
        es: 'Antes de aceptar una proposal, newt comprueba cada delta contra toda la definición prevista, bloque a bloque.',
      })}
      caption={steps[step]}
      captionKey={step}
      className={className}
    >
      {/* The proposal's deltas, the thing being checked */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] text-muted-foreground">{proposal.id}</span>
        {deltas.map(d => {
          const bad = d.id === conflict.delta && conflictFound && !fixed
          const redone = d.id === conflict.delta && fixed
          return (
            <span
              key={d.id}
              className={cn(
                'rounded-md border px-1.5 py-0.5 font-mono text-[11px] transition-colors duration-500',
                bad ? 'border-bad/50 bg-bad/15 text-bad' : redone ? 'border-ok/50 bg-ok/12 text-ok' : 'bg-background/60 text-foreground/80',
              )}
            >
              {d.id}
            </span>
          )
        })}
        <span className="ml-auto">
          <AnimatePresence mode="wait" initial={false}>
            {accepted ? (
              <motion.span key="acc" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <ProposalBadge state="accepted" />
              </motion.span>
            ) : (
              <motion.span key="rev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProposalBadge state="in review" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      {/* The whole definition, by blocks */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {blocks.map((block, i) => {
          const active = sweeping === i
          const done = sweeping === -1 || i < sweeping
          return (
            <div
              key={block.name.en}
              className={cn(
                'relative overflow-hidden rounded-lg border p-2 transition-colors duration-300',
                active ? 'border-brand/60 bg-brand/10' : 'bg-background/50',
              )}
            >
              {active && (
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-brand/30 to-transparent"
                  initial={{ left: '-20%' }}
                  animate={{ left: '110%' }}
                  transition={{ duration: 1.4, ease: 'linear' }}
                />
              )}
              <div className="mb-1.5 flex items-center justify-between gap-1">
                <p className="truncate text-[11px] font-medium">{t(block.name)}</p>
                {done && !active && <CheckCircle2Icon className="size-3 shrink-0 text-ok/80" />}
                {active && <ScanSearchIcon className="size-3 shrink-0 text-brand" />}
              </div>
              <div className="flex flex-wrap gap-1 lg:gap-1.5">
                {Array.from({ length: block.dots }, (_, d) => {
                  const isConflict = block.conflictAt === d
                  const lit = isConflict && conflictFound
                  return (
                    <span
                      key={d}
                      className={cn(
                        'size-2 rounded-[3px] transition-all duration-500 lg:size-2.5',
                        lit && !fixed && 'scale-150 bg-bad ring-2 ring-bad/40',
                        lit && fixed && 'bg-ok',
                        !lit && (done || active ? 'bg-muted-foreground/40' : 'bg-muted-foreground/15'),
                      )}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* How much has been checked: all of it, always */}
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-2"
            animate={{ width: `${(fixed ? 1 : (step + 0.5) / SWEEP) * 100}%` }}
            transition={{ duration: 0.8, ease }}
          />
        </div>
        <span className="font-mono text-[11px] whitespace-nowrap text-muted-foreground tabular-nums">
          {Math.round((fixed ? 1 : (step + 0.5) / SWEEP) * TOTAL)} / {TOTAL} artifacts
        </span>
      </div>

      {/* The conflict, explained next to its delta */}
      <div className="mt-3 min-h-[3.25rem]">
        <AnimatePresence mode="wait" initial={false}>
          {conflictFound && (
            <motion.div
              key={fixed ? 'fixed' : 'open'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className={cn('flex items-start gap-2 rounded-lg border px-3 py-2 text-xs', fixed ? 'border-ok/40 bg-ok/8' : 'border-bad/40 bg-bad/8')}
            >
              {fixed ? <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-ok" /> : <XCircleIcon className="mt-0.5 size-3.5 shrink-0 text-bad" />}
              <span>
                <span className="font-mono">{conflict.delta}</span> × <span className="font-mono">{conflict.with.id}</span>{' '}
                {fixed
                  ? t({
                      en: '— resolved in revision 2: guests pay with Bizum up to €500.',
                      es: '— resuelto en la revision 2: los invitados pagan con Bizum hasta 500 €.',
                    })
                  : `— ${conflict.with.text}`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <StepDots count={steps.length} step={step} onPick={setStep} />
    </InfoCard>
  )
}
