import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Product from '@/views/Product.vue';
import Logistics from '@/views/Logistics.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'product',
          component: Product,
        },
        {
          path: 'logistics',
          component: Logistics,
        },
        // 其他子路由
      ],
    },
    {
      path: '/',
      redirect: '/home/product',
    },
  ],
});