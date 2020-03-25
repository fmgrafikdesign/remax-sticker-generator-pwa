<template>
  <span class="save-picture" @click="savePicture()">SPEICHERN</span>
</template>

<script>
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

export default {
  name: 'SavePicture',
  methods: {
    savePicture: () => {
      if (!document.querySelector('#composition')) {
        return
      }

      // Render html-composition to a canvas and save the canvas
      html2canvas(document.querySelector('#composition'), {
        scrollX: 0,
        scrollY: -window.scrollY
      }).then(canvas => {
        // document.body.appendChild(canvas)
        canvas.toBlob(blob => {
          saveAs(blob, 'nicejpg.jpg')
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
</style>
