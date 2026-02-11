<template>
  <div class="min-h-screen bg-blue-900 flex items-center justify-center p-6 text-center">
    <div class="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 shadow-2xl max-w-2xl">
      <div class="mb-8">
        <h1 class="text-5xl font-black text-white mb-4 tracking-tighter">
          Bienvenue, <span class="text-blue-400">{{ user.fullname }}</span> !
        </h1>
        <div class="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/30">
          Espace Client LinkClients
        </div>
      </div>

      <p class="text-blue-100/70 text-lg leading-relaxed mb-10">
        Votre compte a été créé avec succès. Cet espace vous permettra bientôt de suivre l'avancement de vos missions, d'accéder à vos liens de ressources (Git, Live) et d'échanger avec votre prestataire.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p class="text-blue-300 text-xs font-bold uppercase mb-1">Rôle</p>
          <p class="text-white font-bold capitalize">{{ user.role }}</p>
        </div>
        <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
          <p class="text-blue-300 text-xs font-bold uppercase mb-1">Status</p>
          <p class="text-green-400 font-bold italic">En attente de mission</p>
        </div>
      </div>

      <button @click="logout" class="mt-12 text-white/40 hover:text-white underline text-sm transition-all">
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>