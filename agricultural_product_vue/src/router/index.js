import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Reg from '../views/Reg.vue';
import Production from '../views/Production.vue';
import Logistics from '../views/Logistics.vue';
import Personal from '../views/Personal.vue';
import Product from '../views/Product.vue';
import Sales from '../views/Sales.vue';
import Company from '../views/Company.vue';
import ProductionPlace from '../views/ProductionPlace.vue';
import SalePlace from '../views/SalePlace.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/reg',
        name: 'reg',
        component: Reg,
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        redirect: '/product',
        meta: {
            needLogin: true
        },
        children: [
            {
                path: '/product',
                name: 'product',
                component: Product,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/production',
                name: 'production',
                component: Production,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/ProductionPlace',
                name: 'ProductionPlace',
                component: ProductionPlace,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/logistics',
                name: 'logistics',
                component: Logistics,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/personal',
                name: 'personal',
                component: Personal,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/sales',
                name: 'sales',
                component: Sales,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/company',
                name: 'company',
                component: Company,
                meta: {
                    needLogin: true
                },
            },
            {
                path: '/salePlace',
                name: 'salePlace',
                component: SalePlace,
                meta: {
                    needLogin: true
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const needLogin = to.meta.needLogin;

    if (needLogin && !token) {
        // 如果需要登录且没有token，跳转到登录页面
        next({ path: '/' });
    } else {
        // 如果不需要登录或者有token，正常跳转
        next();
    }
});

export default router;