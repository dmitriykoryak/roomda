<script>

	export default {
		data: () => ({}),
		methods: {
			getSunday() {
				let d = new Date()
				let day = d.getDay(),
					diff = d.getDate() - day + (day == 0 ? -7 : 0)
				return new Date(d.setDate(diff))
			},

			getMonday() {
				let d = new Date()
				let day = d.getDay(),
					diff = d.getDate() - day + (day == 0 ? -6 : 1)
				return new Date(d.setDate(diff))
			},

			getPrevMonday() {
				let d = new Date()
				let day = d.getDay(),
					diff = d.getDate() - day + (day == 0 ? -13 : -6)
				return new Date(d.setDate(diff))
			},

			getFirstDayThisMounth() {
				let d = new Date()
				return new Date(d.getFullYear(), d.getMonth(), 2)
			},

			getLastDayPrevMounth() {
				let d = new Date()
				return new Date(d.getFullYear(), d.getMonth(), 1)
			},

			getFirstDayPrevMounth() {
				let d = new Date()
				return new Date(d.getFullYear(), d.getMonth() - 1, 2)
			}
		},
	}
</script>
