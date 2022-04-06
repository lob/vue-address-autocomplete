<template>
	<div :id="wrapperId" class="simple-typeahead">
		<input
			:id="inputId"
			class="simple-typeahead-input"
			type="text"
			:placeholder="placeholder"
			v-model="input"
			@input="onInput"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.down.prevent="onArrowDown"
			@keydown.up.prevent="onArrowUp"
			@keydown.enter.tab.prevent="selectCurrentSelection"
			autocomplete="off"
		/>
		<div v-if="isListVisible" class="simple-typeahead-list">
			<div v-if="$slots['list-header']">
				<slot name="list-header"></slot>
			</div>
			<div
				class="simple-typeahead-list-item"
				:class="{ 'simple-typeahead-list-item-active': currentSelectionIndex == index }"
				v-for="(item, index) in filteredItems"
				:key="index"
				@mousedown.prevent
				@click="selectItem(item)"
				@mouseenter="currentSelectionIndex = index"
			>
				<span class="simple-typeahead-list-item-text" :data-text="itemProjection(item)" v-if="$slots['list-item-text']"
					><slot name="list-item-text" :item="item" :itemProjection="itemProjection"></slot
				></span>
				<span class="simple-typeahead-list-item-text" :data-text="itemProjection(item)" v-html="itemProjection(item)" v-else></span>
			</div>
			<div v-if="$slots['list-footer']">
				<slot name="list-footer"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue';
	export default defineComponent({
		name: 'TypeAhead',
		emits: ['onInput', 'onFocus', 'onBlur', 'selectItem'],
		props: {
			/**
			 * DOM element identifier attached to the input
			 */
			id: {
				type: String,
			},
			/**
			 * Placeholder for the input value
			 */
			placeholder: {
				type: String,
				default: '',
			},
			/**
			 * A list of suggestions to complete the input
			 */
			items: {
				type: Array,
				required: true,
			},
			/**
			 * The default value for the input
			 */
			defaultItem: {
				default: null,
			},
			/**
			 * A helper function used to modify the selected item before it is inserted into the input or rendered as a suggestion
			 */
			itemProjection: {
				type: Function,
				default(item) {
					return item;
				},
			},
			/**
			 * Minimum length of the input before displaying suggestions
			 */
			minInputLength: {
				type: Number,
				default: 2,
				validator: (prop) => {
					return prop >= 0;
				},
			},
		},
		mounted() {
			if (this.defaultItem !== undefined && this.defaultItem !== null) {
				this.selectItem(this.defaultItem);
			}
		},
		data() {
			return {
				inputId: this.id || `simple_typeahead_${(Math.random() * 1000).toFixed()}`,
				input: '',
				isInputFocused: false,
				currentSelectionIndex: 0,
			};
		},
		methods: {
			onInput() {
				if (this.isListVisible && this.currentSelectionIndex >= this.filteredItems.length) {
					this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
				}
				this.$emit('onInput', { input: this.input, items: this.filteredItems });
			},
			onFocus() {
				this.isInputFocused = true;
				this.$emit('onFocus', { input: this.input, items: this.filteredItems });
			},
			onBlur() {
				this.isInputFocused = false;
				this.$emit('onBlur', { input: this.input, items: this.filteredItems });
			},
			onArrowDown($event) {
				if (this.isListVisible && this.currentSelectionIndex < this.filteredItems.length - 1) {
					this.currentSelectionIndex++;
				}
				this.scrollSelectionIntoView();
			},
			onArrowUp($event) {
				if (this.isListVisible && this.currentSelectionIndex > 0) {
					this.currentSelectionIndex--;
				}
				this.scrollSelectionIntoView();
			},
			scrollSelectionIntoView() {
				setTimeout(() => {
					const list_node = document.querySelector(`#${this.wrapperId} .simple-typeahead-list`);
					const active_node = document.querySelector(`#${this.wrapperId} .simple-typeahead-list-item.simple-typeahead-list-item-active`);
					if (!(active_node.offsetTop >= list_node.scrollTop && active_node.offsetTop + active_node.offsetHeight < list_node.scrollTop + list_node.offsetHeight)) {
						let scroll_to = 0;
						if (active_node.offsetTop > list_node.scrollTop) {
							scroll_to = active_node.offsetTop + active_node.offsetHeight - list_node.offsetHeight;
						} else if (active_node.offsetTop < list_node.scrollTop) {
							scroll_to = active_node.offsetTop;
						}
						list_node.scrollTo(0, scroll_to);
					}
				});
			},
			selectCurrentSelection() {
				if (this.currentSelection) {
					this.selectItem(this.currentSelection);
				}
			},
			selectItem(item) {
				this.input = this.itemProjection(item);
				this.currentSelectionIndex = 0;
				document.getElementById(this.inputId).blur();
				this.$emit('selectItem', item);
			},
			escapeRegExp(string) {
				return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			},
			boldMatchText(text) {
				const regexp = new RegExp(`(${this.escapeRegExp(this.input)})`, 'ig');
				return text.replace(regexp, '<strong>$1</strong>');
			},
		},
		computed: {
			wrapperId() {
				return `${this.inputId}_wrapper`;
			},
			filteredItems() {
				// const regexp = new RegExp(this.escapeRegExp(this.input), 'i');
				// return this.items.filter((item) => this.itemProjection(item).match(regexp));
        return this.items
			},
			isListVisible() {
				return this.isInputFocused && this.input.length >= this.minInputLength && this.filteredItems.length;
			},
			currentSelection() {
				return this.isListVisible && this.currentSelectionIndex < this.filteredItems.length ? this.filteredItems[this.currentSelectionIndex] : undefined;
			},
		},
	});
</script>

<style scoped>
	.simple-typeahead {
		position: relative;
		width: 100%;
		font-family: 'Inter', sans-serif;
	}
	.simple-typeahead > input {
		margin-bottom: 0;
		width: 100%;
	}
	.simple-typeahead .simple-typeahead-list {
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
		border: 1px solid #DDDDDD;
		border-radius: 4px;
		max-height: 400px;
		overflow-y: auto;
		position: absolute;
		transform: translateY(.333rem);
		width: 100%;
		z-index: 9;
	}
	.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item {
		cursor: pointer;
		background-color: #fafafa;
		padding: 0.5rem 1rem;
	}
	.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item.simple-typeahead-list-item-active {
		background-color: #e1e1e1;
	}
</style>
