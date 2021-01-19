<template>
	<v-text-field
			v-model="localValue"
			:label="label"
			type="time"
			:error-messages="errorMessages"
			@blur="$emit('blur')"
	></v-text-field>
</template>

<script>

	export default {
		name: 'da-time-picker',

		inject: ['$validator'],

		data: () => ({}),

		props: {
			value: String,
			label: String,
			clearable: Boolean,
			errorMessages: String,
		},

		computed: {
			localValue: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				},
			},
		}
	}
</script>

<style scoped lang="scss">
</style>
