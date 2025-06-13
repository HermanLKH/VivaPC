<template>
  <div class="container my-5">
    <!-- Account Overview -->
    <h2 class="mb-4">My Account</h2>
    <div class="card mb-4">
      <div class="card-body">
        <p><strong>Username:</strong> {{ account.username }}</p>
        <p><strong>Email:</strong> {{ account.email }}</p>
      </div>
    </div>

    <!-- Account Settings -->
    <h3 class="mb-3">Account Settings</h3>
    <form @submit.prevent="updateAccount" class="mb-5">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="account.username"
          type="text"
          class="form-control"
          :disabled="loading"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="account.email"
          type="email"
          class="form-control"
          disabled
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading"
      >
        {{ loading ? 'Updating…' : 'Update' }}
      </button>
    </form>
  </div>

  <!-- Toast container (bottom-right) -->
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
        <div class="toast-body">Profile updated successfully.</div>
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
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import Toast from 'bootstrap/js/dist/toast'

const account = reactive({ username: '', email: '' })
const loading = ref(true)
const userId = ref<string|null>(null)

// Refs to the toast elements
const toastSuccessRef = ref<HTMLElement|null>(null)
const toastErrorRef   = ref<HTMLElement|null>(null)

// Show the success toast
function showSuccessToast() {
  if (toastSuccessRef.value) {
    new Toast(toastSuccessRef.value).show()
  }
}
// Show an error toast with custom message
function showErrorToast(message: string) {
  if (toastErrorRef.value) {
    const body = toastErrorRef.value.querySelector('.toast-body')
    if (body) body.textContent = message
    new Toast(toastErrorRef.value).show()
  }
}

// Fetch current user and profile on mount
async function getProfile() {
  loading.value = true
  try {
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr) throw userErr
    if (!user) throw new Error('Not authenticated')

    userId.value = user.id
    account.email = user.email || ''

    const { data, error: profErr, status } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', user.id)
      .single()

    if (profErr && status !== 406) throw profErr
    account.username = data?.username ?? ''
  } catch (err: any) {
    showErrorToast(err.message)
  } finally {
    loading.value = false
  }
}

// Update username only (won't create duplicates)
async function updateAccount() {
  if (!userId.value) {
    showErrorToast('User ID not found.')
    return
  }

  loading.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ username: account.username.trim() })
      .eq('user_id', userId.value)
    if (error) throw error

    showSuccessToast()
  } catch (err: any) {
    showErrorToast(err.message)
  } finally {
    loading.value = false
  }
}

onMounted(getProfile)
</script>

<style scoped>
/* no additional styles needed; Bootstrap handles toast styling */
</style>
