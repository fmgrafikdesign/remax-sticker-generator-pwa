<script setup lang="ts">
const author = { name: 'Fabian Mohr', url: 'https://fmgrafikdesign.de' }
</script>

<template>
  <header class="app-header">
    <div class="app-header-inner">
      <span class="app-logo" aria-hidden="true">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
          <path d="M15 3v6h6" />
          <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" />
          <path d="M8 13h.01" />
          <path d="M16 13h.01" />
        </svg>
      </span>
      <div class="app-heading">
        <h1 class="app-title">IKS Sticker Generator</h1>
        <p class="app-byline">von <a :href="author.url" target="_blank" rel="noopener">{{ author.name }}</a></p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  height: var(--header-h);
  color: #fff;
  background: linear-gradient(135deg, #0a63bb 0%, var(--brand) 45%, #003d7a 100%);
  box-shadow: 0 1px 0 rgb(255 255 255 / 12%) inset, 0 4px 16px -4px rgb(0 40 90 / 45%);
}

.app-header-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 100%;
  max-width: 100rem;
  margin: 0 auto;
  padding: 0 var(--page-gutter);
}

.app-logo {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  background-color: rgb(255 255 255 / 16%);
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 0.65rem;
}

.app-logo .icon {
  width: 1.375rem;
  height: 1.375rem;
}

.app-heading {
  min-width: 0;
}

.app-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.02em;
}

.app-byline {
  margin-top: 1px;
  font-size: 0.75rem;
  line-height: 1.2;
  color: rgb(255 255 255 / 75%);
}

.app-byline a {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 3px;
}

.app-byline a:hover {
  text-decoration: underline;
}

.app-byline a:focus-visible {
  box-shadow: 0 0 0 3px var(--brand), 0 0 0 5px #fff;
}

@media (min-width: 60rem) {
  .app-title {
    font-size: 1.25rem;
  }

  .app-logo {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
