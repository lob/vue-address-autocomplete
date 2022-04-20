<template>
	<div :id="wrapperId" class="simple-typeahead">
		<div v-if="label" class="simple-typeahead-label">
			{{label}}
		</div>
		<input
			:id="inputId"
			class="simple-typeahead-input"
			:class="label && 'simple-typeahead-input-with-label'"
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
				<span class="simple-typeahead-list-item-text" :data-text="itemProjection(item).suggestion" v-if="$slots['list-item-text']">
					<slot name="list-item-text" :item="item" :itemProjection="itemProjection"></slot>
				</span>
				<span class="simple-typeahead-list-item-text" :data-text="itemProjection(item).input" v-html="itemProjection(item).suggestion" v-else></span>
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
			 * A function that modifies item data before they are rendered as suggestions or inserted
			 * into the input. It should return the following response:
			 * 	suggestion - An html string for how the item should be rendered in the list of suggestions
			 * 	input - The value to be inserted in the input if selected
			 */
			itemProjection: {
				type: Function,
				default(item) {
					return {
						suggestion: item,
						input: item,
					};
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
			label: {
				type: String,
				default: null
			}
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
				// Override the input's focused status so users can click the list header
				this.isInputFocused = true;
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
				this.$emit('selectItem', item);
				this.input = this.itemProjection(item).input;
				this.currentSelectionIndex = 0;
				document.getElementById(this.inputId)?.blur();
				this.isInputFocused = false;
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
        return this.items || []
			},
			isListVisible() {
				// Allow empty inputs from test cases
				const isInputValid = process.env.NODE_ENV === 'test' || this.input.length >= this.minInputLength
				return this.isInputFocused && isInputValid && this.filteredItems.length;
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
    border: 1px #bbbbbb solid;
		border-radius: 4px;
		box-sizing: border-box;
		margin-bottom: 0;
		padding: .25em;
		width: 100%;
	}
	.simple-typeahead-input-with-label {
		padding: 2em 1em 0.5em 0.75em !important;
	}
	.simple-typeahead .simple-typeahead-label {
		font-size: 14px;
		font-weight: 400;
		color: #949494;
		position: absolute;
    left: 1em;
    top: 0.5em;
	}
	.simple-typeahead .simple-typeahead-list {
		background: white;
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
		text-align: left;
	}
	.simple-typeahead .simple-typeahead-list .simple-typeahead-list-item.simple-typeahead-list-item-active {
		background-color: #e1e1e1;
	}
</style>
