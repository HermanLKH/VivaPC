<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-0">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <span class="brand-text">VivaPC</span>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <!-- Search form -->
          <li class="nav-item me-4">
            <form @submit.prevent="onSearch" class="d-flex input-group input-group-sm">
              <input
                v-model="searchQuery"
                class="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button class="btn btn-outline-light" type="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </li>

          <!-- Categories Dropdown -->
          <li class="nav-item dropdown me-4">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="categoriesDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Categories
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="categoriesDropdown">
              <li v-for="cat in categories" :key="cat.value">
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'Category', params: { category: cat.value } }"
                >
                  {{ cat.name }}
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Cart always visible -->
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">Cart</router-link>
          </li>

          <!-- If not logged in, show Register & Login -->
          <li v-if="!auth.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li v-if="!auth.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>

          <!-- My Account & Purchases always shown, but redirect to /login if not logged in -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="auth.isLoggedIn ? '/account' : '/login'"
            >My Account</router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="auth.isLoggedIn ? '/purchases' : '/login'"
            >Purchases</router-link>
          </li>

          <!-- If logged in, show Logout -->
          <li v-if="auth.isLoggedIn" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const searchQuery = ref('')
function onSearch() {
  const q = searchQuery.value.trim()
  if (q) {
    router.push({ name: 'Search', query: { q } })
    searchQuery.value = ''
  }
}

async function logout() {
  await auth.signOut()
  router.push('/login')
}

// Categories list
const categories = [
  { name: 'PC Bundles',    value: 'pc bundles' },
  { name: 'PC Components', value: 'pc components' },
  { name: 'Peripherals',   value: 'peripherals' },
  { name: 'Storage',       value: 'storage' },
  { name: 'Laptops',       value: 'laptops' },
  { name: 'Apple',         value: 'apple' },
]
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
  font-size: 2rem;
}

.nav-link {
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: #ffc107 !important;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #495057;
  color: #fff;
}
</style>
