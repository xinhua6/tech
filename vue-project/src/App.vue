<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  html {
    font-size: 10px;
  }
  #app {
    height: 100%;
    font: normal $base-font-size Microsoft YaHei;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $base-font-color;
    min-height: 580px;
    min-width: 1200px;
    overflow: hidden;
  }
</style>
