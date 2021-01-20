<template>
	<v-btn icon @click="openSearch">
		<v-icon>search</v-icon>

		<!-- Модальное окно поиска -->
		<da-dialog
				v-model="dialog"
				fullscreen
				randImg
				leftArrow
				:toolbar-spacer="false"
				:close-icon="false"
				closeButton
		>
			<template v-slot:toolbar-items>
				<v-btn icon @click="openGridSearch">
					<v-icon small>fa-filter</v-icon>
				</v-btn>
			</template>

			<template v-slot:toolbar-default>
				<v-text-field
						ref="searchInput"
						append-icon="mic"
						class="mx-1"
						label="Поиск"
						prepend-inner-icon="search"
						solo-inverted
						flat
						hide-details
				></v-text-field>
			</template>
			<v-card tile>
				<v-card-text>
					<div class="pt-12 text-center caption">
						Начните искать по пользователям, клиентам, операциям, сделкам и задачам
					</div>
				</v-card-text>
			</v-card>
		</da-dialog>
		<!-- Модальное окно поиска end -->
	</v-btn>
</template>

<script>

    export default {
        name: 'da-search-button',

        data() {
            return {
                dialog: false,
            }
        },

        methods: {
			openSearch() {
                this.dialog = true;
                setTimeout(() => this.$refs.searchInput.focus(), 600);
            },
			openGridSearch() {
            	const elems = document.getElementsByClassName('da-search-card-filter-btn-0');
            	if (elems.length) {
					this.dialog = false;
					setTimeout(() => elems[0].click(), 200);
				}
			}
        },
    }
</script>

<style lang="scss">
</style>
