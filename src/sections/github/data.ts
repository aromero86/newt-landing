/**
 * The GitHub side of the shared story (src/lib/data.ts): the pull requests,
 * diffs and releases the scenes show. Same people, same rules, same numbers.
 * The shared story itself comes from useStory(); this file holds only what is
 * this section's own. Texts come in both languages; code and ids don't.
 */
import type { Bi } from '@/lib/i18n'

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
  title: { en: 'feat(checkout): returning guests can save a card', es: 'feat(checkout): los invitados que repiten pueden guardar una tarjeta' } as Bi,
  proposal: {
    id: 'PROP-45',
    title: { en: 'Returning guests can save a card', es: 'Los invitados que repiten pueden guardar una tarjeta' } as Bi,
  },
}

/** A PR with no proposal that changes how the product behaves. */
export const behaviorPr = {
  number: 324,
  title: { en: "fix(backoffice): support can edit a paid order's amount", es: 'fix(backoffice): soporte puede editar el importe de un pedido pagado' } as Bi,
  declared: 'fix',
  /** Which rule of the story it breaks (a key of story.rules). */
  breaks: 'paidOrderImmutable' as const,
  drafted: {
    id: 'PROP-47',
    title: { en: 'Support can correct the amount of a paid order', es: 'Soporte puede corregir el importe de un pedido pagado' } as Bi,
  },
}

/** A PR with no proposal that changes nothing a customer could notice. */
export const technicalPr = {
  number: 325,
  title: { en: 'refactor(payments): extract the gateway client', es: 'refactor(payments): extraer el cliente de la pasarela' } as Bi,
}

/** The hotfix that cannot wait for product. */
export const hotfixPr = {
  number: 326,
  title: { en: 'hotfix(checkout): cancel orders stuck awaiting Bizum', es: 'hotfix(checkout): cancelar los pedidos atascados esperando a Bizum' } as Bi,
  reason: {
    en: 'Crash in production: 132 occurrences in the last hour (BUG-77).',
    es: 'Fallo grave en producción: 132 ocurrencias en la última hora (BUG-77).',
  } as Bi,
  drafted: {
    id: 'PROP-48',
    title: { en: 'Orders awaiting Bizum are cancelled after 15 minutes', es: 'Los pedidos que esperan a Bizum se cancelan a los 15 minutos' } as Bi,
  },
}

/** The release the last scene publishes. */
export const releaseVersion = 'v2.4.0'
