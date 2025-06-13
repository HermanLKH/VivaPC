<!-- src/components/SectionHeader.vue -->
<template>
  <div class="section-header text-center mb-5">
    <h2 class="fw-bold">{{ title }}</h2>
    <hr class="mx-auto" style="width: 60px; border-top: 3px solid var(--bs-primary)" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped>
.section-header h2 {
  font-size: 1.75rem;
}
</style>
