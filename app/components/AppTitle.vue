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
        <p class="eyebrow app-byline">von <a :href="author.url" target="_blank" rel="noopener">{{ author.name }}</a></p>
      </div>
      <p class="eyebrow app-client">Immobilien Kontor Saarlouis</p>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  height: var(--header-h);
  background-color: var(--surface);
  border-bottom: 1px solid var(--line-strong);
}

.app-header-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
  padding: 0 var(--page-gutter) 0 0;
}

.app-logo {
  display: grid;
  place-items: center;
  flex: none;
  width: var(--header-h);
  height: 100%;
  color: var(--surface);
  background-color: var(--ink);
}

.app-heading {
  min-width: 0;
}

.app-title {
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.app-byline {
  margin-top: 1px;
  font-size: 0.6875rem;
}

.app-byline a {
  color: var(--ink-soft);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 2px;
  border-radius: 3px;
}

.app-byline a:hover {
  color: var(--accent);
  text-decoration-color: currentColor;
}

.app-client {
  display: none;
  margin-left: auto;
}

@media (min-width: 48rem) {
  .app-client {
    display: block;
  }
}

@media (min-width: 60rem) {
  .app-title {
    font-size: 1.125rem;
  }

  .app-byline {
    font-size: 0.75rem;
  }
}
</style>
