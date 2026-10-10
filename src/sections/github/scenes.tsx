import { useEffect, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { BugIcon, GitBranchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStepper } from '@/lib/motion'
import { Typing, FakeCursor } from '@/lib/typing'
import { GitHubWindow } from '@/components/mock/window'
import { ArtifactTag, BugBadge, CheckLine, ProposalBadge } from '@/components/mock/status'
import { Badge } from '@/components/ui/badge'
import {
  annotatedLine,
  behaviorPr,
  blockedPr,
  bug,
  deltas,
  firstDiff,
  fixedDiff,
  hotfixPr,
  people,
  pr,
  proposal,
  release,
  rules,
  technicalPr,
} from './data'
import { Annotation, Checks, Comment, Diff, GitHubRelease, LinkedProposal, MergeBox, NewtMark, NewtSide, Pop } from './parts'

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
  const captions = [
    'The PR says what it implements — "Implements PROP-42", like Closes #123.',
    'newt is a required check. It runs because PROP-42 is accepted.',
    'One line per artifact: what complies, what breaks, what has no test.',
    'The failure lands on the exact line of the diff, with the rule it breaks.',
    'Marc pushes a fix. Every artifact complies: the PR can be merged.',
  ]
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const filesTab = step === 3
  const fixed = step >= 4
  const delta4 = deltas.find(d => d.id === 'Δ4')!

  return (
    <Frame stepper={stepper} captions={captions}>
      <GitHubWindow number={pr.number} title={pr.title} state="open" active={filesTab ? 'Files changed' : step >= 1 ? 'Checks' : 'Conversation'} bodyClassName="space-y-3 p-3 sm:p-4">
          {!filesTab && (
            <Pop key="conversation" className="space-y-3">
              <Comment author={people.dev} meta="opened this pull request">
                <p>Bizum payments for guests in the mobile app.</p>
                <LinkedProposal id={proposal.id} title={proposal.title} state="accepted" />
              </Comment>
              {fixed && (
                <Pop>
                  <div className="flex items-center gap-2 pl-9 text-[11px] text-muted-foreground">
                    <GitBranchIcon className="size-3.5" />
                    <span>
                      <b className="text-foreground">{people.dev}</b> pushed <span className="font-mono">fix: cap guest Bizum at bizum.guest_limit</span>
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
                        <Typing active text="Checking against PROP-42 (accepted) and the current definition…" speed={22} />
                      ) : fixed ? (
                        'Every artifact touched by this PR complies.'
                      ) : (
                        '1 artifact broken · 1 without a test · 3 comply'
                      )
                    }
                  >
                    {step >= 2 && (
                      <>
                        <CheckLine result="pass">
                          <ArtifactTag kind="rule" id="R-12" /> Guests can pay only with Bizum, in the mobile app <span className="text-muted-foreground">· Δ1</span>
                        </CheckLine>
                        <CheckLine result="pass">
                          <ArtifactTag kind="lifecycle" id="Order" /> created → awaiting Bizum → paid <span className="text-muted-foreground">· Δ3</span>
                        </CheckLine>
                        <CheckLine result="pass">
                          <ArtifactTag kind="actor" id="Guest" /> can pay with Bizum <span className="text-muted-foreground">· Δ5</span>
                        </CheckLine>
                        <CheckLine result={fixed ? 'pass' : 'fail'}>
                          <ArtifactTag kind="rule" id={rules.accountOver500.id} /> {rules.accountOver500.text}
                          {!fixed && <span className="text-bad"> — a guest can pay any amount</span>}
                        </CheckLine>
                        <CheckLine result="warn">
                          <ArtifactTag kind="rule" id={rules.invoiceByEmail.id} /> Invoice emailed to guests — <span className="text-warn">no test covers it</span>
                        </CheckLine>
                        <div className="pt-1 text-[11px]">
                          <span className="inline-flex items-center gap-1 text-brand">
                            <NewtMark className="size-3.5 text-[8px]" /> View {proposal.id} in newt →
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
                    reason={fixed ? undefined : <>Required check <b>newt / definition</b> failed: rule {rules.accountOver500.id}.</>}
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
                      newt · <span className="text-bad">rule {rules.accountOver500.id}</span>
                    </div>
                    <p className="mt-0.5 text-muted-foreground">
                      A guest can pay <b className="text-foreground">any amount</b> with Bizum here. {rules.accountOver500.id} requires a registered account over €500 —{' '}
                      <span className="font-mono">{delta4.artifact}</span> = €500 ({delta4.id} of {proposal.id}).
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
  const captions = [
    `This PR implements ${blockedPr.proposal.id}, which product is still discussing.`,
    'newt won’t check code against something that can still change: the check doesn’t run.',
    'So the PR can’t be merged — and it says why, with a link to the proposal.',
    `${people.product} accepts ${blockedPr.proposal.id} in newt. The check runs on its own.`,
  ]
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const accepted = step >= 3

  return (
    <Frame stepper={stepper} captions={captions}>
      <GitHubWindow number={blockedPr.number} title={blockedPr.title} state="blocked" bodyClassName="space-y-3 p-3 sm:p-4">
        <Comment author={people.dev} meta="opened this pull request">
          <p>Remember a guest's card for their next order.</p>
          <LinkedProposal id={blockedPr.proposal.id} title={blockedPr.proposal.title} state={accepted ? 'accepted' : 'in review'} />
        </Comment>
          {step >= 1 && (
            <Pop key="checks">
              <Checks
                newt={accepted ? 'running' : 'skipped'}
                detail={
                  accepted ? (
                    <Typing active text={`${blockedPr.proposal.id} was accepted — checking now…`} speed={22} />
                  ) : (
                    <>
                      Not run: <b className="text-foreground">{blockedPr.proposal.id}</b> is <span className="text-warn">in review</span>, not accepted.
                    </>
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
                  accepted ? (
                    'Waiting for newt / definition to finish.'
                  ) : (
                    <>
                      Required check <b>newt / definition</b>: the proposal this PR implements isn’t accepted yet.
                    </>
                  )
                }
              />
            </Pop>
          )}
              </GitHubWindow>
        {accepted && (
          <Pop key="newt" className="mt-3 sm:ml-auto sm:w-80">
            <NewtSide title={blockedPr.proposal.id}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{blockedPr.proposal.title}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <ProposalBadge state="in review" className="opacity-60" /> → <ProposalBadge state="accepted" />
              </div>
              <div className="text-[11px] text-muted-foreground">
                Accepted by <b className="text-foreground">{people.product}</b> · 4 deltas approved · gate passed
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
  const captions = [
    'A PR with no proposal. Its author calls it a fix.',
    `newt reads the change: it’s a behavior change — ${behaviorPr.breaks.id} would no longer hold.`,
    `newt drafts the proposal from the PR — ${behaviorPr.drafted.id}, origin: code — and the PR waits for product.`,
    'A technical PR changes no behavior, so it goes straight through.',
  ]
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const technical = step >= 3

  return (
    <Frame stepper={stepper} captions={captions}>
        {!technical ? (
          <Pop key="behavior">
            <GitHubWindow number={behaviorPr.number} title={behaviorPr.title} state="blocked" bodyClassName="space-y-3 p-3 sm:p-4">
              <Comment author={people.dev} meta="opened this pull request">
                <p>Support needs to correct an order's amount after a payment error.</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="muted">Type: {behaviorPr.declared}</Badge>
                  <Badge variant="muted">No linked proposal</Badge>
                </div>
              </Comment>
              {step >= 1 && (
                <Pop>
                  <Checks
                    newt="fail"
                    detail={
                      <>
                        Declared as <i>fix</i>, but this <b className="text-foreground">changes behavior</b> with no proposal.
                      </>
                    }
                  >
                    <CheckLine result="fail">
                      <ArtifactTag kind="rule" id={behaviorPr.breaks.id} /> {behaviorPr.breaks.text} <span className="text-bad">— no longer true in the backoffice</span>
                    </CheckLine>
                  </Checks>
                </Pop>
              )}
              {step >= 2 && (
                <Pop>
                  <Comment author="newt" bot meta="commented just now">
                    <p>This needs a product decision, so I drafted it for you:</p>
                    <div className="space-y-1.5 rounded-md border bg-background/60 px-2.5 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-brand">{behaviorPr.drafted.id}</span>
                        <span className="text-[11px]">{behaviorPr.drafted.title}</span>
                        <ProposalBadge state="in review" className="ml-auto" />
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                        <span className="rounded border px-1.5">origin: code</span>
                        <span className="rounded border px-1.5">type: correction</span>
                        <span className="rounded border px-1.5">1 delta · {behaviorPr.breaks.id} changed</span>
                      </div>
                    </div>
                  </Comment>
                </Pop>
              )}
              {step >= 2 && (
                <Pop>
                  <MergeBox state="blocked" reason={<>Waiting for <b>{behaviorPr.drafted.id}</b> to be accepted by product.</>} />
                </Pop>
              )}
            </GitHubWindow>
          </Pop>
        ) : (
          <Pop key="technical">
            <GitHubWindow number={technicalPr.number} title={technicalPr.title} state="open" bodyClassName="space-y-3 p-3 sm:p-4">
              <Comment author={people.dev} meta="opened this pull request">
                <p>Moves the payment gateway client to its own module. No functional changes.</p>
                <Badge variant="muted">Type: technical</Badge>
              </Comment>
              <Checks newt="pass" detail="Technical: no behavior change against the current definition.">
                <CheckLine result="pass">
                  37 artifacts in <span className="font-mono">Checkout › Payments</span> still comply
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
  const captions = [
    `Production is crashing. The hotfix resolves ${bug.id} — but it changes the Order lifecycle.`,
    `It can’t wait for product at 3 a.m. ${people.dev} takes the urgent lane, with a reason.`,
    'It merges — and newt records who did it and why.',
    `Product sees it next morning: ${hotfixPr.drafted.id} waits to be validated, ${bug.id} is resolved.`,
  ]
  const stepper = useScene(captions.length, onDone)
  const { step } = stepper
  const merged = step >= 2

  return (
    <Frame stepper={stepper} captions={captions}>
      <GitHubWindow number={hotfixPr.number} title={hotfixPr.title} state={merged ? 'merged' : 'blocked'} bodyClassName="space-y-3 p-3 sm:p-4">
        <Comment author={people.dev} meta="opened this pull request">
          <div className="flex flex-wrap items-center gap-2">
            <span>Resolves</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold">
              <BugIcon className="size-3.5 text-bad" /> {bug.id}
            </span>
            <BugBadge state={step >= 3 ? 'resolved' : 'confirmed'} />
            <span className="text-[11px] text-muted-foreground">{bug.occurrences} occurrences · {bug.source}</span>
          </div>
          <p className="text-muted-foreground">{bug.title}</p>
        </Comment>
        {!merged && (
          <Checks newt="fail" detail="Needs a product decision: adds awaiting Bizum → cancelled after 15 min.">
            <CheckLine result="fail">
              <ArtifactTag kind="lifecycle" id="Order" /> New transition with no accepted proposal
            </CheckLine>
          </Checks>
        )}
          {step === 0 && (
            <Pop key="blocked">
              <MergeBox state="blocked" reason="A behavior change needs an accepted proposal." />
            </Pop>
          )}
          {step === 1 && (
            <Pop key="urgent">
              <MergeBox
                state="urgent"
                pressed
                reason={
                  <span className="mt-1 block rounded-md border bg-background/60 px-2 py-1.5 font-mono text-[11px] text-foreground">
                    Reason: <Typing active text={hotfixPr.reason} speed={24} />
                  </span>
                }
              />
            </Pop>
          )}
          {merged && (
            <Pop key="merged">
              <MergeBox
                state="merged"
                reason={
                  <>
                    Merged by <b className="text-foreground">{people.dev}</b> without acceptance · “{hotfixPr.reason}”
                  </>
                }
              />
            </Pop>
          )}
              </GitHubWindow>
        {step >= 3 && (
          <Pop key="newt" className="mt-3 sm:ml-auto sm:w-80">
            <NewtSide title="Merged without acceptance · 1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-brand">{hotfixPr.drafted.id}</span>
                <span className="text-[11px]">{hotfixPr.drafted.title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                <Badge variant="warn">merged without acceptance</Badge>
                <span>origin: code · by {people.dev}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">{bug.id}</span> <BugBadge state="resolved" />
              </div>
              <div className="text-[11px] font-medium text-brand">Validate or correct →</div>
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
  const captions = [
    `Every check passes. ${people.dev} merges #${pr.number}.`,
    `${proposal.id} moves to merged on its own: its deltas are now the current definition.`,
    `${people.dev} publishes ${release.version} on GitHub…`,
    '…and it is a release of the product too, with a changelog anyone can read.',
  ]
  const stepper = useScene(captions.length, onDone, 2800)
  const { step } = stepper
  const merged = step >= 1
  const published = step >= 3

  const opLook = { new: 'text-ok', changed: 'text-warn', retired: 'text-bad' } as const

  return (
    <Frame stepper={stepper} captions={captions}>
      <div className="space-y-3">
        <GitHubWindow number={pr.number} title={pr.title} state={merged ? 'merged' : 'open'} bodyClassName="space-y-3 p-3 sm:p-4">
          <LinkedProposal id={proposal.id} title={proposal.title} state={merged ? 'merged' : 'accepted'} />
            {merged ? (
              <Pop key="merged">
                <MergeBox state="merged" reason={<>{proposal.id} is now <b className="text-foreground">merged</b> in newt.</>} />
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
                <NewtSide title="Current definition">
                  <div className="flex items-center gap-2 text-[11px]">
                    <ProposalBadge state="accepted" className="opacity-60" /> → <ProposalBadge state="merged" />
                  </div>
                  <ul className="space-y-1">
                    {deltas.slice(0, 3).map(d => (
                      <li key={d.id} className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-mono text-muted-foreground">{d.id}</span>
                        <ArtifactTag kind={d.kind} id={d.artifact} />
                        <span className={opLook[d.op]}>{d.op}</span>
                      </li>
                    ))}
                    <li className="text-[11px] text-muted-foreground">+ {deltas.length - 3} more · from {proposal.id}</li>
                  </ul>
                </NewtSide>
              </Pop>
            )}
            {step >= 2 && (
              <Pop key="release" className="space-y-3">
                <GitHubRelease version={release.version} date={release.date} published={published} />
                {published && (
                  <Pop>
                    <NewtSide title={`Release ${release.version}`}>
                      <div className="font-medium">Changelog · Acme Shop {release.version}</div>
                      <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                        <li>
                          <span className="text-warn">Changed</span> · Guests can pay only with Bizum, in the mobile app
                        </li>
                        <li>
                          <span className="text-ok">New</span> · A guest's invoice is emailed to them
                        </li>
                        <li>
                          <span className="text-ok">New</span> · Guest Bizum limit: €500 (Spain)
                        </li>
                      </ul>
                      <div className="text-[11px] font-medium text-brand">Same version as the code →</div>
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
