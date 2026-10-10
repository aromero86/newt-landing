import { Button } from '@/components/ui/button'
import { REPO_URL } from '@/lib/links'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { LangToggle } from './lang-toggle'
import { GithubMark } from './icons'
import { useT, type Bi } from '@/lib/i18n'

const links: { href: string; label: Bi }[] = [
  { href: '#how', label: { en: 'How it works', es: 'Cómo funciona' } },
  { href: '#github', label: { en: 'GitHub', es: 'GitHub' } },
  { href: '#roles', label: { en: 'For your team', es: 'Para tu equipo' } },
  { href: '#open-source', label: { en: 'Open source', es: 'Open source' } },
]

export function Nav() {
  const t = useT()
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label={t({ en: 'newt home', es: 'Inicio de newt' })}>
          <Logo />
        </a>
        <nav aria-label={t({ en: 'Main', es: 'Principal' })} className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <a key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t(l.label)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LangToggle />
          <ThemeToggle />
          <Button asChild size="sm" variant="outline">
            <a href={REPO_URL}>
              <GithubMark className="size-4" /> <span className="hidden sm:inline">{t({ en: 'Star on GitHub', es: 'Estrella en GitHub' })}</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
