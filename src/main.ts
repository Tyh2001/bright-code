import { createApp } from 'vue'
import App from './App.vue'
import brightCode from './bright-code'
import './bright-code/theme/index.css'

createApp(App)
  .use(app => {
    app.directive('bright', {
      mounted (el) {
        const codes = el.querySelectorAll('pre code')
        codes.forEach(code => {
          brightCode.highlightElement(code)
        })
      }
    })
  })
  .mount('#app')
