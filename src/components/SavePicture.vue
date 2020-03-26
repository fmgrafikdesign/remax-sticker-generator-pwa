<template>
  <div class="save-sticker-wrapper ml-auto button-wrapper" @click="savePicture()">
    <div class="save-button button" v-bind:class="{active: active}">
      <svg class="icon icon-download" viewBox="0 0 32 32" >
        <path d="M16 18l8-8h-6v-8h-4v8h-6zM23.273 14.727l-2.242 2.242 8.128 3.031-13.158 4.907-13.158-4.907 8.127-3.031-2.242-2.242-8.727 3.273v8l16 6 16-6v-8z" />
      </svg>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

export default {
  name: 'SavePicture',
  props: {
    filename: String,
    active: false,
    stickers: Array
  },
  methods: {
    savePicture () {
      if (!document.querySelector('#composition')) {
        this.$noty.info('Wähle zuerst ein Bild aus.')
        return
      }

      if (this.stickers.length === 0) {
        this.$noty.show('Füge mindestens einen Sticker hinzu.')
        return
      }

      const composition = document.querySelector('#composition')
      const rect = composition.getBoundingClientRect()

      // Render html-composition to a canvas and save the canvas
      html2canvas(composition, {
        scrollX: 0,
        scrollY: -window.scrollY,
        // floor width & height to avoid white edges (losing 1px max in the process)
        width: Math.floor(rect.width),
        height: Math.floor(rect.height)
      }).then(canvas => {
        canvas.toBlob(blob => {
          // Remove file extension from name
          saveAs(blob, this.filename.replace(/\.[^/.]+$/, '') + '-stickers.jpg')
          this.$noty.success('Bild erfolgreich gespeichert! Du kannst es über die Statusleiste deines Telefons aufrufen & teilen.', { timeout: 5000 })
        }, 'image/jpeg')
      })
    }
  }
}
</script>

<style scoped>
  .active {
    background-color: forestgreen;
  }
</style>
