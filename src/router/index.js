import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        /*{
            path: '/clients',
            name: 'clients',
            // On crée ce composant juste après
            component: () => import('../views/ClientsView.vue')
        }*/
    ]
})

export default router