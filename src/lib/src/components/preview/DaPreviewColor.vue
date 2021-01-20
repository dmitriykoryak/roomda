<template>
	<div class="color-show" :style="{backgroundColor: value}"></div>
</template>

<script>

	export default {
		name: 'da-preview-color',
		data: () => ({}),
		props: {
			value: String
		}
	}
</script>

<style lang="scss">
	.color-show{
		width: 32px;
		height: 24px;
		border: 1px solid #b0b0b0;
		margin-right: 5px;
	}
</style>
