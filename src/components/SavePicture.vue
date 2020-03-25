<template>
  <span class="save-picture placeholder-css" @click="savePicture()">SPEICHERN</span>
</template>

<script>
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

export default {
  name: 'SavePicture',
  props: {
    filename: String
  },
  methods: {
    savePicture () {
      if (!document.querySelector('#composition')) {
        return
      }

      // TODO: [BUG] On mobile there is a small white border at the bottom of the saved picture

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
  .save-picture {
    color: #fff;
    font-weight: bold;
    background-color: forestgreen;
    padding: 1rem;
    display: inline-block;
  }

  .placeholder-css {
    margin-left: auto
  }
</style>
