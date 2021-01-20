<template>
    <b-popover
            v-if="attach"
            :show="value"
            :target="attach"
            :placement="placement"
            :triggers="triggers"
    >
        <template v-slot:title>
            <slot name="title"></slot>
        </template>

        <template v-slot:default>
            <slot name="default"></slot>
        </template>
    </b-popover>
</template>

<script>
	/**
	 * Надстройка над Bootstrap popover
	 */
    import { BPopover } from 'bootstrap-vue'

	export default {
		name: 'da-b-popover',
        components: {
            BPopover
        },

		data: () => ({}),

		props: {
			value: Boolean,
            attach: [String, HTMLElement],
            placement: String,
            triggers: {
			    type: String,
			    default: 'click',
            },
		},
	}
</script>

<style lang="scss">
    @import 'node_modules/bootstrap/scss/mixins.scss';
    @import 'node_modules/bootstrap/scss/functions.scss';
    @import 'node_modules/bootstrap/scss/variables.scss';
    @import 'node_modules/bootstrap/scss/popover.scss';
</style>
