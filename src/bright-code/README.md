# Bright-code

## About

Bright code is based on [highlight.js](https://github.com/highlightjs/highlight.js) extracted code highlighting plug-in for the front end.

It only supports four languages: HTML, CSS, JavaScript and shell.

The volume is very small, only 66kb.

Code highlight style use [tyh-theme-vscode](https://github.com/Tyh2001/tyh-theme-vscode).

## Install

npm

```shell
npm i bright-code
```

yarn

```shell
yarn add bright-code
```

## Use

Configure the following contents in `main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import brightCode from './bright-code'
import './bright-code/theme/tyh-theme.css'

createApp(App)
  .use((app) => {
    app.directive('bright', {
      mounted(el) {
        const codes = el.querySelectorAll('pre code')
        codes.forEach((code) => {
          brightCode.highlightElement(code)
        })
      },
    })
  })
  .mount('#app')
```

```html
<template>
  <pre v-bright>
    <code>{{ HTML }}</code>
  </pre>
</template>

<script setup>
  const HTML = `
<tyh-button type="primary" @click="open = true">点我打开</tyh-button>

<tyh-radio v-model="radio" label="right">从右面弹出</tyh-radio>
<tyh-radio v-model="radio" label="left">从左面弹出</tyh-radio>
<tyh-radio v-model="radio" label="bottom">从下面弹出</tyh-radio>
<tyh-radio v-model="radio" label="top">从上面弹出</tyh-radio>

<tyh-drawer v-model="open" :direction="radio" title="这是标题">
  hello，欢迎使用 tyh-ui!
</tyh-drawer>
`
</script>
```

## Link

Bright-code

- [NPM](https://www.npmjs.com/package/bright-code)

Use together

- [vite-plugin-md](https://github.com/antfu/vite-plugin-md)

## License

[田同学](https://github.com/Tyh2001/bright-code/blob/master/LICENSE)
