<template>
  <AddressAutocomplete apiKey="live_f1509d4894ea4b21c4568fb87b6fb21d293" />
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