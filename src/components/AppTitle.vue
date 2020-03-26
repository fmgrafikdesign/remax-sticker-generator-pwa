<template>
    <div class="title-wrapper">
      <h1 class="app-title text-center">RE/MAX Sticker Generator</h1>
      <div class="app-subtitle">von <a href="https://fmgrafikdesign.de" target="_blank">Fabian Mohr</a></div>
    </div>
</template>
<script>
export default {
  name: 'AppTitle'
}
</script>
<style>
  .title-wrapper {
    background-color: #0054a4;
    padding: 1rem;
    box-shadow: 1px 7px 10px 0 rgba(1, 1, 1, .25);
  }

  .app-title {
    color: #fff;
    font-weight: 600;
    letter-spacing: 2px
  }

  .app-subtitle {
    color: #fff;
    text-align: center;
    text-decoration: none;
    margin-top: 5px;
    font-weight: 600;
    font-size: 80%
  }

  .app-subtitle a {
    color: #fff;
    text-decoration: none;
  }
</style>
