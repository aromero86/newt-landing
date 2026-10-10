import { REPO_URL } from '@/lib/links'
import { Logo } from './logo'
import { useT } from '@/lib/i18n'

export function Footer() {
  const t = useT()
  return (
    <footer className="border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Logo className="text-foreground" />
          <span>{t({ en: 'The living definition of your product.', es: 'La definición viva de tu producto.' })}</span>
        </div>
        <div className="flex gap-5">
          <a href={REPO_URL} className="hover:text-foreground">GitHub</a>
          <a href="#quickstart" className="hover:text-foreground">{t({ en: 'Quickstart', es: 'Empezar' })}</a>
          <a href="#top" className="hover:text-foreground">{t({ en: 'Back to top', es: 'Volver arriba' })}</a>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-xs text-muted-foreground/70">
        {t({
          en: 'newt is in early development. Screens on this page are design previews, not the final product.',
          es: 'newt está en una fase temprana de desarrollo. Las pantallas de esta página son avances de diseño, no el producto final.',
        })}
      </p>
    </footer>
  )
}
