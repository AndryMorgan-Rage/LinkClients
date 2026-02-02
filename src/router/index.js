import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login' // Redirige automatiquement l'accueil vers le login
        },
        {
            path: '/login', // Ajout explicite du chemin /login
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