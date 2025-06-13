import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router';
import { useAuthStore } from '@/stores/auth'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/custom-theme.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css'   // ← add this
import '@fortawesome/fontawesome-free/js/all.js'


async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()
    app.use(pinia)
    app.use(router)

    // 1) Initialize Auth (loads existing user & hooks onAuthStateChange)
    const auth = useAuthStore()
    await auth.initialize()

    // 2) Now mount
    app.mount('#app')
}

bootstrap()