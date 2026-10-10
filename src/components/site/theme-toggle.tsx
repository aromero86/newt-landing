import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n'

export function ThemeToggle() {
  const t = useT()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('newt-theme', dark ? 'dark' : 'light')
    } catch {
      // Storage may be unavailable (private mode): the toggle still works for this visit.
    }
  }, [dark])

  return (
    <Button variant="ghost" size="icon" onClick={() => setDark(d => !d)} aria-label={dark ? t({ en: 'Switch to light theme', es: 'Cambiar a tema claro' }) : t({ en: 'Switch to dark theme', es: 'Cambiar a tema oscuro' })}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
