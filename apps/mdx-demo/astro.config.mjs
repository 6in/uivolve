import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import remarkUivolve from '@uivolve/remark-mock'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkUivolve],
    }),
  ],
})
