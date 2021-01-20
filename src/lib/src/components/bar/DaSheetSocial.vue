<template>
	<div class="text-center">
		<v-bottom-sheet v-model="sheet">
			<template v-slot:activator="{ on }">
				<v-btn
						color="primary"
						text
						tile
						v-on="on"
				>
					{{title}}
				</v-btn>
			</template>
			<v-list>
				<v-subheader>Отправить в</v-subheader>
				<v-list-item
						v-for="tile in tiles"
						:key="tile.title"
						:href="tile.url + message"
						@click="sheet = false"
				>
					<v-list-item-avatar>
						<v-icon color="info">{{tile.icon}}</v-icon>
					</v-list-item-avatar>
					<v-list-item-title>{{ tile.title }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-bottom-sheet>
	</div>
</template>

<script>

	export default {
		data: () => ({
			name: 'da-sheet-social',
			sheet: false,
			tiles: [
				{ icon: 'fa-share-alt', title: 'WhatsApp', url: 'https://wa.me/?text='},
				{ icon: 'fa-share-alt', title: 'Telegram', url: 'https://telegram.me/share/url?url='},
			],
		}),

		props: {
			title: String,
			message: String,
		}
	}

</script>

<style scoped lang="scss">
</style>
