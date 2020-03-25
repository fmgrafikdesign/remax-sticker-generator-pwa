<template>
  <div id="app">
    <image-wrapper/>
    <hr>
    <StickerList />
    <!--
    <hr>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import StickerList from '@/components/StickerList.vue'
import ImageWrapper from '@/components/ImageWrapper.vue'

export default Vue.extend({
  name: 'App',
  components: {
    ImageWrapper,
    StickerList
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
