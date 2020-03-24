<template>
    <span class="delete-sticker" @click="deleteSticker()">DELETE</span>
</template>

<script>
export default {
  name: 'DeleteSticker',
  methods: {
    deleteSticker: () => {
      console.log('haha sticker goes poof')
    }
  }
}
</script>

<style scoped>
  .delete-sticker {
    color: #fff;
    font-weight: bold;
    background-color: #ff0000;
    padding: 1rem;
    display: inline-block;
  }
</style>
