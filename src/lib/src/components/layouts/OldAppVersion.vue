<template>
	<div class="pa-3 old-app-version">
		<v-alert
				class="alert"
				dense
				outlined
				type="warning"
		>
			Извините, но ваша версия приложения <strong>устарела</strong>, необходимо перейти по ссылке ниже и <strong>обновить приложение</strong>
		</v-alert>
		<div class="d-flex align-center justify-center">
			<a class="link title success--text" :href="$config.mobApp.url[deviceInfo.platform][$config.appAccountId]">Ссылка на приложение</a>
		</div>
	</div>
</template>

<script>

	import {mapGetters} from 'vuex';

    export default {
        name: 'old-app-version',

		computed: {
        	...mapGetters(['deviceInfo'])
		}
    }
</script>

<style scoped lang="scss">
	.old-app-version{
		.alert{
			margin-top: 200px;
		}
		.link {
			text-decoration: underline;
		}
	}
</style>
