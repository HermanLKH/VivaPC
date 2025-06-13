<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />
        <main class="container-fluid flex-grow-1 p-0">
          <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
</script>

<style scoped>
/* layout-specific styles here */
</style>
