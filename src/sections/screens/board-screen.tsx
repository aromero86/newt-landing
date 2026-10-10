import { motion, AnimatePresence } from 'motion/react'
import { BugIcon, FileTextIcon, FilterIcon } from 'lucide-react'
import { AppWindow } from '@/components/mock/window'
import { DimensionChip } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { FakeCursor } from '@/lib/typing'
import { useStepper } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useT, type Bi } from '@/lib/i18n'

type Surface = 'web' | 'mobile' | 'backoffice'
type Item = { id: string; title: Bi; col: number; bug?: boolean; surface: Surface; who?: string }

const items: Item[] = [
  { id: 'PROP-51', title: { en: 'Loyalty points', es: 'Puntos de fidelidad' }, col: 0, surface: 'web' },
  { id: 'BUG-80', title: { en: 'Coupon field hidden on Android', es: 'Campo de cupón oculto en Android' }, col: 0, bug: true, surface: 'mobile' },
  { id: 'PROP-42', title: { en: 'Guests pay with Bizum', es: 'Invitados pagan con Bizum' }, col: 1, surface: 'mobile', who: 'Marc' },
  { id: 'PROP-45', title: { en: 'Shipping rules for Mexico', es: 'Reglas de envío para México' }, col: 1, surface: 'web', who: 'Ana' },
  { id: 'BUG-77', title: { en: 'Crash on Bizum timeout (iOS)', es: 'Cierre al caducar Bizum (iOS)' }, col: 1, bug: true, surface: 'mobile', who: 'Marc' },
  { id: 'PROP-39', title: { en: 'Refund approvals', es: 'Aprobación de reembolsos' }, col: 2, surface: 'backoffice', who: 'Ana' },
  { id: 'PROP-40', title: { en: 'Order history for guests', es: 'Historial de pedidos para invitados' }, col: 2, surface: 'mobile', who: 'Marc' },
  { id: 'PROP-36', title: { en: 'Saved addresses', es: 'Direcciones guardadas' }, col: 3, surface: 'web' },
]
const cols: Bi[] = [
  { en: 'Product', es: 'Producto' },
  { en: 'To do', es: 'Por hacer' },
  { en: 'In progress', es: 'En curso' },
  { en: 'Done', es: 'Hecho' },
]

/** The board, filtering itself down to the mobile app and back. */
export function BoardScreen() {
  const t = useT()
  const { ref, step } = useStepper(3, { interval: 2200, hold: 1.4 })
  const filtered = step >= 1
  const visible = items.filter(i => !filtered || i.surface === 'mobile')
  return (
    <div ref={ref}>
      <AppWindow crumbs={['acme-shop', 'Board']} bodyClassName="p-3">
        <FakeCursor x={filtered ? 13 : 32} y={filtered ? 30 : 60} click={step === 1} visible={step < 2} />
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <DimensionChip name={t({ en: 'surface', es: 'superficie' })} value={t({ en: 'Mobile app', es: 'App móvil' })} active={filtered} />
          <DimensionChip name={t({ en: 'market', es: 'mercado' })} value={t({ en: 'Any', es: 'Cualquiera' })} />
          <DimensionChip name={t({ en: 'type', es: 'tipo' })} value={t({ en: 'Proposals & bugs', es: 'Proposals y bugs' })} />
          <span className="ml-auto text-[11px] text-muted-foreground">{t({ en: `${visible.length} items`, es: `${visible.length} elementos` })}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {cols.map((c, ci) => (
            <div key={c.en} className="min-h-[190px] rounded-lg bg-subtle p-1.5">
              <div className="mb-1.5 px-1 text-[11px] font-medium text-muted-foreground">{t(c)}</div>
              <div className="flex flex-col gap-1.5">
                <AnimatePresence mode="popLayout">
                  {visible
                    .filter(i => i.col === ci)
                    .map(i => (
                      <motion.div
                        key={i.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        className={cn('rounded-md border bg-card p-1.5 text-[10px]', i.bug && 'border-bad/30')}
                      >
                        <div className="flex items-center gap-1 font-mono text-muted-foreground">
                          {i.bug ? <BugIcon className="size-2.5 text-bad" /> : <FileTextIcon className="size-2.5 text-brand" />}
                          {i.id}
                          {i.who && <Avatar name={i.who} className="ml-auto size-3.5 text-[7px]" />}
                        </div>
                        <div className="mt-0.5 leading-snug">{t(i.title)}</div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </AppWindow>
    </div>
  )
}
