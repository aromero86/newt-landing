import { Nav } from '@/components/site/nav'
import { Footer } from '@/components/site/footer'
import Hero from '@/sections/hero'
import Problem from '@/sections/problem'
import How from '@/sections/how'
import Infographics from '@/sections/infographics'
import Screens from '@/sections/screens'
import GitHub from '@/sections/github'
import Roles from '@/sections/roles'
import OpenSource from '@/sections/open-source'

/**
 * The page, top to bottom. This is the only file that composes sections:
 * each section lives in src/sections/<name>/ and knows nothing of the others.
 */
export default function App() {
  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <How />
        <Infographics />
        <Screens />
        <GitHub />
        <Roles />
        <OpenSource />
      </main>
      <Footer />
    </div>
  )
}
