/**
 * VSCode 拡張のビルド。esbuild で 2 本のバンドルを作る:
 * - dist/extension.cjs — extension host 側 (Node、vscode モジュールは external)
 * - dist/webview.js + dist/webview.css — Webview 側 (React + core + mdx。
 *   フォントは data URI にインライン化して自己完結にする)。
 *   ESM + コード分割で、図・表フェンスの描画ライブラリ (mermaid / echarts / vega など) は
 *   dist/chunks/ に分け、使うときだけ読み込む (オフラインでも動くよう VSIX に同梱)
 */
import fs from 'node:fs'
import esbuild from 'esbuild'

// 分割チャンクはハッシュ付きの名前なので、古いものが dist に残って VSIX に混ざらないよう消す
fs.rmSync('dist', { recursive: true, force: true })

await esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  external: ['vscode'],
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  minify: true,
  outfile: 'dist/extension.cjs',
  logLevel: 'info',
})

await esbuild.build({
  entryPoints: [{ in: 'webview/main.tsx', out: 'webview' }],
  bundle: true,
  format: 'esm',
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: {
    '.woff2': 'dataurl',
    '.woff': 'dataurl',
    '.ttf': 'dataurl',
    '.eot': 'dataurl',
    '.svg': 'dataurl',
  },
  outdir: 'dist',
  logLevel: 'info',
})
