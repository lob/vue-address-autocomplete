<template>
	<div class="demo">
		<h4>Using a strings array</h4>
		<div class="row">
			<div class="column column-60">
				<span class="float-right">
					<code>({{ addressesFiltered.length }}/{{ addresses.length }})</code>
				</span>
				<TypeAhead :items="addresses" :placeholder="options.placeholder" @selectItem="selectItem" @onInput="onInput" @onBlur="onBlur" :minInputLength="options.minInputLength" :itemProjection="
						(item) => {
							return item.label;
						}
					" />
			</div>
			<div class="column column-40">
				<pre><code>{{data}}</code></pre>
			</div>
		</div>
	</div>
</template>

<script>
import TypeAhead from './TypeAhead.vue'
import { postAutocompleteAddress } from './../api'
export default {
  components: {
    TypeAhead
  },
  props: {
    apiKey: {
      type: String
    }
  },
	created() {
		this.addressesFiltered = this.addresses;
	},
	data() {
		return {
			options: {
				placeholder: 'Search for an address',
				minInputLength: 1,
			},
			addresses: [],
			addressesFiltered: [],
			data: {
				input: '',
				selection: null,
			},
		};
	},
	methods: {
		selectItem(item) {
			this.data.selection = item;
		},
		async onInput(event) {
			this.data.selection = null;
			this.data.input = event.input;
			this.addressesFiltered = event.items;
      const newSuggestions = await this.fetchFromAutocompleteAPI(event.input);
      this.addresses = newSuggestions;
		},
    async fetchFromAutocompleteAPI(userInput) {
      const newAddresses = await postAutocompleteAddress(this.apiKey, userInput)
      const newAddressJSON = await newAddresses.json()
      const suggestions = newAddressJSON['suggestions']
      const newSuggestions = suggestions.map((x) => ({
          value: x,
          label: `${x.primary_line} ${x.city} ${x.state}`
        }))
      return newSuggestions
    },

		onBlur(event) {
			this.data.input = event.input;
			this.addressesFiltered = event.items;
		}
	},
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