<!-- src/views/LoginView.vue -->
<template>
  <div ref="containerRef" class="row justify-content-center mt-5 position-relative">
    <div ref="formRef" class="col-md-6 position-relative" style="z-index: 10;">
      <div class="text-start mb-3">
        <SectionHeader title="Login" />
      </div>

      <div class="text-center negative-margin-up mb-4">
        <p class="lead">Welcome back! Please login to continue.</p>
      </div>

      <form @submit.prevent="login" novalidate>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            required
            @blur="onEmailBlur"
          />
          <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            required
          />
          <div class="invalid-feedback" v-if="errors.password">{{ errors.password }}</div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>

    <!-- Decorative Images -->
    <img
      src="/doraemon.png"
      alt="Doraemon"
      class="decorative-image"
      :style="leftImageStyle"
      aria-hidden="true"
    />
    <img
      src="/super_mario.png"
      alt="Super Mario"
      class="decorative-image"
      :style="rightImageStyle"
      aria-hidden="true"
    />

    <!-- Error Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      ref="errorModalRef"
      aria-labelledby="errorModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="errorModalLabel" class="modal-title">Login Failed</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{ errorMessage }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SectionHeader from '@/components/SectionHeader.vue'
import { supabase } from '@/utils/supabase'
import Modal from 'bootstrap/js/dist/modal'

// refs for layout & images
const containerRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)
const leftImageStyle = ref({})
const rightImageStyle = ref({})

// form state
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const touched = reactive({ email: false })
const loading = ref(false)

// error modal state
const errorModalRef = ref<HTMLElement | null>(null)
const errorModal = ref<Modal | null>(null)
const errorMessage = ref('')

// Pinia auth & router
const auth = useAuthStore()
const router = useRouter()

// Email blur validation
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
function onEmailBlur() {
  touched.email = true
  if (!form.email) errors.email = 'Email is required.'
  else if (!validateEmail(form.email.trim())) errors.email = 'Email must be valid.'
  else errors.email = ''
}

// Overall form validation
function validate() {
  if (!form.email) errors.email = 'Email is required.'
  else if (!validateEmail(form.email.trim())) errors.email = 'Email must be valid.'
  else errors.email = ''

  errors.password = form.password ? '' : 'Password is required.'

  return !errors.email && !errors.password
}

// Submit handler
async function login() {
  if (!validate()) {
    return
  }

  loading.value = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.email.trim(),
    password: form.password,
  })
  loading.value = false

  if (error) {
    errorMessage.value = error.message
    errorModal.value?.show()
    return
  }

  const user = data.session?.user
  if (user) {
    // ensure Pinia store updates
    auth.setUser(user)
  }

  // navigate to account page
  router.push('/account')
}

// Dynamic positioning logic (unchanged)
function updateImagePositions() {
  if (!containerRef.value || !formRef.value) return
  const vw = window.innerWidth
  const containerRect = containerRef.value.getBoundingClientRect()
  const fr = formRef.value.getBoundingClientRect()
  const leftX = fr.left / 2
  const rightX = fr.right + (vw - fr.right) / 2
  const size = Math.min(400, Math.max(150, vw / 4))

  const topOffset = fr.top - containerRect.top + fr.height / 2 - size / 2

  leftImageStyle.value = {
    position: 'absolute',
    top: `${topOffset}px`,
    width: `${size}px`,
    height: `${size}px`,
    left: `${leftX - size / 2}px`,
    opacity: 0.7,
    zIndex: 1,
    userSelect: 'none',
    pointerEvents: 'none',
  }
  rightImageStyle.value = {
    position: 'absolute',
    top: `${topOffset}px`,
    width: `${size}px`,
    height: `${size}px`,
    left: `${rightX - size / 2}px`,
    opacity: 0.6,
    zIndex: 1,
    userSelect: 'none',
    pointerEvents: 'none',
  }
}

onMounted(() => {
  updateImagePositions()
  window.addEventListener('resize', updateImagePositions)
  if (errorModalRef.value) {
    errorModal.value = new Modal(errorModalRef.value)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateImagePositions)
})
</script>

<style scoped>
.row {
  position: relative;
}

.negative-margin-up {
  margin-top: -2rem;
  margin-bottom: 1rem;
}
/* decorative-image styling is inline via :style */
</style>
