<template>
  <v-hover v-slot:default="{ hover }">
    <div
      class="d-flex align-center search-tag"
      :class="hover ? 'elevation-4' : 'elevation-2'"
    >
      <span class="search-tag-data">
        <slot name="default" v-bind="styleObj"></slot>
      </span>

      <v-icon :class="{ 'pink--text': hover }" small>
        fa-backspace
      </v-icon>
    </div>
  </v-hover>
</template>

<script>
export default {
  data() {
    return {
      styleObj: {
        headStyle: {
          fontSize: '11px',
          color: '#858585'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.search-tag {
  margin: 0 5px 0 0;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 5px;
  padding: 6px 10px;

  .search-tag-data {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
