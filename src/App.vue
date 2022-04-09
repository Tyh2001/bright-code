<template>
  <div id="app">
    <h1>BrightCode</h1>
    <h2>Shell</h2>
    <pre v-bright>
      <code>{{ Shell }}</code>
    </pre>

    <h2>HTML</h2>
    <pre v-bright>
      <code>{{ HTML }}</code>
    </pre>

    <h2>JavaScript</h2>
    <pre v-bright>
      <code>{{ JavaScript }}</code>
    </pre>

    <h2>Css</h2>
    <pre v-bright>
      <code>{{ Css }}</code>
    </pre>
  </div>
</template>

<script setup>
const Shell = `npm install bright-code`
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
const JavaScript = `
function render(node, root) {
  const el = document.createElement(node.tag)

  for (const key in node.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substr(2).toLowerCase(), () => {
        node.props[key]()
      })
    }
  }

  if (typeof node.children === 'string') {
    const text = document.createTextNode(node.children)
    console.log(text)
    el.appendChild(text)
  } else if (Array.isArray(node.children) && node.children.length) {
    node.children.forEach((item) => {
      render(item, el)
    })
  }

  root.appendChild(el)
}
`
const Css = `
.tyh-header,
.tyh-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.tyh-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.tyh-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .tyh-container {
  margin-bottom: 40px;
}

.tyh-container:nth-child(5) .tyh-aside,
.tyh-container:nth-child(6) .tyh-aside {
  line-height: 260px;
}

.tyh-container:nth-child(7) .tyh-aside {
  line-height: 320px;
}
`
</script>

<style scoped>
#app {
  max-width: 700px;
  margin: auto;
}
#app h1,
#app h2 {
  color: #333;
}
</style>
