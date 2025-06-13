<template>
  <div class="card h-100 shadow-sm product-card">
    <!-- Image & title link to detail page -->
    <router-link
      :to="`/product/${product.id}`"
      class="text-decoration-none text-reset"
    >
      <img
        :src="product.imageUrl"
        class="card-img-top"
        :alt="product.name"
      />
      <div class="card-body">
        <h5 class="card-title title-clamp">{{ product.name }}</h5>
        <p class="card-text description-clamp">
          {{ product.description }}
        </p>
      </div>
    </router-link>

    <!-- footer: add to cart only -->
    <div class="card-footer d-flex justify-content-between align-items-center">
      <span class="price">{{ formatPrice(product.price) }}</span>
      <button
        class="custom-btn"
        @click.stop="handleAdd(product)"
      >
        Add to Cart
      </button>
    </div>

    <!-- Toasts -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div
        ref="toastSuccessRef"
        class="toast align-items-center text-white bg-success border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-autohide="true"
        data-bs-delay="2000"
      >
        <div class="d-flex">
          <div class="toast-body">Added to cart!</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
      <div
        ref="toastErrorRef"
        class="toast align-items-center text-white bg-danger border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-autohide="true"
        data-bs-delay="2000"
      >
        <div class="d-flex">
          <div class="toast-body">An error occurred.</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from 'bootstrap/js/dist/toast'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
}

const props = defineProps<{ product: Product }>()
const cart  = useCartStore()
const auth   = useAuthStore()
const router = useRouter()

const toastSuccessRef = ref<HTMLElement | null>(null)
const toastErrorRef   = ref<HTMLElement | null>(null)

function formatPrice(v: number) {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'MYR'
  }).format(v)
}

async function handleAdd(item: Product) {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  try {
    await cart.addItem(item)
    showSuccessToast()
  } catch (err: any) {
    showErrorToast(err.message || 'Failed to add to cart.')
  }
}

function showSuccessToast() {
  if (toastSuccessRef.value) {
    new Toast(toastSuccessRef.value).show()
  }
}

function showErrorToast(message: string) {
  if (toastErrorRef.value) {
    const body = toastErrorRef.value.querySelector('.toast-body')
    if (body) body.textContent = message
    new Toast(toastErrorRef.value).show()
  }
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
}
.card-img-top {
  object-fit: contain;
  height: 250px;
}
.title-clamp {
  display:            -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow:           hidden;

  /* make the box exactly two lines tall */
  line-height: 1.2em;           /* match your h5’s line-height */
  height:      2.4em;           /* = line-height × 2 */
}
.description-clamp {
  display:           -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow:          hidden;
}
.price {
  color:       var(--bs-primary);
  font-size:   1.2rem;
  font-weight: 600;
}
.custom-btn {
  background-color: var(--bs-secondary);
  border:           1px solid var(--bs-secondary);
  color:            var(--bs-dark);
  padding:          0.4rem 0.8rem;
  border-radius:    0.25rem;
  font-size:        0.9rem;
  transition:       background-color 0.2s, transform 0.1s;
}
.custom-btn:hover {
  background-color: rgba(244, 211, 94, 0.85);
  transform:        translateY(-1px);
}
</style>
