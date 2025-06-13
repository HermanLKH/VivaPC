<!-- src/views/CategoryPage.vue -->
<template>
  <div class="container-xxl my-4">
    <h2 class="mb-3 text-capitalize">{{ categoryName }} Products</h2>

    <div v-if="paged.length" class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="product in paged" :key="product.id" class="col">
        <ProductCard :product="product" />
      </div>
    </div>
    <p v-else class="text-muted">No products found.</p>

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
import { useRoute }           from 'vue-router'
import { supabase }           from '../utils/supabase'
import ProductCard            from '@/components/ProductCard.vue'

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

const route        = useRoute()
const categoryName = computed(() => (route.params.category as string) || '')
const allProducts  = ref<Product[]>([])
const pageSize     = 6
const currentPage  = ref(1)

async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', categoryName.value)
    .order('id', { ascending: true })

  if (error) {
    console.error('Supabase error:', error.message)
    allProducts.value = []
  } else {
    allProducts.value = (data || []).map(r => ({
      id:          String(r.id),
      name:        r.name,
      description: r.description,
      price:       r.price,
      category:    r.category || '',
      imageUrl:    r.image_url || ''
    }))
    currentPage.value = 1
  }
}

onMounted(fetchProducts)
watch(categoryName, fetchProducts)

const paged = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allProducts.value.slice(start, start + pageSize)
})

const totalPages = computed(() =>
  Math.ceil(allProducts.value.length / pageSize)
)
</script>

<style scoped>
/* Pagination tweaks */
.pagination .page-link { transition: none !important; color: var(--bs-body-color); }
.pagination .page-item.active .page-link,
.pagination .page-item.active .page-link:hover { background-color: rgba(244, 211, 94, 0.2) !important; border-color: rgba(244, 211, 94, 0.2) !important; color: var(--bs-dark) !important; }
.pagination .page-link:hover:not(.active) { background-color: rgba(244, 211, 94, 0.2) !important; }
</style>
