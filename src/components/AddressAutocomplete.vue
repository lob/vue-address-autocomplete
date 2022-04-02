<template>
  <TypeAhead
	id="typeahead_id"
	placeholder="Search for an address"
	:items="addresses"
	:minInputLength="1"
	@selectItem="selectItemEventHandler"
	@onInput="onInputEventHandler"
>
</TypeAhead>
</template>

<script>
import { defineComponent } from 'vue';
import TypeAhead from './TypeAhead.vue'
export default defineComponent({
  component: {
    TypeAhead
  },
  data() {
    return {
      addresses: []
  }},
  methods: {
    selectItemEventHandler(selectedAddress) {
      console.log(selectedAddress)
    },
    onInputEventHandler(input) {
      console.log(input)

    }
  }
})
</script>
