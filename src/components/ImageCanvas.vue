<template>
  <div class="image-canvas h100">

    <div class="image-preview-wrapper" v-bind:class="{h50: imageData.length === 0, w100: imageData.length === 0}" >

      <div class="image-preview h100" v-if="imageData.length > 0">
        <img class="preview-image img-fluid drop-shadow mx-auto" :src="imageData">
      </div>

      <div class="file-upload-form drop-shadow image-placeholder" v-if="imageData.length === 0">
        <div class="image-upload-wrapper h100 w100">
        <input class="d-none" id="image-upload" name="image" type="file" @change="previewImage" accept="image/*" value="Bild hochladen">
        <label for="image-upload" class="upload-image-label">Bild hochladen</label>
        </div>
      </div>
    </div>
    <CanvasBottomBar :imageData="imageData" :selectedSticker="selectedSticker" v-on:changePreview="onChildClick" />

  </div>
</template>

<script>
import CanvasBottomBar from '@/components/CanvasBottomBar'
export default {
  name: 'ImageCanvas',
  components: { CanvasBottomBar },
  data: function () {
    return {
      imageData: '',
      selectedSticker: null
    }
  },
  methods: {
    onChildClick (event) {
      this.previewImage(event)
    },
    previewImage: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    }
  }
}
</script>

<style scoped>
  .image-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

.preview-image {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  display: block;
}

.image-preview-wrapper {
  padding: 1rem;
  margin: auto;
  min-height: 0;
  min-width: 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #a4d7f4;
  border: 3px dashed #0054a4;
  border-radius: 4px;
}

  .image-upload-wrapper {
    display: table;
  }

.upload-image-label {
  width: 100%;
  height: 100%;
  display: table-cell;
  vertical-align: middle;
  padding-bottom: 10px;
  text-align: center;
  font-weight: bold;
  color: #0054a4;
}

.drop-shadow {
  box-shadow:
    0 10.8px 23.6px rgba(0, 0, 0, 0.037),
    0 15.1px 30.6px rgba(0, 0, 0, 0.057),
    0 19.1px 36.1px rgba(0, 0, 0, 0.081),
    0 33px 60px rgba(0, 0, 0, 0.12)
;

}

.image-preview {
  max-height: 100%;
  max-width: 100%;
}
</style>
