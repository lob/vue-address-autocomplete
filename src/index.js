import TypeAhead from './components/TypeAhead.vue'
function install(Vue) {
  if (install.installed) {
    return
  }
  install.installed = true
  Vue.component('TypeAhead', TypeAhead)
}

const plugin = { install }

// Auto install if Vue is found
let GlobalVue
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

// Inject install function into component. Allows component to be registered via
// Vue.use() as well as Vue.component()
TypeAhead.install = install

export default TypeAhead