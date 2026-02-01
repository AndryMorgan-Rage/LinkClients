<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Connexion réelle au serveur VS Code
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullname: name.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      alert("Compte créé avec succès ! Connectez-vous.")
      router.push('/') // Redirection vers le login
    } else {
      // On récupère l'erreur envoyée par Node.js
      errorMessage.value = data.error || "Une erreur est survenue lors de l'inscription."
    }
  } catch (err) {
    errorMessage.value = "Impossible de contacter le serveur backend."
    console.error("Erreur Fetch:", err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-gray-200 px-4">
    <div class="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all">

      <div class="w-full md:w-1/2 p-10">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Créer un compte</h2>
          <p class="text-gray-400 text-sm">Rejoignez la plateforme LinkClients</p>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
            <input v-model="name" type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-gray-50 transition-all" placeholder="Ex: Jean Dupont" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email professionnel</label>
            <input v-model="email" type="email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-gray-50 transition-all" placeholder="nom@entreprise.com" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input v-model="password" type="password" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-gray-50 transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70">
            <span v-if="isLoading">Création en cours...</span>
            <span v-else>S'inscrire</span>
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          <p class="text-gray-500">
            Déjà un compte ?
            <router-link to="/" class="font-bold text-blue-600 hover:text-blue-800 transition-colors">Se connecter</router-link>
          </p>
        </div>
      </div>

      <div class="w-full md:w-1/2 bg-blue-600 flex flex-col items-center justify-center p-10 text-white text-center">
        <h1 class="text-5xl font-black tracking-tighter mb-4">LinkClients</h1>
        <div class="h-1 w-16 bg-white rounded-full mb-6"></div>
        <p class="text-blue-100 max-w-xs">
          Commencez à organiser vos données clients et vos tâches en quelques clics.
        </p>
      </div>

    </div>
  </div>
</template>