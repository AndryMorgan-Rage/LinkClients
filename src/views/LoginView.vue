<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  // Simulation d'authentification
  setTimeout(() => {
    if (email.value === 'admin@test.com' && password.value === 'admin') {
      // Redirection vers la gestion des clients (à créer)
      router.push('/clients')
    } else {
      error.value = "Identifiants invalides (Essaye admin@test.com / admin)"
      isLoading.value = false
    }
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-200 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 transform transition-all">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Gestion Clients</h2>
        <p class="text-gray-500 mt-2">Heureux de vous revoir !</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div v-if="error" class="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden transition-all"
              placeholder="votre@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden transition-all"
              placeholder="••••••••"
          />
        </div>

        <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion...
          </span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-gray-400">
        Besoin d'aide ? <a href="mailto:hei.andry.3@gmail.com" class="text-blue-500 hover:underline">Contactez le support</a>
      </p>
    </div>
  </div>
</template>