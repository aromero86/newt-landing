import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Shows its content, fading in, once `when` is true. */
export function Appear({ when, children, className, delay = 0 }: { when: boolean; children: ReactNode; className?: string; delay?: number }) {
  return (
    <AnimatePresence initial={false}>
      {when && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** A card-like panel inside a scene. */
export function Panel({ title, icon, aside, children, className }: { title: string; icon?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/10', className)}>
      <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium">
        {icon}
        <span className="truncate">{title}</span>
        {aside && <span className="ml-auto shrink-0">{aside}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/** A number that counts from `from` to `to` when it changes. */
export function Counter({ value, className }: { value: number; className?: string }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (reduced || shown === value) {
      setShown(value)
      return
    }
    const id = setTimeout(() => setShown(s => s + Math.sign(value - s)), 90)
    return () => clearTimeout(id)
  }, [value, shown, reduced])

  return (
    <motion.span key={shown} initial={{ y: -4, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className={cn('tabular-nums', className)}>
      {shown}
    </motion.span>
  )
}

/** A few lines of code, with optional line marks for diffs and annotations. */
export function Code({ lines, className }: { lines: { n: number; text: string; mark?: 'add' | 'del' | 'hit' }[]; className?: string }) {
  return (
    <pre className={cn('overflow-x-auto rounded-lg border bg-subtle py-2 font-mono text-[11px] leading-relaxed', className)}>
      {lines.map(l => (
        <div
          key={`${l.n}-${l.text}`}
          className={cn(
            'flex gap-3 px-3',
            l.mark === 'add' && 'bg-ok/12',
            l.mark === 'del' && 'bg-bad/12 line-through decoration-bad/50',
            l.mark === 'hit' && 'bg-bad/12',
          )}
        >
          <span className="w-5 shrink-0 text-right text-muted-foreground/60 select-none">{l.n}</span>
          <span className="whitespace-pre">{l.text}</span>
        </div>
      ))}
    </pre>
  )
}

/** A tiny caption above a group inside a scene. */
export function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">{children}</p>
}
