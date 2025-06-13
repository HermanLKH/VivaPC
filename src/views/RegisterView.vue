<template>
  <div ref="containerRef" class="row justify-content-center mt-5 position-relative">
    <div ref="formRef" class="col-md-6 position-relative" style="z-index: 10;">
      <div class="text-start mb-3">
        <SectionHeader title="Register" />
      </div>

      <div class="text-center negative-margin-up mb-4">
        <p class="lead">Create your account to get started.</p>
      </div>

      <form @submit.prevent="register" novalidate>
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

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.confirmPassword }"
            required
          />
          <div class="invalid-feedback" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
        </div>

        <button type="submit" class="btn btn-primary">Register</button>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import SectionHeader from '@/components/SectionHeader.vue'
import { supabase } from '@/utils/supabase'  // adjust path if needed

const router = useRouter()

const containerRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const touched = reactive({
  email: false,
})

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function onEmailBlur() {
  touched.email = true
  if (!form.email) {
    errors.email = 'Email is required.'
  } else if (!validateEmail(form.email.trim())) {
    errors.email = 'Email must be valid.'
  } else {
    errors.email = ''
  }
}

function validate() {
  if (!form.email) {
    errors.email = 'Email is required.'
  } else if (!validateEmail(form.email.trim())) {
    errors.email = 'Email must be valid.'
  } else {
    errors.email = ''
  }

  if (!form.password) {
    errors.password = 'Password is required.'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  } else {
    errors.password = ''
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required.'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  } else {
    errors.confirmPassword = ''
  }

  return !errors.email && !errors.password && !errors.confirmPassword
}

async function register() {
  if (!validate()) {
    alert('Please fix the form errors first.')
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
    })

    if (error) {
      alert(`Sign up error: ${error.message}`)
      return
    }

    // Redirect to confirm email page instead of alert
    router.push('/confirm-email')

  } catch (err: any) {
    alert(`Unexpected error: ${err.message || err}`)
  }
}

// Reactive refs for left/right image styles:
const leftImageStyle = ref({})
const rightImageStyle = ref({})

function updateImagePositions() {
  if (!containerRef.value || !formRef.value) return

  const containerRect = containerRef.value.getBoundingClientRect()
  const formRect = formRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth

  const leftCenterX = formRect.left / 2
  const rightCenterX = formRect.right + (viewportWidth - formRect.right) / 2

  const maxSize = 400
  const size = Math.min(
    maxSize,
    Math.max(150, viewportWidth / 4)
  )

  const leftImageLeft = leftCenterX - size / 2
  const rightImageLeft = rightCenterX - size / 2

  leftImageStyle.value = {
    position: 'absolute',
    bottom: '0',
    width: `${size}px`,
    height: `${size}px`,
    left: `${leftImageLeft}px`,
    userSelect: 'none',
    pointerEvents: 'none',
    opacity: 0.7,
    zIndex: 1,
  }

  rightImageStyle.value = {
    position: 'absolute',
    bottom: '0',
    width: `${size}px`,
    height: `${size}px`,
    left: `${rightImageLeft}px`,
    userSelect: 'none',
    pointerEvents: 'none',
    opacity: 0.7,
    zIndex: 1,
  }
}

onMounted(() => {
  updateImagePositions()
  window.addEventListener('resize', updateImagePositions)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateImagePositions)
})
</script>

<style scoped>
.row {
  position: relative; /* relative container for absolute images */
}

.negative-margin-up {
  margin-top: -2rem; /* move "Create your account..." text slightly upward */
  margin-bottom: 1rem;
}
</style>
