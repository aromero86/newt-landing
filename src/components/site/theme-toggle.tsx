import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
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
    <Button variant="ghost" size="icon" onClick={() => setDark(d => !d)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
