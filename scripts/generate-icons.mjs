/**
 * Regenerates the favicon set from the brand logo.
 *
 *   node scripts/generate-icons.mjs
 *
 * Run this after replacing public/images/logo.jpeg. Requires Pillow:
 *   pip install Pillow
 *
 * Set PYTHON=/path/to/python if it is not on PATH.
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const SRC = path.resolve('public/images/logo.jpeg')
// Fall back to whatever `python3` is on PATH; the user can override with PYTHON.
const PY = process.env.PYTHON || 'python3'

if (!fs.existsSync(SRC)) {
  console.error(`Missing ${path.relative(process.cwd(), SRC)}`)
  process.exit(1)
}

const script = `
from PIL import Image

src = Image.open(${JSON.stringify(SRC)}).convert('RGB')
print('source:', src.size)

# favicon.ico with the sizes browsers actually request.
src.save('public/favicon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48)])

# iOS ignores favicon.ico and requires PNG.
src.resize((180,180), Image.LANCZOS).save('public/apple-touch-icon.png', 'PNG')
print('done')
`

const res = spawnSync(PY, ['-c', script], { encoding: 'utf8' })
if (res.status !== 0) {
  console.error(res.stderr || 'Pillow is not available')
  console.error('Install it with: pip install Pillow')
  process.exit(1)
}

process.stdout.write(res.stdout)

for (const f of ['public/favicon.ico', 'public/apple-touch-icon.png']) {
  const kb = (fs.statSync(f).size / 1024).toFixed(1)
  console.log(`  ${f}  ${kb} KB`)
}