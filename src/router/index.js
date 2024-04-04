import { createRouter, createWebHashHistory } from "vue-router"; 

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        alias: '/home',
        component: () => import('../pages/MainHome.vue'),
        children: [
            {
                path: ':chat_id',
                name: 'chat_context',
                component: () => import('../components/ChatContext.vue'),
            }
        ]
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router