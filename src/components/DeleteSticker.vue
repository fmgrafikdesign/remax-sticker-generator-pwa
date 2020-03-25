<template>
  <div class="delete-sticker-wrapper button-wrapper" @click="$emit('deleteSticker')">
    <div class="delete-button button" v-bind:class="{active: active}">
      <svg class="icon icon-delete"><use xlink:href="#icon-delete"></use></svg>
    </div>
  </div>
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
  .delete-button {
  }
  .active {
    background-color: #e11b22;
  }
</style>
