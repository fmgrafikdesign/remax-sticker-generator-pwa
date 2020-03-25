<template>
  <div class="image-canvas h100">
    <div class="image-preview-wrapper" v-bind:class="{h50: imageData.length === 0, w100: imageData.length === 0}" >

      <div ref="composition" id="composition" class="composition h100" v-if="imageData.length > 0">
        <div ref="stickers" class="sticker w100 h100 position-absolute top0 left0">
          <Sticker ref="stickers" v-on:disable-all-other-moveables="disableAllOtherMoveables" v-for="sticker in stickers" :id="sticker.id" :image-data="sticker.url" v-bind:key="sticker.id" />
        </div>
        <img class="preview-image img-fluid drop-shadow mx-auto" :src="imageData" alt="Lade dein Bild hoch.">
      </div>

      <div class="file-upload-form drop-shadow image-placeholder" v-if="imageData.length === 0">
        <div class="image-upload-wrapper h100 w100">
        <input class="d-none" id="image-upload" name="image" type="file" @change="previewImage" accept="image/*" value="Bild hochladen">
        <label for="image-upload" class="upload-image-label">Bild hochladen</label>
        </div>
      </div>
    </div>
    <CanvasBottomBar :selected-sticker="selectedSticker" :imageData="imageData" v-on:deleteSticker="deleteSticker" v-on:changePreview="onChildClick" />

  </div>
</template>

<script>
import CanvasBottomBar from '@/components/CanvasBottomBar'
import { EventBus } from '@/event-bus'
import Sticker from '@/components/Sticker'

export default {
  name: 'ImageCanvas',
  components: { Sticker, CanvasBottomBar },
  data: function () {
    return {
      nextStickerId: 0,
      imageData: '',
      selectedSticker: -1,
      stickers: []
    }
  },
  created () {
    EventBus.$on('sticker-added', sticker => {
      this.addSticker(sticker)
    })
  },
  methods: {
    disableAllOtherMoveables (event) {
      console.log('disabling all other moveables... ', event)
      // console.log(this.$refs.testref)
      this.selectedSticker = event
      this.$refs.stickers.forEach(sticker => {
        console.log('comparing', sticker.id, event)
        if (sticker.id !== event) {
          console.log('disabling moveable for sticker #', sticker.id)
          sticker.disableMoveable()
        }
      })
    },
    onChildClick (event) {
      this.previewImage(event)
    },
    previewImage: function (event) {
      console.log(this.stickers)
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
          EventBus.$emit('image-available')
          // Delete stickers on new image
          this.stickers = []
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    updateMoveableBoundingBoxes () {
      if (!this.$refs.stickers || this.$refs.stickers.length <= 0) return

      console.log('updating all bounding rects...')
      this.$refs.stickers.forEach(sticker => {
        sticker.updateRect()
      })
    },
    deleteSticker () {
      console.log('haha sticker goes poof')
      this.stickers = this.stickers.filter(sticker => sticker.id !== this.selectedSticker)
      this.selectedSticker = -1
    },
    addSticker: function (sticker) {
      // Check if an image exists first
      if (this.imageData.length <= 0) {
        console.warn('Warning: Select an image first before applying stickers')
        alert('Wähle zuerst ein Bild aus, bevor du Sticker hinzufügst')
        return
      }

      this.stickers.push({
        id: this.nextStickerId,
        url: sticker
      })

      this.selectedSticker = this.nextStickerId
      this.disableAllOtherMoveables(this.selectedSticker)
      this.nextStickerId++
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

.composition {
  max-height: 100%;
  max-width: 100%;
  position: relative;
  overflow: hidden;
}

</style>
