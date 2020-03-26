<template>
  <div class="file-upload-form">
    <input id="change-image" class="d-none" type="file" @change="previewImage" accept="image/*">
    <label for="change-image" class="change-image-label text-center">Bild ändern</label>
  </div>
</template>

<script>
export default {
  name: 'ChoseAnotherPicture',
  methods: {
    previewImage: function (event) {
      this.$emit('changePreview', event)
    }
  }
}
</script>

<style scoped>
  .change-image-label {
    color: #7f8082;
    font-weight: bold;
    font-size: 90%;
    display: block;
  }

  .file-upload-form {
    width: 100%;
  }
</style>
