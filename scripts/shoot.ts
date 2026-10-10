/**
 * Screenshots of the landing through Chrome DevTools Protocol: for each shot,
 * scroll to a selector (or a y), wait, capture. Several captures per shot show
 * whether animations play.
 *
 *   bun scripts/shoot.ts <url> <outDir> <shots.json>
 *   shots.json: [{ "name": "hero", "selector": "#hero", "times": [300, 2500], "width": 1440, "height": 900, "offset": 0, "dark": true }]
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

type Shot = { name: string; reduced?: boolean; scrollThrough?: boolean; selector?: string; y?: number; offset?: number; times: number[]; width: number; height: number; light?: boolean; fullPage?: boolean }

const [url, outDir, shotsFile] = Bun.argv.slice(2)
if (!url || !outDir || !shotsFile) throw new Error('usage: shoot.ts <url> <outDir> <shots.json>')
const shots: Shot[] = await Bun.file(shotsFile).json()
await mkdir(outDir, { recursive: true })

const port = 9333 + Math.floor(Math.random() * 500)
const chrome = Bun.spawn(['/usr/bin/chromium', '--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--hide-scrollbars', '--user-data-dir=/tmp/claude-1000/newt-landing-chrome-' + port, 'about:blank'], { stdout: 'ignore', stderr: 'ignore' })

async function target(): Promise<string> {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json() as { type: string; webSocketDebuggerUrl: string }[]
      const page = list.find(t => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch { /* not up yet */ }
    await Bun.sleep(150)
  }
  throw new Error('chrome did not start')
}

const ws = new WebSocket(await target())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let seq = 0
const pending = new Map<number, (v: any) => void>()
ws.addEventListener('message', e => {
  const msg = JSON.parse(String(e.data))
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)!(msg.result ?? msg.error); pending.delete(msg.id) }
})
const send = (method: string, params: object = {}) => new Promise<any>(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })) })
const evaluate = (expression: string) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })

await send('Page.enable')
for (const shot of shots) {
  await send('Emulation.setDeviceMetricsOverride', { width: shot.width, height: shot.height, deviceScaleFactor: 1, mobile: shot.width < 600 })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: shot.reduced ? 'reduce' : 'no-preference' }] })
  await send('Page.navigate', { url })
  await Bun.sleep(1200)
  await evaluate(`document.documentElement.style.scrollBehavior='auto'; ${shot.light ? "document.documentElement.classList.remove('dark')" : ''}`)
  if (shot.scrollThrough) {
    // Reveal everything that animates in on scroll before a full-page capture.
    await evaluate(`(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); })()`)
  }
  if (shot.selector) {
    await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(shot.selector)}); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + ${shot.offset ?? 0}); })()`)
  } else if (shot.y !== undefined) {
    await evaluate(`window.scrollTo(0, ${shot.y})`)
  }
  // A page wider than the viewport means something overflows horizontally.
  const widths = (await evaluate(`JSON.stringify({ page: document.documentElement.scrollWidth, viewport: window.innerWidth, wide: [...document.querySelectorAll('main section')].filter(s => s.scrollWidth > window.innerWidth).map(s => s.id) })`)).result.value
  console.log(`${shot.name}: ${widths}`)
  let last = 0
  for (const t of shot.times) {
    await Bun.sleep(t - last)
    last = t
    const params: any = { format: 'png' }
    if (shot.fullPage) {
      const h = (await evaluate('document.documentElement.scrollHeight')).result.value
      params.clip = { x: 0, y: 0, width: shot.width, height: h, scale: 1 }
      params.captureBeyondViewport = true
    }
    const { data } = await send('Page.captureScreenshot', params)
    const file = join(outDir, `${shot.name}-${t}ms.png`)
    await Bun.write(file, Buffer.from(data, 'base64'))
    console.log(file)
  }
}
ws.close()
chrome.kill()
