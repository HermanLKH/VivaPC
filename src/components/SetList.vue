<template>
  <section class="section-light">
    <div class="container">
      <SectionHeader title="Our Viva PC Sets" />

      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="set in sets" :key="set.id" class="col">
          <div class="card h-100 shadow-sm product-card">
            <!-- clickable area -->
            <router-link
              :to="`/product/${set.id}`"
              class="text-decoration-none text-reset d-block h-100"
            >
              <img
                :src="set.image_url"
                class="card-img-top"
                :alt="set.name"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ set.name }}</h5>
                <p class="mt-auto fw-bold">RM {{ set.price.toFixed(2) }}</p>
              </div>
            </router-link>

            <!-- only this button adds to cart -->
            <div class="card-footer bg-transparent border-0 pt-0">
              <button
                class="btn btn-primary w-100 mt-2"
                @click.stop="handleAdd(set)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast container -->
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <!-- Success toast -->
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
        <!-- Error toast -->
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
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SectionHeader from '@/components/SectionHeader.vue'
import { supabase } from '@/utils/supabase'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import Toast from 'bootstrap/js/dist/toast'

interface Bundle {
  id: number
  name: string
  price: number
  image_url: string
}

const sets = ref<Bundle[]>([])
const cart = useCartStore()
const auth   = useAuthStore()
const router = useRouter()

const toastSuccessRef = ref<HTMLElement | null>(null)
const toastErrorRef   = ref<HTMLElement | null>(null)

async function fetchSets() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', [8, 9, 10])

  if (error) {
    console.error('Error fetching sets:', error)
    return
  }
  sets.value = data || []
}

onMounted(fetchSets)

async function handleAdd(item: Bundle) {
  if (!auth.isLoggedIn) {
    router.push('/login')
    return
  }
  try {
    await cart.addItem({
      id:          String(item.id),
      name:        item.name,
      description: '',
      price:       item.price,
      category:    '',
      imageUrl:    item.image_url
    })
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
  width: 100%;
  height: 180px;
  object-fit: contain;
  object-position: center center;
  background-color: var(--bs-light);
}
</style>
