import { Section, SectionHeading } from '@/components/site/section'
import { Reveal } from '@/components/site/section'
import { CurrentVsPlanned } from './current-vs-planned'
import { Gate } from './gate'
import { ViewedDeltas } from './viewed-deltas'
import { Bootstrap } from './bootstrap'
import { Versions } from './versions'
import { BugsVsProposals } from './bugs-vs-proposals'
import { useT } from '@/lib/i18n'

/** The key ideas of newt, one animated infographic each, in a bento grid. */
export default function Infographics() {
  const t = useT()
  return (
    <Section id="infographics">
      <SectionHeading
        eyebrow={t({ en: 'The ideas', es: 'Las ideas' })}
        title={t({
          en: <>Six ideas behind <span className="text-gradient">newt</span></>,
          es: <>Seis ideas detrás de <span className="text-gradient">newt</span></>,
        })}
      >
        {t({
          en: 'Each one plays on its own while it is on screen. Tap the dots to step through.',
          es: 'Cada una se reproduce sola mientras está en pantalla. Toca los puntos para ir paso a paso.',
        })}
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Reveal className="flex min-w-0 md:col-span-2 lg:col-span-2">
          <CurrentVsPlanned className="w-full" />
        </Reveal>
        <Reveal className="flex min-w-0 md:col-span-2 lg:col-span-4" delay={0.05}>
          <Gate className="w-full" />
        </Reveal>
        <Reveal className="flex min-w-0 lg:col-span-3">
          <ViewedDeltas className="w-full" />
        </Reveal>
        <Reveal className="flex min-w-0 lg:col-span-3" delay={0.05}>
          <Bootstrap className="w-full" />
        </Reveal>
        <Reveal className="flex min-w-0 lg:col-span-3">
          <Versions className="w-full" />
        </Reveal>
        <Reveal className="flex min-w-0 lg:col-span-3" delay={0.05}>
          <BugsVsProposals className="w-full" />
        </Reveal>
      </div>
    </Section>
  )
}
