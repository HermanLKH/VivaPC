<template>
  <section class="section-light bg-body py-5">
    <div class="container">
      <SectionHeader title="What We Offer" />

      <div class="row row-cols-1 row-cols-md-4 g-4 text-center">
        <div v-for="item in features" :key="item.id" class="col">
          <img
            :src="item.icon"
            :alt="item.title"
            class="mb-3"
            style="width: 60px; height: 60px; object-fit: contain;"
          />
          <h6 class="fw-bold">{{ item.title }}</h6>
          <p class="small mb-0">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import SectionHeader from '@/components/SectionHeader.vue'

interface Feature { id: number; title: string; description: string; icon: string }
const features: Feature[] = [
  { id: 1, title: 'Same Day Delivery', description: 'Within Malaysia',       icon: new URL('../../public/fast_delivery.png',    import.meta.url).href },
  { id: 2, title: 'Worry Free',        description: '30-day replacement',    icon: new URL('../../public/worry_free.png',    import.meta.url).href },
  { id: 3, title: '0% Installments',   description: 'Up to 3 months by ATOME', icon: new URL('../../public/0_intereset.png',       import.meta.url).href },
  { id: 4, title: 'No Hidden Charge',  description: 'Transparent pricing',    icon: new URL('../../public/no_hidden.png', import.meta.url).href },
]
</script>