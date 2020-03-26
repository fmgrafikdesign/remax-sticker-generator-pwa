<template>
  <div class="image-canvas h100">
    <AppTitle />
    <div class="image-preview-wrapper" v-bind:class="{h50: imageData.length === 0, w100: imageData.length === 0}" >

      <div ref="composition" id="composition" class="composition h100 drop-shadow" v-if="imageData.length > 0">
        <!--<div ref="sticker_holder" class="sticker w100 h100 position-absolute top0 left0"> -->
          <Sticker ref="stickers" v-on:disable-all-other-moveables="disableAllOtherMoveables" v-for="sticker in stickers" :id="sticker.id" :image-data="sticker.url" v-bind:key="sticker.id" />
        <!--</div>-->
        <img ref="image" class="preview-image img-fluid mx-auto" :src="imageData" alt="Lade dein Bild hoch.">
      </div>

      <div class="file-upload-form drop-shadow image-placeholder" v-if="imageData.length === 0">
        <div class="image-upload-wrapper h100 w100">
        <input class="d-none" id="image-upload" name="image" type="file" @change="previewImage" accept="image/*" value="Bild hochladen">

        <label for="image-upload" class="upload-image-label"><svg class="placeholder-vector" viewBox="0 0 32 32"><path d="M29.996 4c0.001 0.001 0.003 0.002 0.004 0.004v23.993c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993zM30 2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2v0z"></path>
          <path d="M26 9c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
          <path d="M28 26h-24v-4l7-12 8 10h2l7-6z"></path></svg> <br> Bild wählen</label>
        </div>
      </div>
    </div>
    <CanvasBottomBar :stickers="stickers" :filename="filename" :selected-sticker="selectedSticker" :imageData="imageData" v-on:deleteSticker="deleteSticker" v-on:changePreview="onChildClick" />

  </div>
</template>

<script>
import CanvasBottomBar from '@/components/CanvasBottomBar'
import { EventBus } from '@/event-bus'
import Sticker from '@/components/Sticker'
import Vue from 'vue'
import AppTitle from '@/components/AppTitle'

export default {
  name: 'ImageCanvas',
  components: { AppTitle, Sticker, CanvasBottomBar },
  data: function () {
    return {
      nextStickerId: 0,
      imageData: '',
      selectedSticker: -1,
      filename: '',
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
      // console.log('disabling all other moveables... ', event)

      if (!this.$refs.stickers || this.$refs.stickers.length <= 0) return

      // console.log(this.$refs.stickers)

      this.selectedSticker = event
      this.$refs.stickers.forEach(sticker => {
        // console.log('comparing', sticker.id, event)
        if (sticker.id !== event) {
          // console.log('disabling moveable for sticker #', sticker.id)
          sticker.disableMoveable()
        }
      })
    },
    onChildClick (event) {
      this.previewImage(event)
    },
    previewImage: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        this.filename = input.files[0].name
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
          EventBus.$emit('image-available')
          // Delete stickers on new image
          this.stickers = []
          this.selectedSticker = -1

          // Save filename for saving later
          // This is less user-friendly than I hoped
          /*
          Vue.nextTick().then(() => {
            console.log('next tick: ', this.$refs.image.clientHeight)
            this.compositionWidth = this.$refs.image.clientHeight
          })
          */
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    deleteSticker () {
      this.stickers = this.stickers.filter(sticker => sticker.id !== this.selectedSticker)
      this.selectedSticker = -1
    },
    addSticker: function (sticker) {
      // Check if an image exists first
      if (this.imageData.length <= 0) {
        console.warn('Warning: Select an image first before applying stickers')
        this.$noty.warning('Wähle zuerst ein Bild aus, bevor du Sticker hinzufügst.')
        return
      }

      this.selectedSticker = this.nextStickerId
      this.disableAllOtherMoveables(this.selectedSticker)
      this.stickers.push({
        id: this.nextStickerId++,
        url: sticker
      })

      this.$noty.success('Sticker hinzugefügt!', { timeout: 1500 })
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
  background-color: #6d7275;
  border: 2px dashed #4d5361;
  border-radius: 4px;
}

  .image-upload-wrapper {
    display: table;
    padding-bottom: 10px
  }

.upload-image-label {
  width: 100%;
  height: 100%;
  display: table-cell;
  vertical-align: middle;
  padding-bottom: 10px;
  text-align: center;
  font-weight: bold;
  /* font-size: 90%; */
  color: #dce0ea;
  text-transform: uppercase;
  letter-spacing: 2px;
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

  .placeholder-vector {
    width: 25%;
    max-width: 80px;
    height: 110px;
    stroke: #b0b3bb;
    fill: #B0B3BB;
  }

</style>
