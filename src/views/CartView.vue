<!-- src/views/CartView.vue -->
<template>
  <div class="mx-auto mt-4" style="width: 70%;">
    <h2 class="mb-3">Your Cart</h2>
    <div class="table-responsive">
      <table class="table mx-auto" style="width: 100%;">
        <thead>
          <tr>
            <th class="text-center">Select</th>
            <th>Product</th>
            <th class="text-end">Price</th>
            <th class="text-center align-middle">Quantity</th>
            <th class="text-end">Subtotal</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id">
            <td class="text-center align-middle">
              <input
                type="checkbox"
                class="form-check-input"
                v-model.number="selectedIds"
                :value="item.id"
              />
            </td>
            <td>{{ item.product.name }}</td>
            <td class="text-end">RM {{ item.product.price.toFixed(2) }}</td>
            <td class="d-flex justify-content-center align-middle">
              <input
                type="number"
                v-model.number="item.quantity"
                @change="updateQuantity(item)"
                min="1"
                class="form-control form-control-sm"
                style="width: 4rem;"
              />
            </td>
            <td class="text-end">
              RM {{ (item.product.price * item.quantity).toFixed(2) }}
            </td>
            <td class="text-center align-middle">
              <button
                class="btn btn-outline-danger btn-sm"
                @click.stop="removeItem(item)"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="5" class="text-end">Total:</th>
            <th class="text-end">RM {{ selectedTotal.toFixed(2) }}</th>
          </tr>
        </tfoot>
      </table>
    </div>

    <button
      class="btn btn-success mt-3"
      :disabled="!selectedIds.length"
      @click="handleCheckout"
    >
      Checkout
    </button>

    <!-- Toasts -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index:11">
      <div
        ref="toastSuccessRef"
        class="toast align-items-center text-white bg-success border-0"
        role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="true" data-bs-delay="2000"
      >
        <div class="d-flex">
          <div class="toast-body">✔️ Purchase successful!</div>
          <button
            type="button" class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast" aria-label="Close"
          ></button>
        </div>
      </div>

      <div
        ref="toastErrorRef"
        class="toast align-items-center text-white bg-danger border-0"
        role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="true" data-bs-delay="2000"
      >
        <div class="d-flex">
          <div class="toast-body">❌ Purchase failed.</div>
          <button
            type="button" class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast" aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import Toast from 'bootstrap/js/dist/toast'
import { useCartStore } from '@/stores/cart'

const cart           = useCartStore()
const selectedIds    = ref<number[]>([])
const toastSuccessRef = ref<HTMLElement|null>(null)
const toastErrorRef   = ref<HTMLElement|null>(null)

onMounted(() => {
  cart.fetchCart()
})

const selectedTotal = computed(() =>
  cart.items
    .filter(i => selectedIds.value.includes(i.id))
    .reduce((sum, i) => sum + i.product.price * i.quantity, 0)
)

async function updateQuantity(item: { id: number; quantity: number }) {
  try {
    await cart.updateItemQuantity(item.id, item.quantity)
  } catch (err: any) {
    showErrorToast(err.message)
  }
}

async function removeItem(item: { id: number }) {
  await cart.removeItem(item.id)
  selectedIds.value = selectedIds.value.filter(id => id !== item.id)
}

async function handleCheckout() {
  try {
    await cart.checkout(selectedIds.value)
    showSuccessToast()
    selectedIds.value = []
    await cart.fetchCart()
  } catch (err: any) {
    showErrorToast(err.message)
  }
}

function showSuccessToast() {
  if (toastSuccessRef.value) new Toast(toastSuccessRef.value).show()
}

function showErrorToast(message: string) {
  if (!toastErrorRef.value) return
  const body = toastErrorRef.value.querySelector('.toast-body')
  if (body) body.textContent = message
  new Toast(toastErrorRef.value).show()
}
</script>

<style scoped>
.form-check-input {
  transform: scale(1.2);
  border: 2px solid var(--bs-primary);
  width: 1.25em;
  height: 1.25em;
}
.form-check-input:checked {
  background-color: var(--bs-secondary);
  border-color: var(--bs-secondary);
}
.form-check-input:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(244, 211, 94, 0.5);
}
</style>
