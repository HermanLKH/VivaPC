// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import SearchResults from '@/views/SearchResults.vue';
import CategoryPage from '../views/CategoryPage.vue'
import CartView from '../views/CartView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import AccountView from '../views/AccountView.vue';
import PurchasesView from '../views/PurchasesView.vue';
import ProductDetailsView from '@/views/ProductDetailsView.vue';
import ConfirmEmail from '../views/ConfirmEmail.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/categories/:category', name: 'Category', component: CategoryPage, props: true },
  { path: '/search', name: 'Search', component: SearchResults },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/confirm-email', name: 'ConfirmEmail', component: ConfirmEmail },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/account', name: 'Account', component: AccountView },
  { path: '/purchases', name: 'Purchases', component: PurchasesView },
  { path: '/product/:id', name: 'ProductDetails', component: ProductDetailsView, props: true },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
