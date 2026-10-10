/**
 * The example everyone shares: Acme Shop, an online store. Sections pick from
 * here so every mock tells the same story with the same names and numbers.
 */

export type ProposalState = 'draft' | 'in review' | 'accepted' | 'merged' | 'discarded'
export type DeltaState = 'pending' | 'approved' | 'rejected'
export type BugState = 'reported' | 'confirmed' | 'resolved' | 'dismissed'
export type ArtifactKind = 'feature' | 'entity' | 'lifecycle' | 'actor' | 'rule' | 'parameter'

export const workspace = { name: 'acme-shop', product: 'Acme Shop' }

export const dimensions = [
  { name: 'surface', values: ['Web', 'Mobile app', 'Backoffice'] },
  { name: 'role', values: ['Guest', 'Customer', 'Admin'] },
  { name: 'market', values: ['Spain', 'Mexico'] },
  { name: 'plan', values: ['Free', 'Premium'] },
] as const

/** Rules of the current definition that the story touches. */
export const rules = {
  guestsCannotPay: { id: 'R-12', text: 'Guests cannot pay.', scope: ['role: Guest'] },
  accountOver500: { id: 'R-07', text: 'Payments over €500 require a registered account.', scope: ['role: Guest', 'role: Customer'] },
  invoiceByEmail: { id: 'R-31', text: "A guest's invoice is emailed to the address used at checkout.", scope: ['role: Guest'] },
  freeShipping: { id: 'R-04', text: 'Shipping is free above the free-shipping threshold.', scope: [] },
  paidOrderImmutable: { id: 'R-02', text: 'A paid order cannot change its amount.', scope: [] },
}

/** The proposal at the heart of the story. */
export const proposal = {
  id: 'PROP-42',
  title: 'Guests can pay with Bizum in the mobile app',
  author: 'Lucía',
  feature: 'Checkout › Payments',
  ask: 'I want guests to be able to pay with Bizum in the mobile app.',
  document: [
    'Guests abandon checkout in the app when we ask them to sign up.',
    'Bizum is the most used payment method among our mobile customers in Spain.',
    'Guests will be able to pay with Bizum only, up to €500, and get their invoice by email.',
  ],
}

export type Delta = {
  id: string
  op: 'new' | 'changed' | 'retired'
  kind: ArtifactKind
  artifact: string
  before?: string
  after: string
}

export const deltas: Delta[] = [
  { id: 'Δ1', op: 'changed', kind: 'rule', artifact: 'R-12', before: 'Guests cannot pay.', after: 'Guests can pay only with Bizum, in the mobile app.' },
  { id: 'Δ2', op: 'new', kind: 'rule', artifact: 'R-31', after: "A guest's invoice is emailed to the address used at checkout." },
  { id: 'Δ3', op: 'changed', kind: 'lifecycle', artifact: 'Order', before: 'created → paid → shipped', after: 'created → awaiting Bizum → paid → shipped' },
  { id: 'Δ4', op: 'new', kind: 'parameter', artifact: 'bizum.guest_limit', after: 'Guest Bizum limit: €500 (Spain)' },
  { id: 'Δ5', op: 'changed', kind: 'actor', artifact: 'Guest', before: 'can browse, can add to cart', after: 'can browse, can add to cart, can pay with Bizum' },
]

/** The conflict newt's gate finds in the first revision. */
export const conflict = {
  delta: 'Δ1',
  with: rules.accountOver500,
  explanation: 'Δ1 lets guests pay with Bizum with no limit, but R-07 requires an account for payments over €500. Both apply to guests in the mobile app.',
}

/** The pull request that implements PROP-42. */
export const pr = {
  number: 318,
  title: 'feat(checkout): Bizum payments for guests',
  branch: 'feat/guest-bizum',
  author: 'marc',
  file: 'src/checkout/payment.ts',
}

/** A bug reported by monitoring. */
export const bug = {
  id: 'BUG-77',
  title: 'Crash when Bizum confirmation times out (iOS)',
  source: 'Monitoring',
  occurrences: 132,
  violates: { kind: 'lifecycle' as ArtifactKind, id: 'Order' },
  scope: ['surface: Mobile app', 'market: Spain'],
  workaround: 'Ask the customer to retry from "My orders"; the order stays in "awaiting Bizum".',
}

export const releases = [
  { version: 'v2.3.0', date: 'Sep 18', changes: 4 },
  { version: 'v2.4.0', date: 'Oct 9', changes: 6 },
]

export const people = {
  product: 'Lucía',
  dev: 'Marc',
  qa: 'Ana',
  support: 'Jordi',
  sales: 'Paula',
}
