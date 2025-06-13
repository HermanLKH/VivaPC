<!-- src/views/PurchasesView.vue -->
<template>
  <div class="mx-auto mt-4" style="width: 70%;">
    <h2 class="mb-3">My Purchases</h2>

    <div v-if="!purchases.length" class="text-center text-muted">
      You haven't made any purchases yet.
    </div>

    <div v-else class="table-responsive">
      <table class="table mx-auto" style="width: 100%;">
        <thead>
          <tr>
            <th>Date</th>
            <th class="text-start">Items</th>
            <th class="text-end">Total (RM)</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in purchases" :key="p.id">
            <td>{{ p.date }}</td>
            <td class="text-start">{{ p.items.join(', ') }}</td>
            <td class="text-end">{{ p.total.toFixed(2) }}</td>
            <td class="text-center text-capitalize">{{ p.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCartStore }       from '@/stores/cart'

const cart      = useCartStore()
const purchases = computed(() => cart.purchases)

onMounted(() => {
  cart.fetchPurchases()
})
</script>

<style scoped>
/* util classes handle layout; add more styles if you like */
</style>
