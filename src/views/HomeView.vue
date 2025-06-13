<!-- src/views/HomeView.vue -->
<template>
  <HeroSection />

  <NewArrivals @add-offer="addBundleToCart" />

  <WhatWeOffer />

  <SetList @add-set="addBundleToCart" />

  <TestimonialWall />
</template>

<script setup lang="ts">
import HeroSection            from '@/components/HeroSection.vue'
import SetList                from '@/components/SetList.vue'
import WhatWeOffer      from '@/components/WhatWeOffer.vue'
import NewArrivals              from '@/components/NewArrivals.vue'
import TestimonialWall        from '@/components/TestimonialWall.vue'
import { useCartStore }       from '@/stores/cart'

const cart = useCartStore()
function addBundleToCart(item: { id: number; name: string; price: number }) {
  cart.addItem({
    id:          String(item.id),
    name:        item.name,
    description: '',      // or a default/fallback
    price:       item.price,
    imageUrl:    '',      // placeholder
    category:    ''       // placeholder
  })
}
</script>

<style scoped>
/* you can override section backgrounds here, but most styling lives in each component */
</style>
