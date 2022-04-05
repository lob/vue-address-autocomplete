<template>
	<div class="demo">
		<div class="row">
			<div class="column column-60">
				<TypeAhead :items="addresses" :placeholder="placeholder" @selectItem="selectItem" @onInput="onInput" @onBlur="onBlur" :minInputLength="minInputLength" :itemProjection="
						(item) => {
							return item.label;
						}
					" />
			</div>
		</div>
	</div>
</template>

<script>
import TypeAhead from './TypeAhead.vue'
import { postAutocompleteAddress } from './../api'
export default {
  //'onInput', 'onFocus', 'onBlur',
  emits: ['selectItem', 'newSuggestions'],
  components: {
    TypeAhead
  },
  props: {
    apiKey: {
      type: String
    },
    addresses: {
      type: Array
    },
    placeholder: {
      type: String,
      default: 'Search for an address'
    },
    minInputLength: {
      type: Number,
      default: 1
    }
  },
	data() {
		return {
			data: {
				input: ''
			},
		};
	},
	methods: {
		selectItem(item) {
			this.$emit('selectItem', item);
		},
		async onInput(event) {
			this.data.selection = null;
			this.data.input = event.input;
      const newSuggestions = await this.fetchFromAutocompleteAPI(event.input);
      this.$emit('newSuggestions', newSuggestions);
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
		}
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