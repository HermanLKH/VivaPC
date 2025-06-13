<template>
  <section
    :style="heroStyle"
    class="hero-section text-white d-flex align-items-center"
  >
    <div class="container text-center">
      <h1 class="display-3 fw-bold">Build Your Dream PC</h1>
      <p class="lead">
        At VivaPC, we curate the best components and bundles to power your passion.
      </p>
      <button
        class="btn btn-primary btn-lg mt-3"
        @click="scrollDown"
      >
        Shop Now
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const heroImage = '/hero.jpg'

const heroStyle = computed(() => ({
  backgroundImage: `url(${heroImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
}))

// scroll down by exactly one viewport height
function scrollDown() {
  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.hero-section {
  width: 100vw;
  min-height: 95vh;
  position: relative;
}
.hero-section::after {
  content: '';
  position: absolute;
  inset: 0;
  /* optional overlay:
     background: rgba(0,0,0,0.4);
  */
}
.hero-section .container {
  position: relative;
  z-index: 1;
}
</style>
