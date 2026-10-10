import type { ReactNode } from 'react'
import { CheckCircle2Icon, CircleDashedIcon, CircleDotIcon, GitMergeIcon, XCircleIcon, AlertTriangleIcon, BanIcon, BugIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ArtifactKind, BugState, DeltaState, ProposalState } from '@/lib/data'

const proposalLook: Record<ProposalState, string> = {
  draft: 'bg-muted text-muted-foreground border-transparent',
  'in review': 'bg-warn/12 text-warn border-warn/30',
  accepted: 'bg-ok/12 text-ok border-ok/30',
  merged: 'bg-[#8250df]/15 text-[#a371f7] border-[#8250df]/30',
  discarded: 'bg-muted text-muted-foreground border-transparent line-through',
}

/** A proposal's state, as a pill. */
export function ProposalBadge({ state, className }: { state: ProposalState; className?: string }) {
  const Icon = state === 'merged' ? GitMergeIcon : state === 'accepted' ? CheckCircle2Icon : state === 'discarded' ? BanIcon : CircleDotIcon
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', proposalLook[state], className)}>
      <Icon className="size-3" /> {state}
    </span>
  )
}

/** A delta's approval state. */
export function DeltaBadge({ state }: { state: DeltaState }) {
  const look = {
    pending: 'text-warn',
    approved: 'text-ok',
    rejected: 'text-bad',
  }[state]
  const Icon = state === 'approved' ? CheckCircle2Icon : state === 'rejected' ? XCircleIcon : CircleDashedIcon
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium', look)}>
      <Icon className="size-3.5" /> {state}
    </span>
  )
}

/** A bug's state. */
export function BugBadge({ state }: { state: BugState }) {
  const look = {
    reported: 'bg-warn/12 text-warn border-warn/30',
    confirmed: 'bg-bad/12 text-bad border-bad/30',
    resolved: 'bg-ok/12 text-ok border-ok/30',
    dismissed: 'bg-muted text-muted-foreground border-transparent',
  }[state]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', look)}>
      <BugIcon className="size-3" /> {state}
    </span>
  )
}

const kindLook: Record<ArtifactKind, string> = {
  rule: 'text-brand',
  entity: 'text-info',
  lifecycle: 'text-[#a371f7]',
  actor: 'text-warn',
  parameter: 'text-brand-2',
  feature: 'text-foreground',
}

/** An artifact reference: its kind and id, e.g. `rule R-12`. */
export function ArtifactTag({ kind, id, className }: { kind: ArtifactKind; id?: string; className?: string }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-md border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap', className)}>
      <span className={kindLook[kind]}>{kind}</span>
      {id && <span className="text-muted-foreground">{id}</span>}
    </span>
  )
}

/** A dimension value, e.g. `surface: Mobile app`. */
export function DimensionChip({ name, value, active }: { name: string; value: string; active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors',
        active ? 'border-brand/50 bg-brand/15 text-foreground' : 'bg-background/60 text-muted-foreground',
      )}
    >
      <span className="opacity-60">{name}:</span> {value}
    </span>
  )
}

/** One line of a newt check report: ✔ ✖ ⚠ plus what it is about. */
export function CheckLine({ result, children }: { result: 'pass' | 'fail' | 'warn'; children: ReactNode }) {
  const Icon = result === 'pass' ? CheckCircle2Icon : result === 'fail' ? XCircleIcon : AlertTriangleIcon
  const look = { pass: 'text-ok', fail: 'text-bad', warn: 'text-warn' }[result]
  return (
    <div className="flex items-start gap-2 text-xs leading-relaxed">
      <Icon className={cn('mt-0.5 size-3.5 shrink-0', look)} />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
