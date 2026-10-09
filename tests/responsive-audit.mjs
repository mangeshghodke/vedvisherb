/**
 * Real-browser responsive audit.
 *
 * Serves the production build and measures every page at phone, tablet and
 * desktop widths: horizontal overflow, elements narrower than 375px, tap
 * targets under 44px, and console errors.
 *
 *   node tests/responsive-audit.mjs
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const DIST = path.resolve('dist')
const PORT = 4399

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

const server = http.createServer((req, res) => {
  // Files live at the dist root, but the app is served under the /vedvisherb
  // base path and BrowserRouter is configured with that basename. Strip the
  // prefix to resolve files; the browser must KEEP it so routing matches.
  let url = decodeURIComponent(req.url.split('?')[0])
  if (url.startsWith('/vedvisherb')) url = url.slice('/vedvisherb'.length) || '/'

  let file = path.join(DIST, url)
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIST, 'index.html')
  }
  const type = MIME[path.extname(file)] ?? 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': type })
  fs.createReadStream(file).pipe(res)
})

const BASE_PATH = '/vedvisherb'

// Covers small phones through ultrawide and TV. A 4:3 tablet and a foldable
// are included because they expose width-dependent layouts the phone range does
// not (the nav switches to its desktop variant at the md breakpoint, 768px).
const VIEWPORTS = [
  { name: 'iphone-se', width: 320, height: 568 },
  { name: 'phone', width: 375, height: 812 },
  { name: 'phone-lg', width: 430, height: 932 },
  { name: 'fold-open', width: 540, height: 720 },
  { name: 'tablet-4x3', width: 768, height: 1024 },
  { name: 'tablet-portrait', width: 834, height: 1112 },
  { name: 'tablet-land', width: 1024, height: 768 },
  { name: 'laptop-sm', width: 1280, height: 800 },
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'desktop-lg', width: 1920, height: 1080 },
  { name: 'ultrawide', width: 2560, height: 1080 },
  { name: 'tv', width: 3840, height: 2160 },
]

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/products', name: 'products' },
  { path: '/product/3', name: 'detail' },
  { path: '/dashboard', name: 'dashboard' },
]

// supabase-js names its session key `sb-<project-ref>-auth-token`, where the
// ref comes from the project URL host. Using the wrong key silently leaves the
// dashboard on its loading spinner, so read the real one from .env.
function projectRef() {
  try {
    const env = fs.readFileSync('.env', 'utf8')
    const url = env.match(/^VITE_SUPABASE_URL=(.*)$/m)?.[1]?.trim()
    return new URL(url).hostname.split('.')[0]
  } catch {
    return 'localhost'
  }
}

const REF = projectRef()
const SESSION_KEY = `sb-${REF}-auth-token`

// The dashboard only renders its table once a session exists, so inject one
// for that route; otherwise the audit only ever measures the login screen.
const FAKE_SESSION = {
  access_token: 'fake.jwt.token',
  refresh_token: 'fake-refresh',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: { id: 'test', aud: 'authenticated', email: 'audit@example.com' },
}

await new Promise((r) => server.listen(PORT, r))
const browser = await chromium.launch()

let failures = 0

const FIXTURE_PRODUCTS = [
  {
    id: 3, slug: null, name: 'Kumkumadi Facial Gel',
    tagline: 'Glow & Clear Skin', category: 'Skincare', price: 350, weight: '50g',
    description: 'Reduces acne, pimple, and facial tanning with a gentle herbal formula.',
    long_description: 'A long description that runs on for a little while so we can see how the detail page wraps text on a narrow phone screen without pushing anything sideways.',
    how_to_use: 'Apply twice daily.', benefits: ['Reduces acne', 'Removes tanning', 'Brings glow'],
    ingredients: ['Saffron', 'Sandalwood', 'Turmeric'], image: 'IMG-20260713-WA0009.jpg',
    rating: 4.8, reviews: 12, sort_order: 0, published: true,
  },
  {
    id: 4, slug: null, name: 'Kumkumadi Gel with 24K Gold',
    tagline: 'Gold-Infused Glow', category: 'Skincare', price: 400, weight: '50g | 25g - ₹200',
    description: 'Gold-infused gel for radiance.',
    long_description: 'Second product so the dashboard table has more than one row to measure.',
    how_to_use: 'Apply at night.', benefits: ['Glow', 'Anti-aging'], ingredients: ['24K Gold', 'Saffron'],
    image: 'IMG-20260713-WA0010.jpg', rating: 4.9, reviews: 8, sort_order: 1, published: true,
  },
  {
    id: 5, slug: null, name: 'Herbal Hair Oil',
    tagline: 'Hair Care', category: 'Oils', price: 329, weight: '200ml',
    description: 'Deeply nourishing hair oil with 21, 36 and 51 herb variants.',
    long_description: 'Third row.',
    how_to_use: 'Massage into scalp.', benefits: ['Reduces hair fall'], ingredients: ['Bhringraj', 'Amla'],
    image: 'IMG-20260713-WA0017.jpg', rating: 4.7, reviews: 0, sort_order: 2, published: true,
  },
]

/** Stub Supabase so the real dashboard renders without credentials. */
async function stubSupabase(ctx) {
  await ctx.route('**/auth/v1/user**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'test', aud: 'authenticated', email: 'audit@example.com',
        app_metadata: {}, user_metadata: {},
      }),
    })
  )
  await ctx.route('**/rest/v1/products**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FIXTURE_PRODUCTS),
    })
  )
}

for (const vp of VIEWPORTS) {
  for (const page of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.width < 768,
      hasTouch: vp.width < 768,
      deviceScaleFactor: 1,
    })

    await stubSupabase(ctx)

    if (page.name === 'dashboard') {
      await ctx.addInitScript(
        ({ key, session }) => {
          localStorage.setItem(key, JSON.stringify(session))
        },
        { key: SESSION_KEY, session: FAKE_SESSION }
      )
    }

    const tab = await ctx.newPage()
    const errors = []
    tab.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 120))
    })
    tab.on('pageerror', (e) => errors.push(`pageerror: ${String(e).slice(0, 120)}`))

    await tab.goto(`http://localhost:${PORT}${BASE_PATH}${page.path}`, {
      waitUntil: 'networkidle',
    })
    await tab.waitForTimeout(600)

    const result = await tab.evaluate(() => {
      const doc = document.documentElement
      const clientW = doc.clientWidth
      const overflow = doc.scrollWidth - clientW

      // Always collect offenders, not only when scrollWidth grew. The site sets
      // body{overflow-x:hidden}, which hides real overflow from scrollWidth.
      const offenders = []
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed') continue
        // Ignore anything inside a clipping ancestor.
        let clippedByAncestor = false
        for (let p = el.parentElement; p; p = p.parentElement) {
          const pcs = getComputedStyle(p)
          if (pcs.overflowX !== 'visible') { clippedByAncestor = true; break }
        }
        if (clippedByAncestor) continue
        if (r.right > clientW + 1) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 70),
            right: Math.round(r.right),
            by: Math.round(r.right - clientW),
          })
        }
      }

      // Interactive elements that are too small to tap reliably.
      // 24x24 is the WCAG 2.2 AA floor (SC 2.5.8); Apple's HIG suggests 44x44.
      // Only the WCAG floor is treated as a failure; the rest are advisories.
      const small = []
      const tiny = []
      for (const el of document.querySelectorAll(
        'a, button, input, select, textarea, [role=button]'
      )) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none') continue

        // An inline link inside a paragraph is not a standalone tap target.
        const inlineInProse =
          el.tagName === 'A' &&
          el.closest('p, li') !== null &&
          cs.display === 'inline'

        const rec = {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 28),
          w: Math.round(r.width),
          h: Math.round(r.height),
        }

        if (r.height < 24 || r.width < 24) tiny.push(rec)
        else if (!inlineInProse && (r.height < 44 || r.width < 44)) small.push(rec)
      }

      const clipped = []
      for (const el of document.querySelectorAll('h1, h2, h3, p, span, a, button, td, th')) {
        if (el.children.length) continue
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === 'visible') {
          clipped.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 32),
            scrollW: el.scrollWidth,
            clientW: el.clientWidth,
          })
        }
      }

      return {
        overflow,
        clientW,
        offenders: offenders.slice(0, 6),
        offenderCount: offenders.length,
        small: small.slice(0, 6),
        smallCount: small.length,
        tiny: tiny.slice(0, 6),
        tinyCount: tiny.length,
        clipped: clipped.slice(0, 6),
        clippedCount: clipped.length,
        hasTable: !!document.querySelector('table'),
        hasLogin: !!document.querySelector('input[type="password"]'),
        // Guard against a false pass: a blank page has nothing to overflow, so
        // an earlier version of this audit reported PASS on empty documents.
        renderedNodes: document.getElementById('root')?.children.length ?? 0,
        textLength: (document.body.innerText || '').trim().length,
      }
    })

    const label = `${vp.name.padEnd(16)} ${page.name.padEnd(10)}`
    const issues = []
    const advisories = []

    // Hard failures: things that break the page or breach WCAG 2.2 AA.
    if (result.renderedNodes === 0) issues.push('BLANK PAGE — React did not mount')
    else if (result.textLength < 40)
      issues.push(`suspiciously little text (${result.textLength} chars)`)
    if (result.overflow > 1) issues.push(`horizontal scroll +${result.overflow}px`)
    if (result.offenderCount > 0) issues.push(`${result.offenderCount} elements past viewport`)
    if (result.tinyCount > 0) issues.push(`${result.tinyCount} below WCAG 24px`)
    if (result.clippedCount > 0) issues.push(`${result.clippedCount} clipped text`)
    if (errors.length) issues.push(`${errors.length} console errors`)

    // Advisory only: between the WCAG 24px floor and Apple's 44px suggestion.
    if (result.smallCount > 0) advisories.push(`${result.smallCount} targets 24–44px`)

    if (issues.length === 0) {
      const note = advisories.length ? `  (advisory: ${advisories[0]})` : ''
      console.log(`PASS  ${label}${note}`)
    } else {
      failures++
      console.log(`FAIL  ${label}  ${issues.join(', ')}`)

      for (const o of result.offenders) {
        console.log(`        +${o.by}px <${o.tag}> [${o.cls}]`)
      }
      for (const s of result.tiny) {
        console.log(`        WCAG FAIL: <${s.tag}> "${s.text}" ${s.w}x${s.h}`)
      }
      for (const c of result.clipped) {
        console.log(`        clipped: <${c.tag}> "${c.text}" ${c.scrollW}>${c.clientW}`)
      }
      for (const e of errors) console.log(`        console: ${e}`)
    }

    await ctx.close()
  }
}

await browser.close()
server.close()

console.log(
  failures === 0
    ? '\nAll pages clean at every width.'
    : `\n${failures} page/viewport combination(s) have issues.`
)
process.exit(failures === 0 ? 0 : 1)