import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import remarkUivolve from '@uivolve/remark-mock'
import { defineConfig } from 'astro/config'

export default defineConfig({
  // GitHub Pages のサブパス配信用 (.github/workflows/pages.yml が設定する)
  base: process.env.PAGES_BASE,
  outDir: process.env.PAGES_OUT ?? './dist',
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkUivolve],
    }),
  ],
})
