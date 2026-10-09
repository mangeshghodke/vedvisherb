/**
 * Validates supabase/seed.sql against the schema declared in schema.sql.
 *
 * The previous seed emitted every literal as a quoted string, which made
 * Postgres infer the VALUES columns as text and fail with
 * "operator does not exist: integer = text". This checks each literal's type
 * per column so that cannot slip through again.
 */
import fs from 'node:fs'

const sql = fs.readFileSync('supabase/seed.sql', 'utf8')
const schema = fs.readFileSync('supabase/schema.sql', 'utf8')

let failures = 0
const check = (name, cond, extra = '') => {
  if (!cond) failures++
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`)
}

// --- 1. Values alias must contain NAMES ONLY ----------------------------
// Postgres does not accept typed column aliases ("as v (name text, ...)") —
// that is a syntax error. Types belong on the literals as ::casts.
const aliasBlock = sql.match(/\) as v \(([\s\S]*?)\n\)/)
check('VALUES alias present', !!aliasBlock)
const aliasNames = aliasBlock[1]
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
check('alias has 15 columns', aliasNames.length === 15, `got ${aliasNames.length}`)
check(
  'alias contains names only (no types)',
  aliasNames.every((c) => /^\w+$/.test(c)),
  aliasNames.filter((c) => !/^\w+$/.test(c)).join(', ')
)

// --- 2. Alias names must match the table columns, in order -------------
const tableCols = {}
const tableBody = schema.match(/create table if not exists public\.products \(([\s\S]*?)\n\);/)
for (const line of tableBody[1].split('\n')) {
  const m = line.trim().match(/^(\w+)\s+([a-z]+(?:\([\d, ]+\))?(?:\[\])?)/i)
  if (m) tableCols[m[1]] = m[2].toLowerCase()
}
check('parsed table columns', Object.keys(tableCols).length >= 15, `${Object.keys(tableCols).length} found`)

const insertCols = sql
  .match(/insert into public\.products \(([\s\S]*?)\n\)/)[1]
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

check('insert list matches alias list', JSON.stringify(insertCols) === JSON.stringify(aliasNames))
check(
  'alias names match table columns in order',
  insertCols.every((c) => tableCols[c]),
  insertCols.filter((c) => !tableCols[c]).join(', ')
)

// Expected type per column, derived from the table definition.
const expectedType = (col) => {
  const t = normalize(tableCols[col] ?? '')
  if (t.endsWith('[]')) return 'text[]'
  if (t === 'numeric') return 'numeric'
  if (t === 'integer') return 'integer'
  if (t === 'boolean') return 'boolean'
  return 'text'
}

// --- 3. Extract row tuples by scanning balanced parens ------------------
// Rows can span many lines because long descriptions contain literal newlines,
// so splitting on newlines gives the wrong count.
const valuesBlock = sql.match(/from \(values\n([\s\S]*?)\n\) as v \(/)[1]

const tuples = []
let depth = 0
let inQ = false
let start = -1
for (let i = 0; i < valuesBlock.length; i++) {
  const c = valuesBlock[i]
  if (c === "'") {
    if (inQ && valuesBlock[i + 1] === "'") {
      i++
      continue
    }
    inQ = !inQ
    continue
  }
  if (inQ) continue
  if (c === '(') {
    if (depth === 0) start = i + 1
    depth++
  } else if (c === ')') {
    depth--
    if (depth === 0) tuples.push(valuesBlock.slice(start, i))
  }
}

function splitTopLevel(inner) {
  const out = []
  let depth = 0
  let inQ = false
  let cur = ''
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    if (c === "'") {
      if (inQ && inner[i + 1] === "'") {
        cur += "''"
        i++
        continue
      }
      inQ = !inQ
      cur += c
      continue
    }
    if (!inQ) {
      // Track () and [] so commas inside array[...] literals are not treated
      // as column separators.
      if (c === '(' || c === '[') depth++
      else if (c === ')' || c === ']') depth--
      else if (c === ',' && depth === 0) {
        out.push(cur.trim())
        cur = ''
        continue
      }
    }
    cur += c
  }
  out.push(cur.trim())
  return out
}

check('13 rows emitted', tuples.length === 13, `got ${tuples.length}`)

const normalize = (t) => t.replace(/\(.*\)/, '').trim().toLowerCase()

let typeErrors = 0
let castErrors = 0
tuples.forEach((t, ri) => {
  const vals = splitTopLevel(t)
  if (vals.length !== aliasNames.length) {
    console.log(`  row ${ri}: ${vals.length} values, expected ${aliasNames.length}`)
    typeErrors++
    return
  }
  vals.forEach((v, ci) => {
    const col = aliasNames[ci]
    const want = expectedType(col)

    // Every literal must carry an explicit ::type cast, otherwise Postgres
    // infers text and the sort_order comparison fails. Use [\s\S] because
    // several descriptions contain literal newlines.
    const m = v.match(/^([\s\S]*)::([a-z]+(?:\[\])?)$/i)
    if (!m) {
      console.log(`  row ${ri} col ${col}: missing ::cast  (${v.slice(0, 40)})`)
      castErrors++
      return
    }
    const gotType = m[2].toLowerCase()
    if (gotType !== want) {
      console.log(`  row ${ri} col ${col}: cast ::${gotType}, table wants ::${want}`)
      castErrors++
      return
    }

    const literal = m[1]
    const ok =
      want === 'text'
        ? /^'/.test(literal)
        : want.endsWith('[]')
          ? /^array\[/.test(literal)
          : want === 'boolean'
            ? /^(true|false)$/.test(literal)
            : /^-?\d+(\.\d+)?$/.test(literal)

    if (!ok) {
      console.log(`  row ${ri} col ${col} (${want}): literal ${literal.slice(0, 45)}`)
      typeErrors++
    }
  })
})
check('every literal matches its column type', typeErrors === 0, `${typeErrors} mismatches`)
check('every literal carries a correct ::cast', castErrors === 0, `${castErrors} bad casts`)

// --- 4. Structural sanity -----------------------------------------------
let quoteOpen = false
for (let i = 0; i < sql.length; i++) {
  if (sql[i] === "'") {
    if (quoteOpen && sql[i + 1] === "'") {
      i++
      continue
    }
    quoteOpen = !quoteOpen
  }
}
check('quotes balanced', !quoteOpen)
check('no ON CONFLICT (needs a unique constraint we do not have)', !/on conflict/i.test(sql))
check('WHERE NOT EXISTS guard present', /where not exists/i.test(sql))

console.log(
  failures === 0 ? '\nseed.sql is valid.' : `\n${failures} check(s) FAILED.`
)
process.exit(failures === 0 ? 0 : 1)