import { Button } from '@/components/ui/button'
import { REPO_URL } from '@/lib/links'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { GithubMark } from './icons'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#github', label: 'GitHub' },
  { href: '#roles', label: 'For your team' },
  { href: '#open-source', label: 'Open source' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="newt home">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <a key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" variant="outline">
            <a href={REPO_URL}>
              <GithubMark className="size-4" /> <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
