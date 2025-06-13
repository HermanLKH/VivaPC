<template>
  <div class="container my-5">
    <div v-if="loading" class="text-center py-5">
      Loading…
    </div>

    <div v-else-if="product" class="row g-4">
      <div class="col-md-6 text-center">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="img-fluid"
          style="max-height: 400px; object-fit: contain;"
        />
      </div>
      <div class="col-md-6">
        <h1 class="fw-bold">{{ product.name }}</h1>
        <p class="lead">{{ product.description }}</p>
        <h3 class="text-primary">{{ formatPrice(product.price) }}</h3>
        <button class="btn btn-secondary mt-3" @click="addToCart">
          Add to Cart
        </button>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Product not found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute }      from 'vue-router'
import { supabase }      from '@/utils/supabase'
import { useCartStore }  from '@/stores/cart'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
}

const route    = useRoute()
const cart     = useCartStore()
const product  = ref<Product | null>(null)
const loading  = ref(true)

async function fetchProduct() {
  loading.value = true
  const id = route.params.id
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!error && data) {
    product.value = {
      id:          String(data.id),
      name:        data.name,
      description: data.description,
      price:       data.price,
      category:    data.category || '',
      imageUrl:    data.image_url || ''
    }
  } else {
    product.value = null
    console.error('Fetch product error:', error)
  }
  loading.value = false
}

onMounted(fetchProduct)

function formatPrice(v: number) {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'MYR'
  }).format(v)
}

async function addToCart() {
  if (product.value) {
    await cart.addItem(product.value)
    // you could show a toast here if you like
  }
}
</script>

<style scoped>
img {
  border: 1px solid #e9ecef;
  border-radius: 0.25rem;
}
</style>
