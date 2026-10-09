import fs from 'node:fs'
import path from 'node:path'

const dir = 'public/images'
const out = 'src/data/imageLibrary.js'

const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
  .filter((f) => !/^logo\./i.test(f))
  .sort()

const body =
  '// Auto-generated from public/images — regenerate with: npm run images:index\n' +
  '// Excludes logo files; add new product photos to public/images then re-run.\n' +
  'export default [\n' +
  files.map((f) => `  '${f}',`).join('\n') +
  '\n]\n'

fs.writeFileSync(path.resolve(out), body)
console.log(`Wrote ${out} with ${files.length} product images.`)