/**
 * The GitHub side of the shared story (src/lib/data.ts): the pull requests,
 * diffs and releases the scenes show. Same people, same rules, same numbers.
 */
import { bug, deltas, people, pr, proposal, releases, rules } from '@/lib/data'

export { bug, deltas, people, pr, proposal, releases, rules }

export type DiffLine = { n: number; kind: '+' | '-' | ' '; code: string }

/** PR #318, first push: guests can pay with Bizum, but with no limit. */
export const firstDiff: DiffLine[] = [
  { n: 40, kind: ' ', code: 'export async function pay(order: Order, method: Method, user: User) {' },
  { n: 41, kind: '-', code: '  if (user.isGuest) throw new GuestPaymentError()' },
  { n: 41, kind: '+', code: "  if (user.isGuest && method !== 'bizum') throw new GuestPaymentError()" },
  { n: 42, kind: '+', code: '  if (user.isGuest) return bizum.authorize(order)' },
  { n: 43, kind: ' ', code: '  return gateway.charge(order, method)' },
  { n: 44, kind: ' ', code: '}' },
]

/** The line newt annotates in the first push. */
export const annotatedLine = 42

/** PR #318 after the fix: the guest limit comes from the parameter. */
export const fixedDiff: DiffLine[] = [
  { n: 42, kind: '+', code: '  if (user.isGuest && order.total > params.bizum.guestLimit)' },
  { n: 43, kind: '+', code: '    throw new AccountRequiredError()' },
  { n: 44, kind: '+', code: '  if (user.isGuest) return bizum.authorize(order)' },
]

/** A PR whose proposal is still being discussed. */
export const blockedPr = {
  number: 321,
  title: 'feat(checkout): returning guests can save a card',
  proposal: { id: 'PROP-45', title: 'Returning guests can save a card' },
}

/** A PR with no proposal that changes how the product behaves. */
export const behaviorPr = {
  number: 324,
  title: "fix(backoffice): support can edit a paid order's amount",
  declared: 'fix',
  breaks: rules.paidOrderImmutable,
  drafted: { id: 'PROP-47', title: 'Support can correct the amount of a paid order' },
}

/** A PR with no proposal that changes nothing a customer could notice. */
export const technicalPr = {
  number: 325,
  title: 'refactor(payments): extract the gateway client',
}

/** The hotfix that cannot wait for product. */
export const hotfixPr = {
  number: 326,
  title: 'hotfix(checkout): cancel orders stuck awaiting Bizum',
  reason: 'Crash in production: 132 occurrences in the last hour (BUG-77).',
  drafted: { id: 'PROP-48', title: 'Orders awaiting Bizum are cancelled after 15 minutes' },
}

export const release = releases.find(r => r.version === 'v2.4.0')!
