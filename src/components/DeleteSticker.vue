<template>
    <span class="delete-sticker" v-bind:class="{active: active}" @click="$emit('deleteSticker')">LÖSCHEN</span>
</template>

<script>
export default {
  name: 'DeleteSticker',
  props: {
    active: false
  }
}
</script>

<style scoped>
  .delete-sticker {
    color: #fff;
    font-weight: bold;
    background-color: #888;
    padding: 1rem;
    display: inline-block;
  }

  .active {
    background-color: #ff0000;
  }
</style>
