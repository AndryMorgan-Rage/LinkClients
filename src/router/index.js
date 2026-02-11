import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

// Composant de remplacement utilisant la fonction de rendu (évite l'erreur de runtime template)
const WelcomePlaceholder = {
    render() {
        return h('div', {
            style: {
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1e3a8a',
                color: 'white', // Correction : 'white' doit être une chaîne de caractères
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }
        }, [
            h('h1', { style: { fontSize: '3rem', marginBottom: '10px' } }, 'LinkClients'),
            h('p', { style: { opacity: '0.8' } }, 'Espace en cours de développement...'),
            h('a', {
                href: '/login',
                style: {
                    color: 'white',
                    marginTop: '30px',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                }
            }, 'Retour au Login')
        ])
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/prestataire',
            name: 'prestataire',
            component: () => import('../views/PrestataireView.vue'),
            meta: { requiresAuth: true, role: 'prestataire' }
        },
        {
            path: '/client',
            name: 'client',
            component: WelcomePlaceholder,
            meta: { requiresAuth: true, role: 'client' }
        },
        {
            path: '/entreprise',
            name: 'entreprise',
            component: WelcomePlaceholder,
            meta: { requiresAuth: true, role: 'entreprise' }
        }
    ]
})

/**
 * NAVIGATION GUARD
 */
router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // 1. Protection des routes sécurisées (requiresAuth)
    if (to.meta.requiresAuth) {
        // Si l'utilisateur n'est pas connecté
        if (!user) {
            return next('/login');
        }

        // Si l'utilisateur est connecté mais tente d'accéder à un rôle qui n'est pas le sien
        if (to.meta.role && user.role !== to.meta.role) {
            // On le redirige vers sa page légitime
            return next(`/${user.role}`);
        }
    }

    // 2. Pour les routes publiques (Login, Register), on laisse passer sans redirection automatique
    // Cela permet de rester sur Login au démarrage de l'application
    next();
})

export default router