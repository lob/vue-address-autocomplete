<template>
<div>
  <AddressAutocomplete apiKey="YOUR_API_KEY_HERE" :addresses="addresses" @selectItem="selectItem" @newSuggestions="addNewSuggestions" />
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