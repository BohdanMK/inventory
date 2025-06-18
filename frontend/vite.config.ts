import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vueI18n from 'unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [
      vue(),
      tailwindcss(),
      vueI18n({
        include: path.resolve(__dirname, './src/locales/**')
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})