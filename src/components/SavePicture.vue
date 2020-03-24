<template>
  <span class="save-picture" @click="savePicture()">SPEICHERN</span>
</template>

<script>
export default {
  name: 'SavePicture',
  methods: {
    savePicture: () => {
      console.log('haha picture goes save')
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
