<template>
  <Aluno />
</template>

<script>
import Aluno from './components/Aluno.vue'

export default {
  name: 'App',
  components: {
    Aluno
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
