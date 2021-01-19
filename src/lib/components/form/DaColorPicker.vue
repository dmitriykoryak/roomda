<template>

		<v-menu
				class="da-cp"
				v-model="show"
				:close-on-content-click="false"
				:nudge-right="40"
				transition="scale-transition"
				offset-y
				min-width="290px"
		>
			<template v-slot:activator="{ on }">
				<div class="d-flex align-center justify-center flex-grow-1">
					<da-preview-color :value="getHex(localValue)"></da-preview-color>
					<v-text-field
							class="da-cp-input"
							:value="localValue"
							:label="label"
							v-on="on"
							:error-messages="errorMessages"
							@blur="$emit('blur')"
							readonly
					></v-text-field>
				</div>

			</template>
			<v-container pa-0 class="dp-container">
				<v-color-picker
						class="ma-2"
						v-model="localValue"
						@update:color="validateColor"
						show-swatches
						hide-mode-switch
						swatches-max-height="120px"
						mode="hexa"
				></v-color-picker>
			</v-container>
		</v-menu>

</template>

<script>
	import DaColorShow from '../preview/DaPreviewColor';

	export default {
		name: 'da-color-picker',
		inject: ['$validator'],
		components: {DaColorShow},
		data: () => ({
			show: false,
			defaultColor: '#FFFFFF'
		}),
		props: {
			label: String,
			value: [Number, String, Array],
			errorMessages: String,
			attr: String,
			default: String,
		},
		methods: {
			clear() {
				setTimeout(() => this.localValue = this.defaultColor, 1000);
			},
			getHex(val) {
				return val && val.hex ? val.hex : val;
			},
			validateColor() {
				if (this.$validator) {
					setTimeout(() => this.$validator.validate(this.attr, this.localValue), 100);
				}
			}
		},
		computed: {
			localValue: {
				get() {
					// if (!this.value) {
					// 	this.$emit('update:value', this.defaultColor);
					// }
					return this.value;
				},
				set(val) {
					this.$emit('input', this.getHex(val));
				},
			},
		},
	}
</script>

<style lang="scss">
	.da-cp-input{
		margin-top: -3px!important;
	}
</style>
