import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRightIcon, CheckCircle2Icon, GitMergeIcon, LinkIcon, TagIcon, XCircleIcon, EyeIcon } from 'lucide-react'
import { AppWindow, GitHubWindow } from '@/components/mock/window'
import { ChatPanel, ChatMessage, ToolCall } from '@/components/mock/chat'
import { ArtifactTag, CheckLine, DeltaBadge, ProposalBadge } from '@/components/mock/status'
import { Avatar } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Typing } from '@/lib/typing'
import { cn } from '@/lib/utils'
import { useStory, type Delta, type DeltaState } from '@/lib/data'
import { useT } from '@/lib/i18n'
import { useSequence } from './sequence'

export function Stage({ step }: { step: number }) {
  const stages = [Talk, Document, Deltas, Gate, Iterate, Accepted, PullRequest, Merged, Release]
  const Current = stages[step] ?? Talk
  return <Current />
}

/** The tabs of a proposal page. Labels come translated; `active` is matched by key. */
function useProposalTabs() {
  const t = useT()
  const labels = {
    document: t({ en: 'Document', es: 'Documento' }),
    deltas: 'Deltas',
    checks: t({ en: 'Checks', es: 'Comprobaciones' }),
    revisions: 'Revisions',
  }
  const tabs = (counts: { deltas?: number; conflicts?: number } = {}) => [
    { label: labels.document },
    { label: labels.deltas, count: counts.deltas },
    { label: labels.checks, count: counts.conflicts },
    { label: labels.revisions },
  ]
  return { tabs, labels }
}

const crumbsFor = (proposalId: string) => ['acme-shop', 'Proposals', proposalId]

function Show({ when, children, className }: { when: boolean; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {when && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className={className}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* 1 — Talk to Claude */
function Talk() {
  const t = useT()
  const { proposal, rules } = useStory()
  const at = useSequence([1800, 2500, 3600, 5200, 6300])
  return (
    <ChatPanel className="h-full">
      <ChatMessage from={proposal.author}>
        <Typing text={proposal.ask} active />
      </ChatMessage>
      <Show when={at >= 1}>
        <ToolCall name="search">
          “{t({ en: 'guests pay', es: 'invitados pagan' })}” → <span className="text-foreground">R-12, R-07</span>
        </ToolCall>
      </Show>
      <Show when={at >= 2}>
        <ChatMessage from="claude">
          {t({ en: 'Heads up: today ', es: 'Ojo: hoy ' })}<b>{rules.guestsCannotPay.id}</b>
          {t({ en: ' says ', es: ' dice ' })}“{rules.guestsCannotPay.text}”{t({ en: ' and ', es: ' y ' })}
          <b>{rules.accountOver500.id}</b>
          {t({
            en: ' requires an account over €500. Should guests pay with Bizum only? Up to what amount? And where does their invoice go?',
            es: ' exige cuenta por encima de 500 €. ¿Los invitados pagan solo con Bizum? ¿Hasta qué importe? ¿Y adónde va su factura?',
          })}
        </ChatMessage>
      </Show>
      <Show when={at >= 3}>
        <ChatMessage from={proposal.author}>
          {t({ en: 'Bizum only, up to €500. Invoice to the email they give us.', es: 'Solo Bizum, hasta 500 €. La factura, al email que nos den.' })}
        </ChatMessage>
      </Show>
      <Show when={at >= 4}>
        <ToolCall name="proposals.create">→ <span className="text-foreground">{proposal.id}</span></ToolCall>
      </Show>
      <Show when={at >= 5}>
        <ChatMessage from="claude">
          {t({ en: 'Done: ', es: 'Hecho: ' })}<b>{proposal.id}</b>
          {t({ en: ' is ready for review. ', es: ' está lista para revisar. ' })}
          <span className="text-brand underline underline-offset-2">{t({ en: 'Open it in newt', es: 'Ábrela en newt' })}</span>
        </ChatMessage>
      </Show>
    </ChatPanel>
  )
}

/* 2 — The document */
function Document() {
  const t = useT()
  const { proposal } = useStory()
  const { tabs, labels } = useProposalTabs()
  const at = useSequence([500, 1100, 1700])
  return (
    <AppWindow crumbs={crumbsFor(proposal.id)} tabs={tabs()} active={labels.document} className="h-full" bodyClassName="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold">{proposal.title}</h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar name={proposal.author} className="size-5" /> {proposal.author} {t({ en: 'with Claude', es: 'con Claude' })} · {proposal.feature}
          </div>
        </div>
        <ProposalBadge state="draft" />
      </div>
      <div className="mt-5 space-y-4 text-sm leading-relaxed">
        <Block title={t({ en: 'Context', es: 'Contexto' })} visible={at >= 1}>{proposal.document[0]} {proposal.document[1]}</Block>
        <Block title={t({ en: 'Decision', es: 'Decisión' })} visible={at >= 2}>
          <Typing text={proposal.document[2]!} active={at >= 2} speed={18} />
        </Block>
        <Block title={t({ en: 'Open questions', es: 'Preguntas abiertas' })} visible={at >= 3}>
          {t({ en: 'None left: Claude asked about amount and invoices.', es: 'Ninguna: Claude preguntó por el importe y las facturas.' })}
        </Block>
      </div>
      <div className="absolute right-5 bottom-4 left-5 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>{t({ en: 'Revision 1', es: 'Revision 1' })}</span>
        <span className="font-mono">{t({ en: 'the document is the single source', es: 'el documento es la única fuente' })}</span>
      </div>
    </AppWindow>
  )
}

function Block({ title, visible, children }: { title: string; visible: boolean; children: ReactNode }) {
  return (
    <motion.div animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }} transition={{ duration: 0.4 }}>
      <div className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</div>
      <p>{children}</p>
    </motion.div>
  )
}

/* 3 — Deltas extracted */
function Deltas() {
  const t = useT()
  const { deltas, proposal } = useStory()
  const { tabs, labels } = useProposalTabs()
  const at = useSequence([400, 800, 1200, 1600, 2000])
  return (
    <AppWindow crumbs={crumbsFor(proposal.id)} tabs={tabs({ deltas: at })} active={labels.deltas} className="h-full" bodyClassName="p-4">
      <p className="mb-3 text-xs text-muted-foreground">
        {t({ en: 'Extracted from the document · revision 1', es: 'Extraídos del documento · revision 1' })}
      </p>
      <ul className="flex flex-col gap-2">
        {deltas.map((d, i) => (
          <Show key={d.id} when={at > i}>
            <DeltaRow delta={d} state="pending" />
          </Show>
        ))}
      </ul>
    </AppWindow>
  )
}

/** How each kind of delta is named. In Spanish it agrees with "delta": nuevo, cambiado, retirado. */
const OP_LABEL: Record<Delta['op'], { en: string; es: string }> = {
  new: { en: 'new', es: 'nuevo' },
  changed: { en: 'changed', es: 'cambiado' },
  retired: { en: 'retired', es: 'retirado' },
}

function DeltaRow({ delta: d, state, note, viewed, highlight }: { delta: Delta; state: DeltaState; note?: ReactNode; viewed?: boolean; highlight?: 'bad' | 'warn' }) {
  const t = useT()
  return (
    <li
      className={cn(
        'rounded-lg border bg-card p-2.5 text-xs transition-colors',
        highlight === 'bad' && 'border-bad/50 bg-bad/5',
        highlight === 'warn' && 'border-warn/50 bg-warn/5',
      )}
    >
      <div className="flex items-center gap-2">
        {viewed !== undefined && <Checkbox checked={viewed} aria-label={t({ en: `Viewed ${d.id}`, es: `${d.id} visto` })} className="pointer-events-none" />}
        <span className="font-mono text-muted-foreground">{d.id}</span>
        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', d.op === 'new' ? 'bg-ok/15 text-ok' : 'bg-info/15 text-info')}>
          {t(OP_LABEL[d.op])}
        </span>
        <ArtifactTag kind={d.kind} id={d.artifact} />
        <span className="ml-auto">
          <DeltaBadge state={state} />
        </span>
      </div>
      <div className="mt-1.5 pl-1 leading-relaxed">
        {d.before && <span className="mr-1.5 text-muted-foreground line-through">{d.before}</span>}
        <span>{d.after}</span>
      </div>
      {note && <div className="mt-1.5 pl-1 text-[11px]">{note}</div>}
    </li>
  )
}

/* 4 — The gate */
function Gate() {
  const t = useT()
  const { conflict, proposal } = useStory()
  const { tabs, labels } = useProposalTabs()
  const at = useSequence([2200, 2900])
  return (
    <AppWindow crumbs={crumbsFor(proposal.id)} tabs={tabs({ deltas: 5, conflicts: at >= 1 ? 1 : undefined })} active={labels.checks} className="h-full" bodyClassName="p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{t({ en: 'Checking against the planned definition', es: 'Comprobando contra la definición prevista' })}</span>
        <Counter to={1284} running={at < 1} />
      </div>
      <div className="mt-3 grid grid-cols-[repeat(32,minmax(0,1fr))] gap-[3px]" aria-hidden>
        {Array.from({ length: 160 }, (_, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-[2px]"
            initial={{ backgroundColor: 'var(--muted)' }}
            animate={{ backgroundColor: i === 77 ? 'var(--bad)' : [77 - 1, 77 + 1, 77 + 32, 77 - 32].includes(i) ? 'var(--warn)' : 'var(--ok)' }}
            transition={{ delay: (i % 32) * 0.035 + Math.floor(i / 32) * 0.25, duration: 0.3 }}
            style={{ opacity: i === 77 ? 1 : 0.55 }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-ok/60" /> {t({ en: 'consistent', es: 'coherente' })}</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-warn" /> {t({ en: 'overlapping scope, looked at closely', es: 'alcance solapado, revisado de cerca' })}</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-bad" /> {t({ en: 'conflict', es: 'conflicto' })}</span>
      </div>
      <Show when={at >= 1} className="mt-4 space-y-2">
        <div className="rounded-lg border border-bad/40 bg-bad/5 p-3 text-xs leading-relaxed">
          <div className="mb-1 flex items-center gap-2 font-medium text-bad">
            <XCircleIcon className="size-3.5" /> {t({ en: 'Conflict', es: 'Conflicto' })} · {conflict.delta} vs rule {conflict.with.id}
          </div>
          {conflict.explanation}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md border bg-card px-2 py-0.5">{t({ en: 'Change the proposal', es: 'Cambiar la proposal' })}</span>
            <span className="rounded-md border bg-card px-2 py-0.5 text-muted-foreground">
              {t({ en: 'Not a conflict (give a reason)', es: 'No es conflicto (con motivo)' })}
            </span>
          </div>
        </div>
        <Show when={at >= 2}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-bad" /> {t({ en: 'Cannot be accepted: 1 open conflict', es: 'No se puede aceptar: 1 conflicto abierto' })}
          </div>
        </Show>
      </Show>
    </AppWindow>
  )
}

function Counter({ to, running }: { to: number; running: boolean }) {
  const t = useT()
  const [n, setN] = useState(running ? 0 : to)
  useEffect(() => {
    if (!running) {
      setN(to)
      return
    }
    const start = performance.now()
    let id = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 2000)
      setN(Math.round(to * progress))
      if (progress < 1) id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [running, to])
  return (
    <span className="font-mono text-xs whitespace-nowrap tabular-nums">
      {n.toLocaleString(t({ en: 'en', es: 'es' }))} artifacts
    </span>
  )
}

/* 5 — Iterate */
function Iterate() {
  const t = useT()
  const { deltas, proposal, rules } = useStory()
  const { tabs, labels } = useProposalTabs()
  const at = useSequence([900, 2200, 3400, 4300])
  const changed = { ...deltas[0]!, after: rules.guestsPayBizum.text }
  return (
    <AppWindow crumbs={crumbsFor(proposal.id)} tabs={tabs({ deltas: 5 })} active={labels.deltas} className="h-full" bodyClassName="p-4">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-mono">
          <span className="text-muted-foreground">revision 1 →</span> revision 2
        </span>
        <span className="rounded-md bg-ok/10 px-2 py-0.5 font-mono text-ok">+ “{t({ en: 'up to €500', es: 'hasta 500 €' })}”</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        <DeltaRow
          delta={changed}
          viewed={at >= 2}
          state={at >= 2 ? 'approved' : 'pending'}
          highlight={at >= 2 ? undefined : 'warn'}
          note={at < 2 && <span className="text-warn">
              {t({ en: 'Changed since you approved it · conflict with R-07 resolved', es: 'Ha cambiado desde que lo aprobaste · conflicto con R-07 resuelto' })}
            </span>}
        />
        {[deltas[1]!, deltas[2]!].map(d => (
          <DeltaRow
            key={d.id}
            delta={d}
            viewed
            state="approved"
            note={
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: at >= 1 ? 1 : 0 }} className="flex items-center gap-1 text-muted-foreground">
                <EyeIcon className="size-3" /> {t({ en: 'Unchanged since you approved it', es: 'Sin cambios desde que lo aprobaste' })}
              </motion.span>
            }
          />
        ))}
        <DeltaRow delta={deltas[3]!} viewed={at >= 3} state={at >= 3 ? 'approved' : 'pending'} highlight={at >= 3 ? undefined : 'warn'} />
      </ul>
      <Show when={at >= 4} className="mt-2">
        <div className="flex items-center gap-2 rounded-lg border border-ok/40 bg-ok/8 px-3 py-2 text-xs text-ok">
          <CheckCircle2Icon className="size-4" />{' '}
          {t({ en: '5 of 5 deltas approved · gate passed · 0 conflicts', es: '5 de 5 deltas aprobados · puerta superada · 0 conflictos' })}
        </div>
      </Show>
    </AppWindow>
  )
}

/* 6 — Accepted */
function Accepted() {
  const t = useT()
  const { proposal } = useStory()
  const at = useSequence([900, 2000])
  const cols = [
    { key: 'product', label: t({ en: 'Product', es: 'Producto' }) },
    { key: 'todo', label: t({ en: 'To do', es: 'Por hacer' }) },
    { key: 'doing', label: t({ en: 'In progress', es: 'En curso' }) },
  ]
  const tabs = [
    { label: 'Board' },
    { label: t({ en: 'Current definition', es: 'Definición vigente' }) },
    { label: t({ en: 'Planned definition', es: 'Definición prevista' }) },
  ]
  return (
    <AppWindow crumbs={['acme-shop', 'Board']} tabs={tabs} active="Board" className="h-full" bodyClassName="p-4">
      <div className="mb-4 flex items-center gap-3 rounded-lg border bg-card p-3 text-sm">
        <span className="font-mono text-muted-foreground">{proposal.id}</span>
        <span className="truncate font-medium">{proposal.title}</span>
        <span className="ml-auto">
          <AnimatePresence mode="wait">
            <motion.span key={at >= 1 ? 'a' : 'r'} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <ProposalBadge state={at >= 1 ? 'accepted' : 'in review'} />
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        {cols.map(({ key: col, label }) => (
          <div key={col} className="min-h-[200px] rounded-lg bg-subtle p-2">
            <div className="mb-2 px-1 font-medium text-muted-foreground">{label}</div>
            <div className="flex flex-col gap-2">
              {col === 'product' && at < 1 && <BoardCard layoutId="p42" />}
              {col === 'todo' && at >= 1 && <BoardCard layoutId="p42" assignee={at >= 2} />}
              {col === 'todo' && <MiniCard text={t({ en: 'Shipping rules for Mexico', es: 'Reglas de envío para México' })} />}
              {col === 'doing' && <MiniCard text={t({ en: 'Order history for guests', es: 'Historial de pedidos para invitados' })} />}
              {col === 'product' && <MiniCard text={t({ en: 'Loyalty points', es: 'Puntos de fidelidad' })} />}
            </div>
          </div>
        ))}
      </div>
      <Show when={at >= 2} className="mt-3">
        <div className="rounded-lg border bg-card px-3 py-2 text-xs">
          <span className="text-muted-foreground">{t({ en: 'Planned definition:', es: 'Definición prevista:' })}</span>{' '}
          {t({
            en: '1 rule changed, 1 rule added, Order lifecycle +1 state, 1 new parameter',
            es: '1 rule cambiada, 1 rule nueva, lifecycle Order +1 estado, 1 parameter nuevo',
          })}
        </div>
      </Show>
    </AppWindow>
  )
}

function BoardCard({ layoutId, assignee }: { layoutId: string; assignee?: boolean }) {
  const t = useT()
  const { proposal } = useStory()
  return (
    <motion.div layoutId={layoutId} transition={{ type: 'spring', stiffness: 160, damping: 22 }} className="rounded-md border border-brand/50 bg-card p-2 shadow-sm">
      <div className="font-mono text-[10px] text-muted-foreground">{proposal.id}</div>
      <div className="mt-0.5 leading-snug">{t({ en: 'Guests pay with Bizum', es: 'Invitados pagan con Bizum' })}</div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="rounded bg-brand/15 px-1 text-[10px] text-brand">{t({ en: 'surface: Mobile app', es: 'superficie: App móvil' })}</span>
        {assignee && <Avatar name="Marc" className="size-4 text-[8px]" />}
      </div>
    </motion.div>
  )
}

function MiniCard({ text }: { text: string }) {
  return <div className="rounded-md border bg-card p-2 text-muted-foreground">{text}</div>
}

/* 7 — Pull request */
function PullRequest() {
  const t = useT()
  const { pr, proposal } = useStory()
  const at = useSequence([700, 1700])
  const lines = [
    { n: 40, text: "export function canPay(user: User, method: Method, amount: number) {" },
    { n: 41, text: "  if (user.isGuest && method !== 'bizum') return false" },
    { n: 42, text: "  if (method === 'bizum') return true", bad: true },
    { n: 43, text: '  return amount <= 500 || user.hasAccount' },
  ]
  return (
    <GitHubWindow number={pr.number} title={pr.title} state="blocked" active="Files changed" className="h-full" bodyClassName="p-4">
      <div className="flex items-center gap-2 rounded-md border bg-subtle px-3 py-2 text-xs">
        <LinkIcon className="size-3.5 text-brand" /> {t({ en: 'Implements', es: 'Implementa' })} <b>{proposal.id}</b>
        <ProposalBadge state="accepted" className="ml-1" />
      </div>
      <div className="mt-3 overflow-hidden rounded-md border font-mono text-[11px]">
        <div className="border-b bg-muted/50 px-3 py-1.5 text-muted-foreground">{pr.file}</div>
        {lines.map(l => (
          <div key={l.n}>
            <div className={cn('flex gap-3 px-3 py-0.5', l.bad ? 'bg-bad/10' : 'bg-ok/5')}>
              <span className="w-6 text-right text-muted-foreground">{l.n}</span>
              <span className="text-ok">+</span>
              <span className="whitespace-pre">{l.text}</span>
            </div>
            {l.bad && (
              <Show when={at >= 1}>
                <div className="border-y border-bad/40 bg-card px-3 py-2 font-sans text-xs leading-relaxed">
                  <div className="flex items-center gap-1.5 font-medium text-bad">
                    <XCircleIcon className="size-3.5" /> newt · rule R-07
                  </div>
                  {t({
                    en: `“Payments over €500 require a registered account.” This line lets Bizum skip the limit accepted in ${proposal.id} (Δ1: up to €500).`,
                    es: `«Los pagos de más de 500 € requieren una cuenta registrada.» Esta línea deja que Bizum se salte el límite aceptado en ${proposal.id} (Δ1: hasta 500 €).`,
                  })}
                </div>
              </Show>
            )}
          </div>
        ))}
      </div>
      <Show when={at >= 2} className="mt-3 rounded-md border p-3">
        <div className="mb-2 text-xs font-medium">
          newt / product definition — {t({ en: '2 pass, 1 failing, 1 warning', es: '2 se cumplen, 1 falla, 1 aviso' })}
        </div>
        <div className="space-y-1">
          <CheckLine result="fail"><b>R-07</b> {t({ en: '€500 limit', es: 'límite de 500 €' })} · payment.ts:42</CheckLine>
          <CheckLine result="warn"><b>Order</b> {t({ en: '“awaiting Bizum” has no test', es: '«esperando Bizum» no tiene test' })}</CheckLine>
        </div>
      </Show>
    </GitHubWindow>
  )
}

/* 8 — Merged */
function Merged() {
  const t = useT()
  const { pr, proposal, rules } = useStory()
  const at = useSequence([800, 1800, 2700])
  return (
    <GitHubWindow number={pr.number} title={pr.title} state={at >= 1 ? 'merged' : 'open'} className="h-full" bodyClassName="p-4">
      <ul className="space-y-3 text-xs">
        <Event icon={<CheckCircle2Icon className="size-3.5 text-ok" />}>
          <b>newt / product definition</b> — {t({ en: 'all checks passed (4 artifacts, 4 tests)', es: 'todo en verde (4 artifacts, 4 tests)' })}
        </Event>
        <Show when={at >= 1}>
          <Event icon={<GitMergeIcon className="size-3.5 text-[#a371f7]" />}>
            <b>marc</b> merged commit <span className="font-mono">a91f3c2</span> into main
          </Event>
        </Show>
        <Show when={at >= 2}>
          <Event icon={<span className="size-3.5 rounded-sm bg-brand" />}>
            <b>newt</b> {t({ en: 'marked', es: 'marcó' })} <b>{proposal.id}</b> {t({ en: 'as', es: 'como' })}{' '}
            <ProposalBadge state="merged" className="ml-1" />
          </Event>
        </Show>
      </ul>
      <Show when={at >= 3} className="mt-5 rounded-lg border bg-subtle p-3">
        <div className="mb-2 text-xs font-medium">{t({ en: 'Current definition', es: 'Definición vigente' })} · acme-shop</div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2">
            <ArtifactTag kind="rule" id="R-12" />
            <span>
              <span className="mr-1 text-muted-foreground line-through">{rules.guestsCannotPay.text}</span>
              {rules.guestsPayBizum.text}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ArtifactTag kind="rule" id="R-31" />
            <span>{rules.invoiceByEmail.text}</span>
          </div>
          <div className="flex items-start gap-2">
            <ArtifactTag kind="lifecycle" id="Order" />
            <span>{t({ en: 'created → awaiting Bizum → paid → shipped', es: 'creado → esperando Bizum → pagado → enviado' })}</span>
          </div>
        </div>
      </Show>
    </GitHubWindow>
  )
}

function Event({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex size-6 items-center justify-center rounded-full border bg-card">{icon}</span>
      <span className="flex flex-wrap items-center gap-1">{children}</span>
    </li>
  )
}

/* 9 — Release */
function Release() {
  const t = useT()
  const { releases, rules } = useStory()
  const at = useSequence([700, 1500])
  const v = releases[1]!
  return (
    <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border bg-card p-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TagIcon className="size-3.5" /> github.com/acme/shop · Releases
        </div>
        <div className="mt-2 text-lg font-semibold">{v.version}</div>
        <div className="text-xs text-muted-foreground">Released {v.githubDate} · 14 pull requests</div>
        <div className="mt-3 space-y-1 font-mono text-[11px] text-muted-foreground">
          <div>#318 feat(checkout): Bizum for guests</div>
          <div>#321 fix(invoice): guest email</div>
          <div>#322 chore: deps</div>
        </div>
      </motion.div>
      <motion.div
        aria-hidden
        className="hidden items-center text-brand sm:flex"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: at >= 1 ? 1 : 0, scale: at >= 1 ? 1 : 0.6 }}
      >
        <ArrowRightIcon className="size-6" />
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: at >= 1 ? 1 : 0.3, x: 0 }} className="rounded-xl border border-brand/40 bg-card p-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>newt · acme-shop · Releases</span>
          <span className="font-mono text-brand">{v.version}</span>
        </div>
        <div className="mt-2 text-sm font-semibold">{t({ en: 'What changed in the product', es: 'Qué cambió en el producto' })}</div>
        <Show when={at >= 2} className="mt-3 space-y-2 text-xs">
          <div>
            <div className="mb-1 font-semibold text-ok">{t({ en: 'New', es: 'Nuevo' })}</div>
            <div>{rules.invoiceByEmail.text}</div>
          </div>
          <div>
            <div className="mb-1 font-semibold text-info">{t({ en: 'Changed', es: 'Cambiado' })}</div>
            <div>
              <span className="text-muted-foreground line-through">{rules.guestsCannotPay.text}</span>{' '}
              {t({ en: 'Guests can pay with Bizum, up to €500, in the app.', es: 'Los invitados pueden pagar con Bizum, hasta 500 €, en la app.' })}
            </div>
            <div className="mt-1 text-muted-foreground italic">
              {t({ en: 'Why: guests abandon checkout when asked to sign up.', es: 'Por qué: los invitados abandonan el checkout cuando les pedimos registrarse.' })}
            </div>
          </div>
        </Show>
      </motion.div>
    </div>
  )
}
