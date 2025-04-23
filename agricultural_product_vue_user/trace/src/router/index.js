import { createRouter, createWebHistory } from 'vue-router'
import {Shop} from "@element-plus/icons-vue";

const routes = [
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/Shop.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  
  {
    path: '/production/:id',
    name: 'Production',
    component: () => import('../views/Production.vue')
  },
  {
    path: '/logistics/:id',
    name: 'Logistics',
    component: () => import('../views/Logistics.vue')
  },
  {
    path: '/sale/:id',
    name: 'Sale',
    component: () => import('../views/Sale.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/reg',
    name: 'reg',
    component: () => import('../views/Reg.vue')
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('../views/Product.vue')
  },
  {
    path: '/productinfo/:id',
    name: 'productDetail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/cart.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
