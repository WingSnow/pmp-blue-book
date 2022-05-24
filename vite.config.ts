import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import externalGlobals from 'rollup-plugin-external-globals'
import { visualizer } from 'rollup-plugin-visualizer'

const globals = externalGlobals({
  vue: "Vue",
  "vue-router": "VueRouter",
  "ant-design-vue": "antd",
  dayjs: "dayjs",
})

// const plugins = process.env.NODE_ENV === 'production' ? [] : []

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer(),
  ],
  resolve: {
	  alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      external: ['vue', "vue-router", "ant-design-vue", "dayjs"],
      plugins: [
        globals,
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
