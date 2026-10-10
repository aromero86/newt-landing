import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { fadeUp } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('relative scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28', className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, children, center }: { eyebrow: string; title: ReactNode; children?: ReactNode; center?: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className={cn('mb-12 max-w-3xl', center && 'mx-auto text-center')}
    >
      <p className="mb-3 font-mono text-xs font-medium tracking-widest text-brand uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-lg text-pretty text-muted-foreground">{children}</p>}
    </motion.div>
  )
}

/** Fades content in the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, id }: { children: ReactNode; className?: string; delay?: number; id?: string }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
