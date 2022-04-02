<template>
  <AddressAutocomplete apiKey="api_key_here" />
</template>

<script>
import AddressAutocomplete from './components/AddressAutocomplete.vue'
export default {
  components: {
    AddressAutocomplete
  }
};
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