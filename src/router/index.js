import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
// Importe la nouvelle vue
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/clients',
            name: 'clients',
            component: () => import('../views/ClientsView.vue')
        }
    ]
})

export default router