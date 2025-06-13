<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 px-3 text-center">
    <h1 class="mb-4">Registration Successful!</h1>
    <p class="lead mb-3">
      Thank you for registering. A confirmation email has been sent to your email address.
    </p>
    <p class="mb-4">
      Please check your inbox and click the verification link to activate your account.
    </p>
    <router-link to="/login" class="btn btn-primary">
      Go to Login
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No script logic needed here, this is a simple static page
</script>

<style scoped>
.vh-100 {
  min-height: 100vh;
}
</style>
