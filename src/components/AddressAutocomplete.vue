<template>
  <div class="relative">
    <input
      :value="value"
      @input="handleInput"
      :placeholder="placeholder"
      ref="input"
      tabindex="0"
      :class="inputClass"
    />
    <span
      v-if="value"
      @click.prevent="reset()"
      class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
    >
      x
    </span>
    <div
      v-show="value && showOptions"
      @click.self="handleSelf()"
      @focusout="showOptions = false"
      tabindex="0"
      :class="dropdownClass"
    >
      <ul class="py-1">
        <li
          v-for="searchResult in searchResults"
          :key="searchResult.OPEID"
          @click="handleClick(searchResult)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-200"
        >
          {{ searchResult.college_name }}
        </li>
        <li v-if="!searchResults.length" class="px-3 py-2 text-center">
          We search when you stop typing
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: "Enter text here.",
    },
    data: {
      type: Array,
      required: true,
    },
    inputClass: {
      type: String,
      required: false,
      default:
        "px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full",
    },
    dropdownClass: {
      type: String,
      required: false,
      default:
        "absolute w-full z-50 bg-white border border-gray-300 mt-1 mh-48 overflow-hidden overflow-y-scroll rounded-md shadow-md",
    },
  },
  data() {
    return {
      showOptions: false,
      chosenOption: "",
      searchTerm: "",
    };
  },
  computed: {
    searchResults() {
      if (this.data) {
        return this.data.slice(0, 10).filter((item) => {
        return item
      });
      }
    },
  },
  methods: {
    reset() {
      this.$emit("input", "");
      this.chosenOption = "";
    },
    handleInput(evt) {
      this.$emit("input", evt.target.value);
      this.searchTerm = evt.target.value;
      this.showOptions = true;
    },
    handleClick(item) {
      this.$emit("input", item.college_name);
      this.$emit("chosen", item);
      this.chosenOption = item.college_name;
      this.showOptions = false;
      this.$refs.input.focus();
    }
  },
};
</script>
