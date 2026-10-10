import { useEffect, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { BugIcon, GitBranchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStepper } from '@/lib/motion'
import { Typing, FakeCursor } from '@/lib/typing'
import { useT } from '@/lib/i18n'
import { useStory } from '@/lib/data'
import { GitHubWindow } from '@/components/mock/window'
import { ArtifactTag, BugBadge, CheckLine, ProposalBadge } from '@/components/mock/status'
import { Badge } from '@/components/ui/badge'
import { annotatedLine, behaviorPr, blockedPr, firstDiff, fixedDiff, hotfixPr, releaseVersion, technicalPr } from './data'
import { Annotation, Checks, Comment, Diff, GitHubRelease, LinkedProposal, MergeBox, NewtMark, NewtSide, Pop } from './parts'

// GitHub's own interface (tabs, "opened this pull request", the merge box…) stays
// in English, as it is on github.com. What people and newt write is translated.

export type SceneProps = { onDone: () => void }

/**
 * A scene's timeline: plays once while on screen, holds the last step, then
 * hands over to the next scene. With reduced motion it shows the last step and
 * stays there.
 */
function useScene(count: number, onDone: () => void, interval = 2600) {
  const stepper = useStepper(count, { interval, loop: false })
  const { step, reduced } = stepper
  useEffect(() => {
    if (reduced || step !== count - 1) return
    const id = setTimeout(onDone, interval * 2.2)
    return () => clearTimeout(id)
  }, [step, reduced, count, interval, onDone])
  return stepper
}

/** The window on the left, what each step means on the right. */
function Frame({
  stepper,
  captions,
  children,
}: {
  stepper: ReturnType<typeof useStepper>
  captions: string[]
  children: ReactNode
}) {
  const { ref, step, setStep } = stepper
  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
      {/* Small screens: only the current step, with its position. */}
      <div className="lg:hidden" aria-live="polite">
        <div className="mb-2 flex items-center gap-1.5" aria-hidden>
          {captions.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => setStep(i)}
              className={cn('h-1 flex-1 rounded-full transition-colors', i <= step ? 'bg-brand' : 'bg-muted')}
            />
          ))}
        </div>
        <p className="text-sm">
          <span className="mr-2 font-mono text-[11px] text-brand">
            {step + 1}/{captions.length}
          </span>
          {captions[step]}
        </p>
      </div>

      <div aria-hidden className="relative min-w-0 lg:min-h-[34rem]">
        {children}
      </div>

      {/* Large screens: every step, the current one highlighted; click to jump. */}
      <ol className="hidden lg:flex lg:flex-col lg:gap-2">
        {captions.map((caption, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={i === step ? 'step' : undefined}
              className={cn(
                'relative w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                i === step ? 'border-brand/40 bg-brand/8 text-foreground' : i < step ? 'text-muted-foreground' : 'text-muted-foreground/70 hover:text-muted-foreground',
              )}
            >
              <span className={cn('mr-2 font-mono text-[11px]', i === step ? 'text-brand' : 'text-muted-foreground/60')}>{String(i + 1).padStart(2, '0')}</span>
              {caption}
              {i === step && (
                <motion.span layoutId="github-caption-bar" className="absolute inset-y-0 left-0 w-0.5 bg-brand" transition={{ duration: 0.3 }} />
              )}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* 1. Linked and checked                                                     */
/* ------------------------------------------------------------------------ */

export function LinkedScene({ onDone }: SceneProps) {
  const t = useT()
  const { pr, proposal, people, rules, deltas } = useStory()
  const captions = t({
    en: [
      'The PR says what it implements — "Implements PROP-42", like Closes #123.',
      'newt is a required check. It runs because PROP-42 is accepted.',
      'One line per artifact: what complies, what breaks, what has no test.',
      'The failure lands on the exact line of the diff, with the rule it breaks.',
      `${people.dev} pushes a fix. Every artifact complies: the PR can be merged.`,
    ],
    es: [
      'La PR dice qué implementa: "Implements PROP-42", como un Closes #123.',
      'newt es un check obligatorio. Se ejecuta porque PROP-42 está aceptada.',
      'Una línea por artifact: qué cumple, qué rompe y qué no tiene test.',
      'El fallo aparece en la línea exacta del diff, con la rule que rompe.',
      `${people.dev} sube un arreglo. Todos los artifacts cumplen: la PR se puede mergear.`,
    ],
  })
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const filesTab = step === 3
  const fixed = step >= 4
  const delta1 = deltas.find(d => d.id === 'Δ1')!
  const delta3 = deltas.find(d => d.id === 'Δ3')!
  const delta4 = deltas.find(d => d.id === 'Δ4')!
  const r07 = rules.accountOver500

  return (
    <Frame stepper={stepper} captions={captions}>
      <GitHubWindow number={pr.number} title={pr.title} state="open" active={filesTab ? 'Files changed' : step >= 1 ? 'Checks' : 'Conversation'} bodyClassName="space-y-3 p-3 sm:p-4">
        {!filesTab && (
          <Pop key="conversation" className="space-y-3">
            <Comment author={people.dev} meta="opened this pull request">
              <p>{t({ en: 'Bizum payments for guests in the mobile app.', es: 'Pagos con Bizum para invitados en la app móvil.' })}</p>
              <LinkedProposal id={proposal.id} title={proposal.title} state="accepted" />
            </Comment>
            {fixed && (
              <Pop>
                <div className="flex items-center gap-2 pl-9 text-[11px] text-muted-foreground">
                  <GitBranchIcon className="size-3.5" />
                  <span>
                    <b className="text-foreground">{people.dev}</b> pushed{' '}
                    <span className="font-mono">{t({ en: 'fix: cap guest Bizum at bizum.guest_limit', es: 'fix: limitar el Bizum de invitados a bizum.guest_limit' })}</span>
                  </span>
                </div>
              </Pop>
            )}
            {step >= 1 && (
              <Pop>
                <Checks
                  newt={step === 1 ? 'running' : fixed ? 'pass' : 'fail'}
                  detail={
                    step === 1 ? (
                      <Typing
                        active
                        text={t({
                          en: 'Checking against PROP-42 (accepted) and the current definition…',
                          es: 'Comprobando contra PROP-42 (aceptada) y la definición vigente…',
                        })}
                        speed={22}
                      />
                    ) : fixed ? (
                      t({ en: 'Every artifact touched by this PR complies.', es: 'Todos los artifacts que toca esta PR cumplen.' })
                    ) : (
                      t({ en: '1 artifact broken · 1 without a test · 3 comply', es: '1 artifact roto · 1 sin test · 3 cumplen' })
                    )
                  }
                >
                  {step >= 2 && (
                    <>
                      <CheckLine result="pass">
                        <ArtifactTag kind="rule" id="R-12" /> {delta1.after} <span className="text-muted-foreground">· Δ1</span>
                      </CheckLine>
                      <CheckLine result="pass">
                        <ArtifactTag kind="lifecycle" id={delta3.artifact} /> {delta3.after} <span className="text-muted-foreground">· Δ3</span>
                      </CheckLine>
                      <CheckLine result="pass">
                        <ArtifactTag kind="actor" id="Guest" /> {t({ en: 'can pay with Bizum', es: 'puede pagar con Bizum' })} <span className="text-muted-foreground">· Δ5</span>
                      </CheckLine>
                      <CheckLine result={fixed ? 'pass' : 'fail'}>
                        <ArtifactTag kind="rule" id={r07.id} /> {r07.text}
                        {!fixed && <span className="text-bad">{t({ en: ' — a guest can pay any amount', es: ' — un invitado puede pagar cualquier importe' })}</span>}
                      </CheckLine>
                      <CheckLine result="warn">
                        <ArtifactTag kind="rule" id={rules.invoiceByEmail.id} /> {t({ en: 'Invoice emailed to guests', es: 'Factura por email a los invitados' })} —{' '}
                        <span className="text-warn">{t({ en: 'no test covers it', es: 'ningún test lo cubre' })}</span>
                      </CheckLine>
                      <div className="pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-brand">
                          <NewtMark className="size-3.5 text-[8px]" /> {t({ en: `View ${proposal.id} in newt →`, es: `Ver ${proposal.id} en newt →` })}
                        </span>
                      </div>
                    </>
                  )}
                </Checks>
              </Pop>
            )}
            {step >= 2 && (
              <Pop>
                <MergeBox
                  state={fixed ? 'ready' : 'blocked'}
                  reason={
                    fixed ? undefined : (
                      t({
                        en: (
                          <>
                            Required check <b>newt / definition</b> failed: rule {r07.id}.
                          </>
                        ),
                        es: (
                          <>
                            El check obligatorio <b>newt / definition</b> ha fallado: rule {r07.id}.
                          </>
                        ),
                      })
                    )
                  }
                />
              </Pop>
            )}
          </Pop>
        )}
        {filesTab && (
          <Pop key="files">
            <Diff
              file={pr.file}
              lines={firstDiff}
              annotate={annotatedLine}
              annotation={
                <Annotation>
                  <div className="font-semibold">
                    newt · <span className="text-bad">rule {r07.id}</span>
                  </div>
                  <p className="mt-0.5 text-muted-foreground">
                    {t({
                      en: (
                        <>
                          A guest can pay <b className="text-foreground">any amount</b> with Bizum here. {r07.id} requires a registered account over €500 —{' '}
                          <span className="font-mono">{delta4.artifact}</span> = €500 ({delta4.id} of {proposal.id}).
                        </>
                      ),
                      es: (
                        <>
                          Aquí un invitado puede pagar <b className="text-foreground">cualquier importe</b> con Bizum. {r07.id} exige una cuenta registrada por
                          encima de 500 € — <span className="font-mono">{delta4.artifact}</span> = 500 € ({delta4.id} de {proposal.id}).
                        </>
                      ),
                    })}
                  </p>
                </Annotation>
              }
            />
          </Pop>
        )}
        {fixed && (
          <Pop className="hidden sm:block">
            <Diff file={pr.file} lines={fixedDiff} highlight />
          </Pop>
        )}
      </GitHubWindow>
    </Frame>
  )
}

/* ------------------------------------------------------------------------ */
/* 2. Blocked until accepted                                                 */
/* ------------------------------------------------------------------------ */

export function BlockedScene({ onDone }: SceneProps) {
  const t = useT()
  const { people } = useStory()
  const id = blockedPr.proposal.id
  const captions = t({
    en: [
      `This PR implements ${id}, which product is still discussing.`,
      'newt won’t check code against something that can still change: the check doesn’t run.',
      'So the PR can’t be merged — and it says why, with a link to the proposal.',
      `${people.product} accepts ${id} in newt. The check runs on its own.`,
    ],
    es: [
      `Esta PR implementa ${id}, que producto todavía está discutiendo.`,
      'newt no comprueba el código contra algo que aún puede cambiar: el check no se ejecuta.',
      'Así que la PR no se puede mergear, y lo dice: por qué y con enlace a la proposal.',
      `${people.product} acepta ${id} en newt. El check se ejecuta solo.`,
    ],
  })
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const accepted = step >= 3

  return (
    <Frame stepper={stepper} captions={captions}>
      <GitHubWindow number={blockedPr.number} title={t(blockedPr.title)} state="blocked" bodyClassName="space-y-3 p-3 sm:p-4">
        <Comment author={people.dev} meta="opened this pull request">
          <p>{t({ en: "Remember a guest's card for their next order.", es: 'Recordar la tarjeta de un invitado para su próximo pedido.' })}</p>
          <LinkedProposal id={id} title={t(blockedPr.proposal.title)} state={accepted ? 'accepted' : 'in review'} />
        </Comment>
        {step >= 1 && (
          <Pop key="checks">
            <Checks
              newt={accepted ? 'running' : 'skipped'}
              detail={
                accepted ? (
                  <Typing active text={t({ en: `${id} was accepted — checking now…`, es: `${id} se ha aceptado: comprobando…` })} speed={22} />
                ) : (
                  t({
                    en: (
                      <>
                        Not run: <b className="text-foreground">{id}</b> is <span className="text-warn">in review</span>, not accepted.
                      </>
                    ),
                    es: (
                      <>
                        No se ejecuta: <b className="text-foreground">{id}</b> está <span className="text-warn">in review</span>, sin aceptar.
                      </>
                    ),
                  })
                )
              }
            />
          </Pop>
        )}
        {step >= 2 && (
          <Pop key="merge">
            <MergeBox
              state="blocked"
              reason={
                accepted
                  ? t({ en: 'Waiting for newt / definition to finish.', es: 'Esperando a que termine newt / definition.' })
                  : t({
                      en: (
                        <>
                          Required check <b>newt / definition</b>: the proposal this PR implements isn’t accepted yet.
                        </>
                      ),
                      es: (
                        <>
                          Check obligatorio <b>newt / definition</b>: la proposal que implementa esta PR aún no está aceptada.
                        </>
                      ),
                    })
              }
            />
          </Pop>
        )}
      </GitHubWindow>
      {accepted && (
        <Pop key="newt" className="mt-3 sm:ml-auto sm:w-80">
          <NewtSide title={id}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{t(blockedPr.proposal.title)}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ProposalBadge state="in review" className="opacity-60" /> → <ProposalBadge state="accepted" />
            </div>
            <div className="text-[11px] text-muted-foreground">
              {t({
                en: (
                  <>
                    Accepted by <b className="text-foreground">{people.product}</b> · 4 deltas approved · gate passed
                  </>
                ),
                es: (
                  <>
                    Aceptada por <b className="text-foreground">{people.product}</b> · 4 deltas aprobados · puerta superada
                  </>
                ),
              })}
            </div>
          </NewtSide>
        </Pop>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------ */
/* 3. No proposal                                                            */
/* ------------------------------------------------------------------------ */

export function NoProposalScene({ onDone }: SceneProps) {
  const t = useT()
  const { people, rules } = useStory()
  const breaks = rules[behaviorPr.breaks]
  const drafted = behaviorPr.drafted
  const captions = t({
    en: [
      'A PR with no proposal. Its author calls it a fix.',
      `newt reads the change: it’s a behavior change — ${breaks.id} would no longer hold.`,
      `newt drafts the proposal from the PR — ${drafted.id}, origin: code — and the PR waits for product.`,
      'A technical PR changes no behavior, so it goes straight through.',
    ],
    es: [
      'Una PR sin proposal. Su autor dice que es un arreglo.',
      `newt lee el cambio: cambia el comportamiento, y ${breaks.id} dejaría de cumplirse.`,
      `newt redacta la proposal a partir de la PR (${drafted.id}, origen: código) y la PR espera a producto.`,
      'Una PR técnica no cambia ningún comportamiento, así que pasa directa.',
    ],
  })
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const technical = step >= 3

  return (
    <Frame stepper={stepper} captions={captions}>
      {!technical ? (
        <Pop key="behavior">
          <GitHubWindow number={behaviorPr.number} title={t(behaviorPr.title)} state="blocked" bodyClassName="space-y-3 p-3 sm:p-4">
            <Comment author={people.dev} meta="opened this pull request">
              <p>{t({ en: "Support needs to correct an order's amount after a payment error.", es: 'Soporte necesita corregir el importe de un pedido tras un error en el pago.' })}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="muted">{t({ en: 'Type', es: 'Tipo' })}: {behaviorPr.declared}</Badge>
                <Badge variant="muted">{t({ en: 'No linked proposal', es: 'Sin proposal enlazada' })}</Badge>
              </div>
            </Comment>
            {step >= 1 && (
              <Pop>
                <Checks
                  newt="fail"
                  detail={t({
                    en: (
                      <>
                        Declared as <i>fix</i>, but this <b className="text-foreground">changes behavior</b> with no proposal.
                      </>
                    ),
                    es: (
                      <>
                        Declarada como <i>fix</i>, pero <b className="text-foreground">cambia el comportamiento</b> sin proposal.
                      </>
                    ),
                  })}
                >
                  <CheckLine result="fail">
                    <ArtifactTag kind="rule" id={breaks.id} /> {breaks.text}{' '}
                    <span className="text-bad">{t({ en: '— no longer true in the backoffice', es: '— deja de cumplirse en el backoffice' })}</span>
                  </CheckLine>
                </Checks>
              </Pop>
            )}
            {step >= 2 && (
              <Pop>
                <Comment author="newt" bot meta="commented just now">
                  <p>{t({ en: 'This needs a product decision, so I drafted it for you:', es: 'Esto necesita una decisión de producto, así que te la he redactado:' })}</p>
                  <div className="space-y-1.5 rounded-md border bg-background/60 px-2.5 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-brand">{drafted.id}</span>
                      <span className="text-[11px]">{t(drafted.title)}</span>
                      <ProposalBadge state="in review" className="ml-auto" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                      <span className="rounded border px-1.5">{t({ en: 'origin: code', es: 'origen: código' })}</span>
                      <span className="rounded border px-1.5">{t({ en: 'type: correction', es: 'tipo: corrección' })}</span>
                      <span className="rounded border px-1.5">{t({ en: `1 delta · ${breaks.id} changed`, es: `1 delta · ${breaks.id} cambiada` })}</span>
                    </div>
                  </div>
                </Comment>
              </Pop>
            )}
            {step >= 2 && (
              <Pop>
                <MergeBox
                  state="blocked"
                  reason={t({
                    en: (
                      <>
                        Waiting for <b>{drafted.id}</b> to be accepted by product.
                      </>
                    ),
                    es: (
                      <>
                        Esperando a que producto acepte <b>{drafted.id}</b>.
                      </>
                    ),
                  })}
                />
              </Pop>
            )}
          </GitHubWindow>
        </Pop>
      ) : (
        <Pop key="technical">
          <GitHubWindow number={technicalPr.number} title={t(technicalPr.title)} state="open" bodyClassName="space-y-3 p-3 sm:p-4">
            <Comment author={people.dev} meta="opened this pull request">
              <p>{t({ en: 'Moves the payment gateway client to its own module. No functional changes.', es: 'Lleva el cliente de la pasarela de pago a su propio módulo. Sin cambios funcionales.' })}</p>
              <Badge variant="muted">{t({ en: 'Type: technical', es: 'Tipo: técnica' })}</Badge>
            </Comment>
            <Checks newt="pass" detail={t({ en: 'Technical: no behavior change against the current definition.', es: 'Técnica: ningún cambio de comportamiento respecto a la definición vigente.' })}>
              <CheckLine result="pass">
                {t({
                  en: (
                    <>
                      37 artifacts in <span className="font-mono">Checkout › Payments</span> still comply
                    </>
                  ),
                  es: (
                    <>
                      Los 37 artifacts de <span className="font-mono">Checkout › Payments</span> siguen cumpliendo
                    </>
                  ),
                })}
              </CheckLine>
            </Checks>
            <MergeBox state="ready" />
          </GitHubWindow>
        </Pop>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------ */
/* 4. Urgent lane                                                            */
/* ------------------------------------------------------------------------ */

export function UrgentScene({ onDone }: SceneProps) {
  const t = useT()
  const { bug, people } = useStory()
  const drafted = hotfixPr.drafted
  const reason = t(hotfixPr.reason)
  const captions = t({
    en: [
      `Production is crashing. The hotfix resolves ${bug.id} — but it changes the Order lifecycle.`,
      `It can’t wait for product at 3 a.m. ${people.dev} takes the urgent lane, with a reason.`,
      'It merges — and newt records who did it and why.',
      `Product sees it next morning: ${drafted.id} waits to be validated, ${bug.id} is resolved.`,
    ],
    es: [
      `Producción se está cayendo. El hotfix resuelve ${bug.id}, pero cambia el lifecycle de Order.`,
      `A las 3 de la madrugada no se puede esperar a producto. ${people.dev} toma el carril urgente, con un motivo.`,
      'Se mergea, y newt registra quién lo hizo y por qué.',
      `Producto lo ve a la mañana siguiente: ${drafted.id} espera a validarse y ${bug.id} está resuelto.`,
    ],
  })
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const merged = step >= 2

  return (
    <Frame stepper={stepper} captions={captions}>
      <GitHubWindow number={hotfixPr.number} title={t(hotfixPr.title)} state={merged ? 'merged' : 'blocked'} bodyClassName="space-y-3 p-3 sm:p-4">
        <Comment author={people.dev} meta="opened this pull request">
          <div className="flex flex-wrap items-center gap-2">
            <span>{t({ en: 'Resolves', es: 'Resuelve' })}</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold">
              <BugIcon className="size-3.5 text-bad" /> {bug.id}
            </span>
            <BugBadge state={step >= 3 ? 'resolved' : 'confirmed'} />
            <span className="text-[11px] text-muted-foreground">
              {bug.occurrences} {t({ en: 'occurrences', es: 'ocurrencias' })} · {bug.source}
            </span>
          </div>
          <p className="text-muted-foreground">{bug.title}</p>
        </Comment>
        {!merged && (
          <Checks
            newt="fail"
            detail={t({
              en: 'Needs a product decision: adds awaiting Bizum → cancelled after 15 min.',
              es: 'Necesita una decisión de producto: añade awaiting Bizum → cancelled a los 15 min.',
            })}
          >
            <CheckLine result="fail">
              <ArtifactTag kind="lifecycle" id="Order" /> {t({ en: 'New transition with no accepted proposal', es: 'Transición nueva sin proposal aceptada' })}
            </CheckLine>
          </Checks>
        )}
        {step === 0 && (
          <Pop key="blocked">
            <MergeBox state="blocked" reason={t({ en: 'A behavior change needs an accepted proposal.', es: 'Un cambio de comportamiento necesita una proposal aceptada.' })} />
          </Pop>
        )}
        {step === 1 && (
          <Pop key="urgent">
            <MergeBox
              state="urgent"
              pressed
              reason={
                <span className="mt-1 block rounded-md border bg-background/60 px-2 py-1.5 font-mono text-[11px] text-foreground">
                  {t({ en: 'Reason', es: 'Motivo' })}: <Typing active text={reason} speed={24} />
                </span>
              }
            />
          </Pop>
        )}
        {merged && (
          <Pop key="merged">
            <MergeBox
              state="merged"
              reason={t({
                en: (
                  <>
                    Merged by <b className="text-foreground">{people.dev}</b> without acceptance · “{reason}”
                  </>
                ),
                es: (
                  <>
                    Mergeada por <b className="text-foreground">{people.dev}</b> sin aceptar · “{reason}”
                  </>
                ),
              })}
            />
          </Pop>
        )}
      </GitHubWindow>
      {step >= 3 && (
        <Pop key="newt" className="mt-3 sm:ml-auto sm:w-80">
          <NewtSide title={t({ en: 'Merged without acceptance · 1', es: 'Merged sin aceptar · 1' })}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-brand">{drafted.id}</span>
              <span className="text-[11px]">{t(drafted.title)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
              <Badge variant="warn">{t({ en: 'merged without acceptance', es: 'merged sin aceptar' })}</Badge>
              <span>{t({ en: `origin: code · by ${people.dev}`, es: `origen: código · por ${people.dev}` })}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono">{bug.id}</span> <BugBadge state="resolved" />
            </div>
            <div className="text-[11px] font-medium text-brand">{t({ en: 'Validate or correct →', es: 'Validar o corregir →' })}</div>
          </NewtSide>
        </Pop>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------ */
/* 5. Merged and released                                                    */
/* ------------------------------------------------------------------------ */

export function ReleasedScene({ onDone }: SceneProps) {
  const t = useT()
  const { pr, proposal, people, deltas, releases, workspace } = useStory()
  const release = releases.find(r => r.version === releaseVersion)!
  const captions = t({
    en: [
      `Every check passes. ${people.dev} merges #${pr.number}.`,
      `${proposal.id} moves to merged on its own: its deltas are now the current definition.`,
      `${people.dev} publishes ${release.version} on GitHub…`,
      '…and it is a release of the product too, with a changelog anyone can read.',
    ],
    es: [
      `Todos los checks pasan. ${people.dev} mergea la #${pr.number}.`,
      `${proposal.id} pasa sola a merged: sus deltas ya son la definición vigente.`,
      `${people.dev} publica ${release.version} en GitHub…`,
      '…y es también una release del producto, con un changelog que cualquiera puede leer.',
    ],
  })
  const stepper = useScene(captions.length, onDone, 2800)
  const { step } = stepper
  const merged = step >= 1
  const published = step >= 3

  const opLook = { new: 'text-ok', changed: 'text-warn', retired: 'text-bad' } as const
  const opLabel = t({
    en: { new: 'new', changed: 'changed', retired: 'retired' },
    es: { new: 'nuevo', changed: 'cambiado', retired: 'retirado' },
  })
  const changelog = t({
    en: { changed: 'Changed', new: 'New' },
    es: { changed: 'Cambiado', new: 'Nuevo' },
  })

  return (
    <Frame stepper={stepper} captions={captions}>
      <div className="space-y-3">
        <GitHubWindow number={pr.number} title={pr.title} state={merged ? 'merged' : 'open'} bodyClassName="space-y-3 p-3 sm:p-4">
          <LinkedProposal id={proposal.id} title={proposal.title} state={merged ? 'merged' : 'accepted'} />
          {merged ? (
            <Pop key="merged">
              <MergeBox
                state="merged"
                reason={t({
                  en: (
                    <>
                      {proposal.id} is now <b className="text-foreground">merged</b> in newt.
                    </>
                  ),
                  es: (
                    <>
                      {proposal.id} ya está <b className="text-foreground">merged</b> en newt.
                    </>
                  ),
                })}
              />
            </Pop>
          ) : (
            <Pop key="ready">
              <MergeBox state="ready" pressed />
            </Pop>
          )}
          {step === 0 && <FakeCursor x={20} y={78} click />}
        </GitHubWindow>

        <div className="grid gap-3 sm:grid-cols-2">
          {merged && (
            <Pop key="definition">
              <NewtSide title={t({ en: 'Current definition', es: 'Definición vigente' })}>
                <div className="flex items-center gap-2 text-[11px]">
                  <ProposalBadge state="accepted" className="opacity-60" /> → <ProposalBadge state="merged" />
                </div>
                <ul className="space-y-1">
                  {deltas.slice(0, 3).map(d => (
                    <li key={d.id} className="flex items-center gap-1.5 text-[11px]">
                      <span className="font-mono text-muted-foreground">{d.id}</span>
                      <ArtifactTag kind={d.kind} id={d.artifact} />
                      <span className={opLook[d.op]}>{opLabel[d.op]}</span>
                    </li>
                  ))}
                  <li className="text-[11px] text-muted-foreground">
                    {t({ en: `+ ${deltas.length - 3} more · from ${proposal.id}`, es: `+ ${deltas.length - 3} más · de ${proposal.id}` })}
                  </li>
                </ul>
              </NewtSide>
            </Pop>
          )}
          {step >= 2 && (
            <Pop key="release" className="space-y-3">
              {/* github.com is in English: so is its date. */}
              <GitHubRelease version={release.version} date={release.githubDate} published={published} />
              {published && (
                <Pop>
                  <NewtSide title={`Release ${release.version}`}>
                    <div className="font-medium">
                      Changelog · {workspace.product} {release.version}
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                      <li>
                        <span className="text-warn">{changelog.changed}</span> · {deltas.find(d => d.id === 'Δ1')!.after}
                      </li>
                      <li>
                        <span className="text-ok">{changelog.new}</span> · {deltas.find(d => d.id === 'Δ2')!.after}
                      </li>
                      <li>
                        <span className="text-ok">{changelog.new}</span> · {deltas.find(d => d.id === 'Δ4')!.after}
                      </li>
                    </ul>
                    <div className="text-[11px] font-medium text-brand">{t({ en: 'Same version as the code →', es: 'La misma versión que el código →' })}</div>
                  </NewtSide>
                </Pop>
              )}
            </Pop>
          )}
        </div>
      </div>
    </Frame>
  )
}
