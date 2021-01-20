<template>
	<div class="da-card-icon elevation-8 d-flex align-center justify-center flex-shrink-0" :class="colorClass">
		<v-icon>
			{{icon}}
		</v-icon>
	</div>
</template>

<script>

  export default {
    name: 'da-card-icon',
    props: {
      icon: String,
      colorClass: {
      	type: String,
      	default: 'primary',
	  },
    },
    data () {
      return {}
    }
  }
</script>

<style scoped lang="scss">
	.da-card-icon{
		width: 40px;
		height: 40px;

		.v-icon{
			color: #ffffff;
		}
	}
</style>
