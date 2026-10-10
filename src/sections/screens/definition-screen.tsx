import { AnimatePresence, motion } from 'motion/react'
import { AppWindow } from '@/components/mock/window'
import { ArtifactTag } from '@/components/mock/status'
import { useStepper } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useT, type Bi } from '@/lib/i18n'
import { useStory } from '@/lib/data'

type Item = { kind: 'rule' | 'lifecycle' | 'parameter'; id: string; current: Bi | null; planned: Bi }

/** What the definition shows, now and once PROP-42 is merged: the story's own words. */
function useItems(): Item[] {
  const { rules, deltas } = useStory()
  const same = (text: string): Bi => ({ en: text, es: text })
  const lifecycle = deltas.find(d => d.id === 'Δ3')!
  return [
    { kind: 'rule', id: 'R-12', current: same(rules.guestsCannotPay.text), planned: same(rules.guestsPayBizum.text) },
    { kind: 'rule', id: 'R-31', current: null, planned: same(rules.invoiceByEmail.text) },
    { kind: 'lifecycle', id: 'Order', current: same(lifecycle.before!), planned: same(lifecycle.after) },
    { kind: 'rule', id: 'R-04', current: same(rules.freeShipping.text), planned: same(rules.freeShipping.text) },
    { kind: 'parameter', id: 'free_shipping', current: { en: '€50 (Spain)', es: '50 € (España)' }, planned: { en: '€40 (Spain)', es: '40 € (España)' } },
  ]
}

/** Flips between the current definition and the planned one, highlighting what changes. */
export function DefinitionScreen() {
  const t = useT()
  const items = useItems()
  const { ref, step } = useStepper(2, { interval: 2800, hold: 1 })
  const planned = step === 1
  return (
    <div ref={ref}>
      <AppWindow crumbs={['acme-shop', t({ en: 'Definition', es: 'Definición' })]} bodyClassName="p-3">
        <div className="mb-3 flex items-center gap-1 rounded-lg bg-muted p-1 text-[11px]">
          {[t({ en: 'Current', es: 'Vigente' }), t({ en: 'Planned', es: 'Prevista' })].map((label, i) => (
            <span key={i} className="relative flex-1 rounded-md py-1 text-center">
              {(i === 1) === planned && <motion.span layoutId="def-tab" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
              <span className="relative">{label}</span>
            </span>
          ))}
        </div>
        <ul className="flex flex-col gap-1.5 text-[11px]">
          {items.map(it => {
            const value = planned ? it.planned : it.current
            const text = value ? t(value) : null
            const changed = it.current?.en !== it.planned.en
            return (
              <li key={it.id} className={cn('flex min-h-9 items-start gap-2 rounded-md border bg-card p-2 transition-colors', planned && changed && 'border-brand/50 bg-brand/5')}>
                <ArtifactTag kind={it.kind} id={it.id} />
                <AnimatePresence mode="wait">
                  <motion.span key={String(planned)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className={cn('leading-snug', !text && 'text-muted-foreground italic')}>
                    {text ?? t({ en: 'not yet', es: 'todavía no' })}
                  </motion.span>
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {planned
            ? t({ en: 'Includes PROP-42 and PROP-45, accepted and waiting for their code.', es: 'Incluye PROP-42 y PROP-45, aceptadas y a la espera de su código.' })
            : t({ en: 'What is merged and running in production today.', es: 'Lo que está merged y funcionando hoy en producción.' })}
        </p>
      </AppWindow>
    </div>
  )
}
