import { defineConfig } from 'vite'
import * as graphqlPlugin from 'vite-plugin-graphql'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), graphqlPlugin],
  sourcemap: true,
})
