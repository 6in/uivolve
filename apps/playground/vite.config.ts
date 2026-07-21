import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // vite はこのパッケージのディレクトリで実行されるため相対パスで解決できる
        main: 'index.html',
        // MDX Playground (MDX 全体を貼り付けてプレビューするページ)
        'mdx-playground': 'mdx-playground/index.html',
      },
    },
  },
})
