import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      input: {
        console: 'console.html',
        presenter: 'presenter.html'
      },
      external: ['electron'],
    },
  },
  plugins: [svelte()]
})
