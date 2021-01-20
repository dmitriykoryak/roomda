<template>
  <div class="da-carousel">
    <VueSlickCarousel
      class="slider-top"
      ref="sliderTop"
      :asNavFor="sliderBottom"
      :focusOnSelect="true"
    >
      <slot></slot>
    </VueSlickCarousel>
    <VueSlickCarousel
      :centerMode="true"
      class="slider-bottom"
      ref="sliderBottom"
      :asNavFor="sliderTop"
      :slidesToShow="slideToShow"
      :focusOnSelect="true"
    >
      <slot></slot>
    </VueSlickCarousel>
  </div>
</template>

<script>
/**
 * Карусель, с нижним слайдером продпросмотра изображений
 * - не зависит от Vuetify
 */
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  mounted() {
    this.sliderTop = this.$refs.sliderTop
    this.sliderBottom = this.$refs.sliderBottom

    const docWidth = document.documentElement.clientWidth
    if (docWidth < 1500 && docWidth > 1200) {
      this.slideToShow = 15
    } else if (docWidth < 1200 && docWidth > 800) {
      this.slideToShow = 10
    } else if (docWidth < 800 && docWidth > 700) {
      this.slideToShow = 8
    } else if (docWidth < 700 && docWidth > 600) {
      this.slideToShow = 7
    } else if (docWidth < 600) {
      this.slideToShow = 4
    }
  },
  components: {
    VueSlickCarousel
  },
  data() {
    return {
      sliderTop: null,
      sliderBottom: null,
      slideToShow: 20
    }
  }
}
</script>

<style lang="scss">
.da-carousel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .slick-arrow {
    z-index: 1;
    margin-top: -13px;
    &.slick-next {
      right: 0;
    }
    &.slick-prev {
      left: -30px;
    }
    &::before {
      font-size: 50px;
    }
  }

  .slider-top {
    flex-grow: 1;
    height: 100%;
    .slick-slide {
      height: 100%;
      & > div {
        height: calc(100vh - 200px);
        position: relative;
        img {
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }

  .slider-bottom {
    margin-top: 10px;
    .slick-slide {
      height: 100%;
      padding: 2px;
      & > div {
        height: 60px;
        width: 60px;
        position: relative;
        img {
          border-radius: 4px;
          width: 100%;
          height: 100%;
          object-fit: fill;
          border: 2px solid transparent;
        }
      }

      &.slick-current {
        img {
          border: 2px solid #90caf9;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .da-carousel {
    .slick-arrow {
      margin-top: -8px;
      &.slick-next {
        right: -38px;
      }
      &.slick-prev {
        left: -48px;
      }
      &::before {
        font-size: 30px;
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .da-carousel {
    .slider-top {
      .slick-slide {
        & > div {
          height: calc(100vh - 80px);
        }
      }
    }
    .slick-arrow,
    .slider-bottom {
      display: none;
    }
  }
}
</style>
