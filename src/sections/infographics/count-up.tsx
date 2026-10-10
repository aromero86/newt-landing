import { useEffect, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import { useLang } from '@/lib/i18n'

/** A number that counts up from 0 when `run` turns on. Static with reduced motion. */
export function CountUp({ to, run, duration = 1.4 }: { to: number; run: boolean; duration?: number }) {
  const reduced = useReducedMotion()
  const { lang } = useLang()
  const [value, setValue] = useState(reduced && run ? to : 0)

  useEffect(() => {
    if (!run) {
      setValue(0)
      return
    }
    if (reduced) {
      setValue(to)
      return
    }
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: v => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [run, to, duration, reduced])

  return <span className="tabular-nums">{value.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}</span>
}
