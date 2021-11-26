<template>
  <div id="app">
    <ccp/>
  </div>
</template>

<script>
import ccp from './components/ccp.vue'

export default {
  name: 'app',
  components: {
    ccp
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 350px; 
	height: 465px;
}
</style>
