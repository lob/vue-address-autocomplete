import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
import vSelect from 'vue-select'


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "@lob/vue-address-autocomplete",
      fileName: (format) => `@lob/vue-address-autocomplete.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vue-select'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          vSelect: "vue-select"
        }
      }
    }
  },
  plugins: [vue({
    template: {
      compilerOptions: {
        // treat all tags with a dash as custom elements
        isCustomElement: (tag) => tag.includes('-')
      }
    }
  }), vSelect ]
})
