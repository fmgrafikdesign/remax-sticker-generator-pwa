<template>
  <div class="save-sticker-wrapper ml-auto button-wrapper" @click="savePicture()">
    <div class="save-button button" v-bind:class="{active: active}">
      <svg class="icon icon-download" ><use xlink:href="#icon-download"></use></svg>
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
    active: false
  },
  methods: {
    savePicture () {
      if (!document.querySelector('#composition')) {
        return
      }

      // TODO: [BUG] On mobile there is a small white border at the bottom of the saved picture
      // TODO: Round (down) canvas dimensions

      // Render html-composition to a canvas and save the canvas
      html2canvas(document.querySelector('#composition'), {
        scrollX: 0,
        scrollY: -window.scrollY
      }).then(canvas => {
        // document.body.appendChild(canvas)
        canvas.toBlob(blob => {
          // Remove file extension from name
          saveAs(blob, this.filename.replace(/\.[^/.]+$/, '') + '-stickers.jpg')
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
