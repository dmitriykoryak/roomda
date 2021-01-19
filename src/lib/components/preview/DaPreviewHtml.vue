<template>
	<v-tooltip bottom max-width="1070">
		<template v-slot:activator="{ on }">
			<span v-on="on" v-html="substrValue"></span>
		</template>
		<div v-html="value"></div>
	</v-tooltip>
</template>

<script>
	/**
	 * Компонент для предпросмотра html
	 */
	export default {
		name: 'da-preview-html',

		props: {
			value: String,
		},

		computed: {
			// удалить html для предпоказа части текста
			substrValue() {
				if (this.value) {
					let text = this.value.replace(/<[^>]+>/g,'');
					return text.substr(0, 15) + '...';
				}
			},
		}
	}
</script>

