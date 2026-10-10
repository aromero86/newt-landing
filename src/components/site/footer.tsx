import { REPO_URL } from '@/lib/links'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Logo className="text-foreground" />
          <span>The living definition of your product.</span>
        </div>
        <div className="flex gap-5">
          <a href={REPO_URL} className="hover:text-foreground">GitHub</a>
          <a href="#quickstart" className="hover:text-foreground">Quickstart</a>
          <a href="#top" className="hover:text-foreground">Back to top</a>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-xs text-muted-foreground/70">
        newt is in early development. Screens on this page are design previews, not the final product.
      </p>
    </footer>
  )
}
