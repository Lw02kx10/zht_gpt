import { createRouter, createWebHashHistory } from "vue-router"; 

const routes = [
    {
        path: '/',
        name: 'home',
        alias: '/home',
        component: () => import('../pages/MainHome.vue'),
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router