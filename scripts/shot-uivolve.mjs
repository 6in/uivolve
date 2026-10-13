/**
 * uivolve DSL / MDX ファイルを Playground に流し込んでスクリーンショットを撮る。
 * 生成したモックの目視検証用 (dev サーバーを起動しておくこと: npm run dev)。
 *
 * 使い方:
 *   node scripts/shot-uivolve.mjs <file> [out.png] [--bottom] [--base=http://localhost:5173]
 *
 * - <file> が .md / .mdx なら MDX Playground、それ以外 (.yaml / .json5) は DSL Playground に流す
 *   (<uivolve src="..."> の外部参照は Playground では読めないので、流し込む前にフェンスに展開する)
 * - --bottom はプレビューを最下部までスクロールしてから撮る (長い MDX の後半確認用)
 * - playwright-core の場所は $PLAYWRIGHT_CORE、Chromium は $UIVOLVE_CHROME で上書き可能。
 *   未指定なら ms-playwright キャッシュ (Linux / macOS) から自動検出する
 */
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)

function findPlaywrightCore() {
  const candidates = [
    process.env.PLAYWRIGHT_CORE,
    ...['playwright-core', 'playwright'].map((name) => {
      try {
        return path.dirname(require.resolve(`${name}/package.json`, { paths: [process.cwd()] }))
      } catch {
        return null
      }
    }),
    path.join(os.homedir(), '.agents/skills/playwright-skill/node_modules/playwright-core'),
  ].filter(Boolean)
  for (const dir of candidates) {
    for (const entry of ['index.mjs', 'index.js']) {
      const p = path.join(dir, entry)
      if (fs.existsSync(p)) return p
    }
  }
  throw new Error(
    'playwright-core が見つからない。$PLAYWRIGHT_CORE にパッケージのディレクトリを指定するか、npm i -D playwright-core を実行する',
  )
}

/** ms-playwright キャッシュから chromium headless shell を探す */
function findChromium() {
  if (process.env.UIVOLVE_CHROME) return process.env.UIVOLVE_CHROME
  const bases = [
    path.join(os.homedir(), '.cache/ms-playwright'), // Linux
    path.join(os.homedir(), 'Library/Caches/ms-playwright'), // macOS
  ]
  const names = new Set(['headless_shell', 'chrome-headless-shell', 'chrome'])
  for (const base of bases) {
    if (!fs.existsSync(base)) continue
    const dirs = fs
      .readdirSync(base)
      .filter((d) => d.startsWith('chromium'))
      .sort()
      .reverse()
    for (const dir of dirs) {
      // chromium_headless_shell-1208/chrome-linux/headless_shell のような 2 階層を走査
      const stack = [path.join(base, dir)]
      let depth = 0
      while (stack.length && depth < 200) {
        const cur = stack.pop()
        depth++
        for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
          const p = path.join(cur, entry.name)
          if (entry.isDirectory()) stack.push(p)
          else if (names.has(entry.name)) return p
        }
      }
    }
  }
  throw new Error(
    'Chromium が見つからない。$UIVOLVE_CHROME に実行ファイルを指定するか、npx playwright install chromium-headless-shell を実行する',
  )
}

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))
const file = args[0]
if (!file) {
  console.error('使い方: node scripts/shot-uivolve.mjs <file> [out.png] [--bottom] [--base URL]')
  process.exit(2)
}
const out = args[1] ?? `${file.replace(/\.[^.]+$/, '')}.png`
const base = flags.find((f) => f.startsWith('--base='))?.slice('--base='.length) ?? 'http://localhost:5173'
const isMdx = /\.(md|mdx|markdown)$/i.test(file)
const url = `${base.replace(/\/$/, '')}${isMdx ? '/mdx-playground/' : '/'}`
const raw = fs.readFileSync(file, 'utf8')
const source = isMdx ? inlineSrcTags(raw, path.dirname(file)) : raw

/**
 * <uivolve src="x" height=... theme=... /> を ```uivolve フェンスに展開する。
 * コードフェンス内 (タグの例示) は触らず、参照先がないものや URL はそのまま残す
 */
function inlineSrcTags(text, baseDir) {
  const expand = (line) =>
    line.replace(
      /<(?:uivolve|ExtMockup)\b([^>]*?)\bsrc=(?:"([^"]+)"|'([^']+)')([^>]*?)\/>/g,
      (m, pre, s1, s2, post) => {
        const src = s1 ?? s2
        if (/^https?:\/\//.test(src)) return m
        const target = path.resolve(baseDir, src)
        if (!fs.existsSync(target)) return m
        const attrs = `${pre} ${post}`
        const height = /\bheight=(?:"([^"]+)"|'([^']+)'|\{\s*(\d+)\s*\})/.exec(attrs)
        const theme = /\btheme=(?:"([^"]+)"|'([^']+)')/.exec(attrs)
        const meta = [
          'uivolve',
          height && `height=${height[1] ?? height[2] ?? height[3]}`,
          theme && `theme=${theme[1] ?? theme[2]}`,
        ]
          .filter(Boolean)
          .join(' ')
        const code = fs.readFileSync(target, 'utf8').replace(/\n$/, '')
        return `\`\`\`${meta}\n${code}\n\`\`\``
      },
    )
  let marker = null
  return text
    .split('\n')
    .map((line) => {
      const m = /^ {0,3}(`{3,}|~{3,})/.exec(line)
      if (marker === null && m) marker = m[1][0]
      else if (marker !== null && m && m[1][0] === marker) marker = null
      else if (marker === null) return expand(line)
      return line
    })
    .join('\n')
}

const { chromium } = await import(pathToFileURL(findPlaywrightCore()).href)
const browser = await chromium.launch({ executablePath: findChromium() })
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } })
const problems = []
page.on('console', (m) => {
  if (m.type() === 'error') problems.push(`console: ${m.text()}`)
})
page.on('pageerror', (e) => problems.push(`pageerror: ${e}`))

await page.goto(url, { waitUntil: 'networkidle' })
// Playground が公開する検証フック (window.__uivolve.setCode) 経由で流し込む
await page.waitForFunction(() => !!window.__uivolve, undefined, { timeout: 15000 })
await page.evaluate((code) => window.__uivolve.setCode(code), source)
await page.waitForTimeout(isMdx ? 3000 : 1500)

if (flags.includes('--bottom')) {
  await page.evaluate(() => {
    const p = document.querySelector('.mdxpg-preview, .pg-preview')
    if (p) p.scrollTop = p.scrollHeight
  })
  await page.waitForTimeout(1000)
}

const status = (await page.textContent('.pg-status-msg'))?.trim() ?? '(ステータス不明)'
await page.screenshot({ path: out })
await browser.close()

console.log(`screenshot: ${out}`)
console.log(`status:     ${status}`)
if (problems.length) {
  console.log('problems:')
  for (const p of problems) console.log(`  ${p}`)
}
const ok = status.startsWith('✓') && !problems.some((p) => p.startsWith('pageerror'))
process.exit(ok ? 0 : 1)
