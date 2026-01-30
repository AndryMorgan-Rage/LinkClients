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

  setTimeout(() => {
    if (email.value === 'admin@test.com' && password.value === 'admin') {
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
    <div class="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all">

      <div class="w-full md:w-1/2 p-10">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Connexion</h2>
          <p class="text-gray-400 text-sm">Accédez à votre compte</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div v-if="error" class="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">{{ error }}</div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input v-model="email" type="email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden transition-all bg-gray-50" placeholder="admin@test.com" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input v-model="password" type="password" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden transition-all bg-gray-50" placeholder="••••••••" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70">
            <span v-if="isLoading">Connexion...</span>
            <span v-else>Se connecter</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Pas encore de compte ?
            <router-link to="/register" class="font-bold text-blue-600 hover:text-blue-800">Créer un compte</router-link>
          </p>
        </div>

        <p class="mt-8 text-center text-xs text-gray-400">
          Besoin d'aide ? <a href="mailto:hei.andry.3@gmail.com" class="text-blue-500 hover:underline">Support</a>
        </p>
      </div>
      <div class="w-full md:w-1/2 bg-blue-600 flex flex-col items-center justify-center p-10 text-white text-center">
        <h1 class="text-5xl font-black tracking-tighter mb-4">LinkClients</h1>
        <div class="h-1 w-16 bg-white rounded-full mb-6"></div>
        <p class="text-blue-100 max-w-xs">La plateforme simplifiée pour la gestion de vos relations clients.</p>
      </div>
    </div>
  </div>
</template>
