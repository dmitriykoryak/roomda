<template>
  <div class="da-editor">
    <div class="da-editor-in">
      <span>{{ label }}</span>
      <v-textarea
        v-if="source"
        :value="value"
        @input="$emit('input', $event)"
        outlined
        rows="12"
        hide-details
      ></v-textarea>
      <vue-editor
        v-else
        :value="value"
        @input="$emit('input', $event)"
        :placeholder="placeholder"
        useCustomImageHandler
        @image-added="handleImageAdded"
        @image-removed="handleImageRemoved"
      ></vue-editor>
      <v-btn @click="source = !source" class="source" x-small text tile>
        Источник
      </v-btn>
    </div>

    <div class="v-text-field__details mt-1">
      <div class="v-messages theme--light error--text" role="alert">
        <div class="v-messages__wrapper">
          <div v-if="errorMessages" class="v-messages__message">
            {{ errorMessages }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { mapGetters } from 'vuex'

export default {
  name: 'da-editor',

  components: {
    VueEditor
  },

  props: {
    label: String,
    value: String,
    placeholder: String,
    errorMessages: String
  },

  data: () => ({
    source: false
  }),

  methods: {
    // пока не используется
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      return

      let formData = new FormData()
      formData.append('image', file)
      console.log('Тут будет запрос')

      // this.query.post(this.$config.api.crm, formData)
      // 	  .then(result => {
      // 		  let url = result.data.url; // Get url from response
      // 		  Editor.insertEmbed(cursorLocation, "image", url);
      // 		  resetUploader();
      // 	  })
      // 	  .catch(err => {
      // 		  console.log(err);
      // 	  });
      let url = 'https://cdn.vuetifyjs.com/images/lists/ali.png'
      Editor.insertEmbed(cursorLocation, 'image', url)
      resetUploader()
    },

    handleImageRemoved(file, Editor, cursorLocation, resetUploader) {
      console.log(file)
    }
  },

  computed: {
    ...mapGetters(['query'])
  }
}
</script>

<style lang="scss">
.da-editor-in {
  position: relative;

  .source {
    position: absolute;
    z-index: 4;
    bottom: 0;
    right: 0;
  }

  .v-textarea {
    .v-input__slot {
      height: 100%;
      margin-bottom: 0;
    }
  }
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.ql-container.ql-snow {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
