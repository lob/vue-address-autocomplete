import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "@lob/vue-address-autocomplete",
      fileName: (format) => `@lob/vue-address-autocomplete.${format}.js`
    },
    test: {
      coverage: {
        reporter: ['lcov', 'text-summary']
      }
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()],
  test: {
    globals: true,
  },
})
