<template>
<div>
  <AddressAutocomplete apiKey="live_pub_16d30adbb46a1c360ebf7d1e6b48361" :addresses="addresses" @selectItem="selectItem" @newSuggestions="addNewSuggestions" />
  <div class="column column-40">
  <pre><code>{{selection}}</code></pre>
</div>
  </div>
</template>

<script>
import AddressAutocomplete from './components/AddressAutocomplete.vue'
export default {
  components: {
    AddressAutocomplete
  },
  data() {
    return {
      addresses: [],
      selection: ''
    }
  },
  methods: {
		selectItem(item) {
			this.selection = item;
		},
    addNewSuggestions(suggestedAddresses) {
      this.addresses = suggestedAddresses;
    }
	}
};
</script>