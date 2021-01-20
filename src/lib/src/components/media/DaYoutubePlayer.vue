<template>
  <iframe
    ref="iframe"
    :width="width"
    :height="height"
    :src="embedSrc"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<script>
export default {
  name: 'da-youtube-player',
  //functional: true,

  props: {
    src: String,
    height: [String, Number],
    width: [String, Number]
  },

  methods: {
    /**
     * Остановить видео
     * */
    stopVideo() {
      let iframe = this.$refs.iframe
      let video = iframe.querySelector('#player')
      if (iframe) {
        let iframeSrc = iframe.src
        iframe.src = iframeSrc
      }
      if (video) {
        video.pause()
      }
    }
  },

  computed: {
    embedSrc() {
      let id = ''
      let embedUrl = ''
      if (/embed/.test(this.src)) {
        let parts = this.src.split('/')
        id = parts[parts.length - 1]
      } else {
        const found = /v=([^\&]+)/.exec(this.src)
        if (!found) return this.src

        id = /v=([^\&]+)/.exec(this.src)[1]
      }
      embedUrl = 'https://www.youtube.com/embed/' + id

      return embedUrl
    }
  }
}
</script>
