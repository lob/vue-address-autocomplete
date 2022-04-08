<template>
  <div class="column-30">
    <div class="flex-row">
      <AddressAutocomplete class="flex-grow mr-1" :apiKey="apiKey" :addresses="addresses" @selectItem="selectItem" @newSuggestions="addNewSuggestions" />
      <button @click="handleClick">Verify</button>
    </div>
    <pre>
      <code v-if="showApiResponse">{{apiResponse}}</code>
      <code v-if="showSelection">{{selection}}</code>
    </pre>
  </div>
</template>

<script>
import AddressAutocomplete from './components/AddressAutocomplete.vue'
import { verify } from './verify';
export default {
  components: {
    AddressAutocomplete
  },
  data() {
    return {
      addresses: [],
      apiKey: 'live_pub_16d30adbb46a1c360ebf7d1e6b48361',
      apiResponse: {},
      selection: '',
      showApiResponse: false,
      showSelection: false,
    }
  },
  methods: {
		selectItem(item) {
			this.selection = item;
      this.showSelection = true;
      this.showApiResponse = false;
		},
    addNewSuggestions(suggestedAddresses) {
      this.addresses = suggestedAddresses;
    },
    handleClick() {
      verify(this.apiKey, this.selection.value)
        .then(res => {
          this.apiResponse = res;
          this.showApiResponse = true;
          this.showSelection = false;
        })
    }
	}
};
</script>
<style scoped>
.column-30 {
  width: 30em;
}
.flex-grow {
  flex: 1;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.mr-1 {
  margin-right: 1em;
}

button {
  -webkit-transition: background-color .2s;
  background-color: #0099d7;
  border-radius: 5px;
  border: 2px #0099d7;
  color: #fff;
  flex-shrink: 1;
  font-family: Larsseit,sans-serif;
  font-size: 21px;
  font-weight: 500;
  line-height: 16px;
  padding: 12px 24px;
  position: relative;
  text-decoration: none;
  transition: background-color .2s;
}

button:hover {
  background-color: #1878e0;
  text-decoration: none;
}
</style>