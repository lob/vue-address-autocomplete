[![npm version](https://badge.fury.io/js/@lob%2Fvue-address-autocomplete.svg)](https://badge.fury.io/js/@lob%2Fvue-address-autocomplete)

# Lob Vue Address Autocomplete Components

## Features

 This is a very lightweight component that uses the Lob Autocomplete API in order to simplify the process of adding in a search autocomplete bar. Check out the Autocomplete API for more configuration options on [Postman](https://www.postman.com/lobteam/workspace/lob-public-workspace/overview) or [Lob Documentation](https://docs.lob.com/).

 As always if this front end component doesn't suit your bootstrapped needs, feel free to check out the aformentioned links above to have more control over the look and feel of your address autocomplete and verification needs :)

## Install

```bash
npm install --save @lob/vue-address-autocomplete
```

Make sure to include our component styles in your js entry point or at the component level:

```javascript
# inside main.js or component file
import '@lob/vue-address-autocomplete/dist/styles.css';
```


## Address Autocomplete Search Bar Demo Code 

```javascript
<template>
  <div>
    <AddressAutocomplete apiKey="YOUR_API_KEY_HERE" :addresses="addresses" @selectItem="selectItem" @newSuggestions="addNewSuggestions" />
    <div class="column column-40">
      <pre><code>{{selection}}</code></pre>
    </div>
  </div>
</template>

<script>
import AddressAutocomplete from '@lob/vue-address-autocomplete'
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
```


## How to Build and publish

Run 
```
npm run build
npm publish
```
