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
    path: '/product/:id',
    name: 'Product',
    component: () => import('../views/Product.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
