<template>
  <section class="testimonial-section py-5 bg-body">
    <div class="container">
      <SectionHeader title="What Our Customers Say" />
      <div class="row g-4">
        <div
          v-for="(t, index) in testimonials"
          :key="index"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card h-100 border-0 shadow-sm testimonial-card">
            <div class="card-body d-flex flex-column align-items-center text-center">
              <h6 class="mb-2">{{ t.name }}</h6>
              <p class="mb-4 flex-grow-1">“{{ t.content }}”</p>
              <small class="text-muted">
                <span v-for="n in t.rating" :key="n">★</span>
                <span v-for="n in (5 - t.rating)" :key="n + t.rating">★</span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SectionHeader from '@/components/SectionHeader.vue'

interface Testimonial {
  name: string
  content: string
  rating: number
}

const testimonials = ref<Testimonial[]>([
  {
    name: 'Stan Lee',
    content: 'VivaPC provided excellent components and service!',
    rating: 5,
  },
  {
    name: 'Jane Doe',
    content: 'Smooth shopping experience and quick delivery.',
    rating: 4,
  },
  {
    name: 'John Smith',
    content: 'Great prices and quality products.',
    rating: 5,
  },
])
</script>

<style scoped>
.card-body p {
  font-style: italic;
  color: var(--bs-dark);
}
.testimonial-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
