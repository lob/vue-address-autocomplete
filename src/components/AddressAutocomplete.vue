<template>
	<div class="demo">
		<div class="row">
			<div class="column column-60">
				<TypeAhead :items="addresses" :placeholder="placeholder" @onInput="onInput" @onBlur="onBlur" :minInputLength="minInputLength" :itemProjection="formatSuggestions" v-model="input" v-bind="$attrs">
          <template #list-header>
            <div class="lob-label" @click="handleClickHeader" @mousedown.prevent>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 1259 602'
                class="lob-logo"
              >
                <path
                  d='M1063,141c-47.06,0-89,18.33-121,50.78V0H780V338.74C765,222.53,666.88,138,540,138c-137,0-242,101-242,232a235,235,0,0,0,7.7,60H164V0H0V585H307l14.54-112.68C359.94,550,441.74,602,540,602c127.75,0,225.08-83.62,240-200.41V585H930V540.27c31.8,37,77.27,56.73,133,56.73,103,0,196-109,196-228C1259,239,1175,141,1063,141ZM540,450c-45,0-81-36-81-80s36-80,81-80c46,0,81,35,81,80S585,450,540,450Zm475-1c-46,0-83-36-83-80a82.8,82.8,0,0,1,82.6-83h.4c47,0,85,37,85,83C1100,413,1062,449,1015,449Z'
                  fill='#0099d7'
                />
              </svg>
              <span class="lob-header">Deliverable addresses</span>
              <a href="https://www.lob.com/address-verification?utm_source=autocomplete&utm_medium=vue">Learn more</a>
            </div>
          </template>
        </TypeAhead>
			</div>
		</div>
	</div>
</template>

<script>
import TypeAhead from './TypeAhead.vue'
import { postAutocompleteAddress, postAutocompleteInternationalAddress } from './../api'
export default {
  //'onInput', 'onFocus', 'onBlur', 'onSuggestions'
  emits: ['onSuggestions', 'onError', 'onInput'],
  components: {
    TypeAhead
  },
  props: {
    /**
     * Address components for more specific suggestions. Primarily used when primaryLineOnly is
     * true and for US autocomplete only
     */
    address: {
      type: Object,
      default: {}
    },
    apiKey: {
      type: String
    },
    country: {
      type: String,
      default: 'US'
    },
    isInternational: {
      type: Boolean,
      default: false
    },
    isStaging: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Search for an address'
    },
    minInputLength: {
      type: Number,
      default: 1
    },
    /**
     * When true the input will only update to the primary line of a suggested address
     */
    primaryLineOnly: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // Check if parent compeont is listening to deprecated events. Note that listeners are prefixed with 'on'
    if (this.$attrs.onSelectItem) {
      console.error("[@lob/vue-address-autocomplete] Event 'selectItem' has been removed for AddressAutocomplete, please use 'onSelect' instead")
    }
    if (this.$attrs.onNewSuggestions) {
      console.error("[@lob/vue-address-autocomplete] Event 'newSuggestions' has been removed for AddressAutocomplete, please use 'onSuggestions' instead")
    }
  },
	data() {
		return {
      addresses: [],
      input: ''
		};
	},
	methods: {
    formatSuggestions(item) {
      const { primary_line, city, state, zip_code } = item.value

      let boldStopIndex = 0

      this.input.split('').forEach((inputChar) => {
        if (
          inputChar.toLowerCase() ===
          primary_line.charAt(boldStopIndex).toLowerCase()
        ) {
          boldStopIndex += 1
        }
      })

      const primaryLineElement =
        boldStopIndex === 0 ? (
          `${primary_line},`
        ) : boldStopIndex === primary_line.length ? (
          `<strong>${primary_line},</strong>`
        ) : (
          `<span>
            <strong>${primary_line.substring(0, boldStopIndex)}</strong>${primary_line.substring(boldStopIndex)},
          </span>`
        )

      return {
        input: this.primaryLineOnly ? primary_line : `${primary_line}, ${city}, ${state.toUpperCase()}, ${zip_code}`,
        suggestion: `
          <span>
            ${primaryLineElement}
            <span style="color: #888;">
              ${city},&nbsp;${state.toUpperCase()},&nbsp;${zip_code}
            </span>
          </span>
        `
      };
    },
    handleClickHeader() {
      window.location.href = "https://www.lob.com/address-verification?utm_source=autocomplete&utm_medium=vue";
    },
		async onInput(event) {
			this.selection = null;
			this.input = event.input;
      this.$emit('onInput', this.input)
      const newSuggestions = await this.fetchFromAutocompleteAPI(event.input);
      this.addresses = newSuggestions;
      this.$emit('onSuggestions', newSuggestions);
      this.$forceUpdate();
		},
    async fetchFromAutocompleteAPI(userInput) {
      // Allow empty inputs from test cases
      if (!userInput && process.env.NODE_ENV !== 'test') {
        return [];
      }

      // International autocomplete requires min length of 3
      if (this.isInternational && userInput.length < 3) {
        return [];
      }

      if ('primary_line' in this.address) {
        delete this.address.primary_line;
      }

      if ('secondary_line' in this.address) {
        delete this.address.secondary_line;
      }

      const newAddresses = this.isInternational
        ? await postAutocompleteInternationalAddress(this.apiKey, userInput, this.country, this.isStaging)
        : await postAutocompleteAddress(this.apiKey, userInput, this.isStaging, this.address)
      const newAddressJSON = await newAddresses.json()

      if (newAddressJSON.error) {
        this.$emit('onError', newAddressJSON.error)
      }

      const suggestions = newAddressJSON['suggestions'] || []
      const newSuggestions = suggestions.map((x) => ({
          value: x,
          label: `${x.primary_line} ${x.city} ${x.state} ${x.zip_code}`
        }))

      return newSuggestions
    },

		onBlur(event) {
			this.input = event.input;
		}
	}
};
</script>

<style scoped>
  :root {
    --lob-header-text-color: #888;
  }

	.lob-header {
		color: var(--lob-header-text-color);
		text-decoration: inherit;
	}

	.lob-label {
		align-items: center;
    border-bottom: 1px solid #DDDDDD;
		cursor: pointer;
		display: flex;
		font-size: 17px;
		padding: 1rem;
	}

	.lob-label > a {
		font-weight: 600;
		color: #0699D6;
		text-decoration: inherit;
    margin-left: 12px;
	}

	.lob-label > span {
		flex: 1;
		font-weight: 400;
		margin-left: 12px;
	}

	.lob-logo {
		height: 21px;
	}

</style>