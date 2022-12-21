import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('@/views/BaseView'),
        children: [
            {
                name: 'home',
                path: '/',
                component: () => import('@/views/HomeView')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/LoginView'),
    }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
