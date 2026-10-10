import { cn } from '@/lib/utils'

const tones = ['bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500']

/** A lettered avatar: no images, deterministic colour per name. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const tone = tones[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % tones.length]
  return (
    <span
      aria-hidden
      className={cn('inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white', tone, className)}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}
