import { useMemo } from 'react'
import { dimensions, useStory } from '@/lib/data'
import { useT } from '@/lib/i18n'

const opLabel = {
  new: { en: 'new', es: 'nuevo' },
  changed: { en: 'changed', es: 'cambiado' },
  retired: { en: 'retired', es: 'retirado' },
} as const

/**
 * The shared story (`useStory`) plus the two helpers this section needs: a
 * rule's text by id, and a dimension chip written with its English name and
 * value, shown in the visitor's language.
 */
export function useRolesStory() {
  const story = useStory()
  const t = useT()
  return useMemo(() => {
    // By id, the current definition: guestsPayBizum is R-12 *after* PROP-42, not what R-12 says today.
    const { guestsPayBizum: _planned, ...current } = story.rules
    const rulesById = new Map(Object.values(current).map(r => [r.id, r.text]))
    return {
      ...story,
      deltas: story.deltas.map(d => ({ ...d, opLabel: t(opLabel[d.op]) })),
      rule: (id: string) => rulesById.get(id) ?? id,
      dimension: (name: string, value: string) => {
        const i = dimensions.findIndex(d => d.name === name)
        if (i === -1) return { name, value: value === 'any' ? t({ en: 'any', es: 'cualquiera' }) : value }
        const j = (dimensions[i].values as readonly string[]).indexOf(value)
        const translated = story.dimensions[i]
        return {
          name: translated.name,
          value: j === -1 ? (value === 'any' ? t({ en: 'any', es: 'cualquiera' }) : value) : translated.values[j],
        }
      },
    }
  }, [story, t])
}
