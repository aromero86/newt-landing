import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2Icon, XCircleIcon, GitCommitHorizontalIcon } from 'lucide-react'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag, DeltaBadge, ProposalBadge } from '@/components/mock/status'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { FakeCursor } from '@/lib/typing'
import { useStepper } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useStory } from '@/lib/data'
import { useT } from '@/lib/i18n'

/*
 * 0 Δ2–Δ5 pending, conflict on Δ1
 * 1 Δ2 viewed  2 Δ3 viewed
 * 3 revision 2 fixes Δ1: conflict gone
 * 4 Δ1 approved  5 accepted
 */
export function ProposalScreen() {
  const t = useT()
  const { deltas, proposal, conflict, rules } = useStory()
  const { ref, step } = useStepper(6, { interval: 1700, hold: 2 })
  const approved = (i: number) => (i === 0 ? step >= 4 : i === 1 ? step >= 1 : i === 2 ? step >= 2 : true)
  const cursor = [
    { x: 92, y: 30 },
    { x: 6, y: 47 },
    { x: 6, y: 60 },
    { x: 92, y: 52 },
    { x: 6, y: 34 },
    { x: 85, y: 88 },
  ][step]!
  return (
    <div ref={ref}>
      <AppWindow
        crumbs={['acme-shop', 'Proposals', proposal.id]}
        tabs={[
          { label: 'Deltas', count: 5 },
          { label: t({ en: 'Document', es: 'Documento' }) },
          { label: t({ en: 'Checks', es: 'Comprobaciones' }), count: step >= 3 ? 0 : 1 },
          { label: 'Revisions', count: step >= 3 ? 2 : 1 },
        ]}
        active="Deltas"
        bodyClassName="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_150px]"
      >
        <FakeCursor x={cursor.x} y={cursor.y} click />
        <ul className="flex min-w-0 flex-col gap-1.5">
          {deltas.map((d, i) => (
            <li key={d.id} className={cn('flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-[11px]', i === 0 && step < 3 && 'border-bad/50 bg-bad/5')}>
              <Checkbox checked={approved(i)} aria-label={t({ en: `Viewed ${d.id}`, es: `${d.id} visto` })} className="pointer-events-none" />
              <span className="font-mono text-muted-foreground">{d.id}</span>
              <ArtifactTag kind={d.kind} id={d.artifact} className="max-sm:hidden" />
              <span className="min-w-0 flex-1 truncate">{i === 0 && step >= 3 ? rules.guestsPayBizum.text : d.after}</span>
              <DeltaBadge state={approved(i) ? 'approved' : 'pending'} />
            </li>
          ))}
        </ul>
        <aside className="flex min-w-0 flex-col gap-2 text-[11px]">
          <div className="rounded-md border bg-card p-2">
            <div className="mb-1 text-muted-foreground">{t({ en: 'State', es: 'Estado' })}</div>
            <AnimatePresence mode="wait">
              <motion.div key={step >= 5 ? 'a' : 'r'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProposalBadge state={step >= 5 ? 'accepted' : 'in review'} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={cn('rounded-md border p-2', step < 3 ? 'border-bad/40 bg-bad/5' : 'border-ok/40 bg-ok/5')}>
            {step < 3 ? (
              <>
                <div className="flex items-center gap-1 font-medium text-bad">
                  <XCircleIcon className="size-3" /> {conflict.delta} vs {conflict.with.id}
                </div>
                <p className="mt-1 leading-snug text-muted-foreground">
                  {t({ en: 'No limit for guests, but R-07 asks for an account over €500.', es: 'Sin límite para invitados, pero R-07 pide cuenta por encima de 500 €.' })}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-1 font-medium text-ok">
                <CheckCircle2Icon className="size-3" /> {t({ en: 'No conflicts', es: 'Sin conflictos' })}
              </div>
            )}
          </div>
          <div className="rounded-md border bg-card p-2">
            <div className="mb-1 text-muted-foreground">Revisions</div>
            <Rev n={1} text={t({ en: 'Lucía · first draft', es: 'Lucía · primer borrador' })} />
            <AnimatePresence>{step >= 3 && <Rev n={2} text={t({ en: 'Lucía · limit to €500', es: 'Lucía · límite de 500 €' })} fresh />}</AnimatePresence>
          </div>
          <Button size="sm" className="h-7 text-[11px]" disabled={step < 4}>
            {t({ en: 'Accept proposal', es: 'Aceptar proposal' })}
          </Button>
        </aside>
      </AppWindow>
    </div>
  )
}

function Rev({ n, text, fresh }: { n: number; text: string; fresh?: boolean }) {
  return (
    <motion.div initial={fresh ? { opacity: 0, height: 0 } : false} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-1.5 py-0.5">
      <GitCommitHorizontalIcon className="size-3 text-brand" />
      <span className="font-mono">r{n}</span>
      <span className="truncate text-muted-foreground">{text}</span>
    </motion.div>
  )
}
