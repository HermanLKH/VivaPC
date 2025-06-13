<template>
  <div class="container-xxl my-4">
    <h2 class="mb-3">Search Results for “{{ query }}”</h2>

    <div v-if="paged.length" class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="product in paged" :key="product.id" class="col">
        <ProductCard :product="product" @add-to-cart="$emit('add-to-cart', $event)" />
      </div>
    </div>
    <p v-else class="text-muted py-5 text-center">No results found for “{{ query }}”.</p>

    <nav v-if="totalPages > 1" aria-label="Page navigation">
      <ul class="pagination justify-content-center mt-4">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
            Previous
          </button>
        </li>
        <li
          v-for="n in totalPages"
          :key="n"
          class="page-item"
          :class="{ active: n === currentPage }"
        >
          <button class="page-link" @click="currentPage = n">{{ n }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'
import ProductCard from '@/components/ProductCard.vue'

interface ProductRow {
  id: number
  name: string
  description: string
  price: number
  category: string | null
  image_url: string | null
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
}

const route = useRoute()
const query = computed(() => (route.query.q as string || '').trim())

const allProducts = ref<Product[]>([])
const pageSize = 6
const currentPage = ref(1)

async function fetchProducts() {
  if (!query.value) {
    allProducts.value = []
    return
  }

  const searchPattern = `%${query.value.toLowerCase()}%`
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
    .order('id', { ascending: true })

  if (error) {
    console.error('Supabase error:', error.message)
    allProducts.value = []
  } else {
    allProducts.value = (data || []).map(r => ({
      id: String(r.id),
      name: r.name,
      description: r.description,
      price: r.price,
      category: r.category || '',
      imageUrl: r.image_url || ''
    }))
    currentPage.value = 1
  }
}

onMounted(fetchProducts)
watch(query, fetchProducts)

const paged = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allProducts.value.slice(start, start + pageSize)
})

const totalPages = computed(() =>
  Math.ceil(allProducts.value.length / pageSize)
)
</script>

<style scoped>
/* Truncate product names to 2 lines */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Pagination tweaks to match theme */
.pagination .page-link {
  transition: none !important;
  color: var(--bs-body-color);
}
.pagination .page-item.active .page-link,
.pagination .page-item.active .page-link:hover,
.pagination .page-item.active .page-link:focus {
  background-color: rgba(244, 211, 94, 0.2) !important;
  border-color: rgba(244, 211, 94, 0.2) !important;
  color: var(--bs-dark) !important;
}
.pagination .page-link:hover:not(.active) {
  background-color: rgba(244, 211, 94, 0.2) !important;
}
</style>
