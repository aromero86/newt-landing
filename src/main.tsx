import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App'
import { LangProvider } from './lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* "user": every motion animation follows the visitor's reduced-motion setting. */}
    <MotionConfig reducedMotion="user">
      <LangProvider>
        <App />
      </LangProvider>
    </MotionConfig>
  </StrictMode>,
)
