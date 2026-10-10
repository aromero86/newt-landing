import { Section, SectionHeading } from './section'

/** Placeholder while a section is being built. Remove once the section exists. */
export function SectionStub({ id, name }: { id: string; name: string }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow="Coming soon" title={name} />
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">Section in progress</div>
    </Section>
  )
}
