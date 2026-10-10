import { useLang, type Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: 'en', label: 'EN', name: 'English' },
  { lang: 'es', label: 'ES', name: 'Español' },
]

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Language / Idioma" className="flex items-center rounded-md border p-0.5 text-xs font-medium">
      {OPTIONS.map(option => (
        <button
          key={option.lang}
          type="button"
          lang={option.lang}
          aria-label={option.name}
          aria-pressed={lang === option.lang}
          onClick={() => setLang(option.lang)}
          className={cn(
            'rounded px-2 py-1 transition-colors',
            lang === option.lang ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
