import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/pages/Login';
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import CustomerOrder from '@/components/pages/CustomerOrder';
import CustomerCheckout from '@/components/pages/CustomerCheckout';
import Orders from '@/components/pages/Orders';
import Coupons from '@/components/pages/Coupons';

Vue.use(Router);

export default new Router({
    routes:[
        // 非路由上的網址，自動導向至特定頁
        {
            path: '*',
            redirect: '/login',
        },
        // {
        //     path: '/',
        //     name: 'HelloWorld',
        //     component: HelloWorld,
        //     // 決定該頁面是否需要登入狀態驗證
        //     meta: { requiresAuth: true },
        // },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Dashboard,
            children: [
                {
                    path: 'products',
                    name: 'Products',
                    component: Products,
                    meta: { requiresAuth: true },
                },
                {
                    path: 'orders',
                    name: 'Orders',
                    component: Orders,
                    meta: { requiresAuth: true },
                },
                {
                    path: 'coupons',
                    name: 'Coupons',
                    component: Coupons,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
            children: [
                {
                    path: 'customer_order',
                    name: 'CustomerOrder',
                    component: CustomerOrder,
                },
                {
                    path: 'customer_checkout/:orderId',
                    name: 'CustomerCheckout',
                    component: CustomerCheckout,
                },
                {
                    path: 'customer_checkout',
                    name: 'CustomerCheckout',
                    component: CustomerCheckout,
                },
            ],
        },
    ],
});