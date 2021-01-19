<script>
	/**
	 * Mixin для вычисления текущей прокрутки до верха документа
	 */
	export default {
		name: 'ScrollTopMixin',

        created() {
            window.addEventListener('scroll', this.onScroll);
        },
        destroyed: function () {
            window.removeEventListener('scroll', this.onScroll);
        },

        data: () => ({
            // Прокрутка до верха документа (px)
            offsetTop: null
        }),

		methods: {
            onScroll () {
                this.offsetTop = window.pageYOffset ? window.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            },
		},
	}
</script>
