<template>
	<v-subheader class="da-subheader accent elevation-4" dark>
		<v-icon v-if="icon" :small="small" class="mr-2">{{icon}}</v-icon>
		{{title}}
	</v-subheader>
</template>

<script>

	export default {
		name: 'da-subheader',
		data() {
			return {}
		},
		props: {
			title: String,
			icon: String,
			dark: Boolean,
			small: Boolean,
		}
	}
</script>

<style scoped lang="scss">
	.da-subheader{
		font-weight: 700;
	}
</style>
