/**
 * 配布用スキル (skills/uivolve-mock/references/) に自動生成リファレンスを同期する。
 * npm run docs / npm run schema の後段で自動実行される (単体実行も可)。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destDir = path.join(root, 'skills/uivolve-mock/references')

const files = ['reference/components.md', 'reference/dsl.schema.json']
fs.mkdirSync(destDir, { recursive: true })
for (const rel of files) {
  const dest = path.join(destDir, path.basename(rel))
  fs.copyFileSync(path.join(root, rel), dest)
  console.log(`synced: ${rel} -> ${path.relative(root, dest)}`)
}
