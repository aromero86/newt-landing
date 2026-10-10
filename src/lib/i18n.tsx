import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Two languages, chosen like this: the visitor's own choice if they made one,
 * otherwise the browser's language (Spanish if any of its languages is Spanish),
 * otherwise English. Texts live next to the component that shows them, in both
 * languages at once: t({ en: '…', es: '…' }).
 */
export type Lang = 'en' | 'es'

/** A value in both languages. */
export type Bi<T = string> = { en: T; es: T }

const STORAGE_KEY = 'newt-lang'

/** The page's title and description in each language. */
const META: Record<Lang, { title: string; description: string }> = {
  en: {
    title: 'newt — the living definition of your product',
    description: "newt keeps your product's rules, entities and permissions in one living definition: versioned like code, never contradictory, and checked on every pull request.",
  },
  es: {
    title: 'newt — la definición viva de tu producto',
    description: 'newt guarda las rules, entities y permisos de tu producto en una única definición viva: versionada como el código, sin contradicciones y comprobada en cada pull request.',
  },
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    // Storage may be unavailable (private mode): fall back to the browser.
  }
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return languages.some(l => l?.toLowerCase().startsWith('es')) ? 'es' : 'en'
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The choice still applies for this visit.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = META[lang].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', META[lang].description)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) throw new Error('useLang must be used inside <LangProvider>')
  return context
}

/** Picks the current language from a bilingual value: t({ en: 'Hello', es: 'Hola' }). */
export function useT() {
  const { lang } = useLang()
  return useCallback(<T,>(value: Bi<T>): T => value[lang], [lang])
}
