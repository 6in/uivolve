import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import remarkSimilarExtjs from '@similar-extjs/remark-mock'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkSimilarExtjs],
    }),
  ],
})
