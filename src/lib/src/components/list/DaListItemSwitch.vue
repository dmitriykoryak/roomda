<template>
	<v-list-item @click="localValue = !localValue">
		<v-list-item-content>
			<v-list-item-subtitle>
				{{label}}
			</v-list-item-subtitle>
		</v-list-item-content>
		<v-list-item-action class="d-flex justify-end">
			<da-switch
					ref="switch"
					:value="localValue"
					:attr="attr"
			></da-switch>
		</v-list-item-action>
	</v-list-item>
</template>

<script>

	export default {
		name: 'da-list-item-switch',

		props: {
			attr: String,
			value: Boolean,
			label: String,
		},

		data: () => ({}),

		methods: {},

		computed: {
			localValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		},
	}
</script>

<style scoped lang="scss">
</style>
