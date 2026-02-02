<template>
  <div class="flex h-screen w-full overflow-hidden font-sans bg-blue-900">

    <div class="w-full lg:w-1/3 flex items-center justify-center relative z-30 p-8">
      <div class="absolute inset-0 bg-blue-800/50 backdrop-blur-2xl"></div>

      <div class="relative z-40 w-full max-w-md">
        <div class="mb-6">
          <h1 class="text-4xl font-extrabold text-white mb-2 tracking-tighter">LinkClients</h1>
          <p class="text-blue-200/70 text-sm">Créez votre compte en quelques secondes.</p>
        </div>

        <div class="flex bg-white/10 p-1 rounded-2xl mb-8 border border-white/10">
          <button
              v-for="role in roles" :key="role.id"
              type="button"
              @click="form.role = role.id"
              :class="[
              'flex-1 py-2.5 text-[11px] uppercase tracking-widest font-black rounded-xl transition-all duration-300',
              form.role === role.id ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-white/5'
            ]"
          >
            {{ role.label }}
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase mb-2 tracking-widest">
              {{ form.role === 'entreprise' ? "Nom de l'entreprise" : "Nom Complet" }}
            </label>
            <input v-model="form.name" type="text" required
                   class="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-200/30 transition-all"
                   :placeholder="form.role === 'entreprise' ? 'Novity SARL' : 'Morgan Andry'">
          </div>

          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase mb-2 tracking-widest">Email Professionnel</label>
            <input v-model="form.email" type="email" required
                   class="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-200/30 transition-all"
                   placeholder="votre@email.com">
          </div>

          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase mb-2 tracking-widest">Mot de passe</label>
            <input v-model="form.password" type="password" required
                   class="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-200/30 transition-all"
                   placeholder="••••••••">
          </div>

          <button type="submit"
                  class="w-full bg-white text-blue-900 font-black py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 uppercase text-xs tracking-[0.2em]">
            Créer mon compte {{ form.role }}
          </button>
        </form>

        <div class="mt-8 text-center text-sm relative z-50">
          <span class="text-blue-200/60">Déjà inscrit ?</span>
          <button
              @click="goToLogin"
              type="button"
              class="ml-2 text-white font-bold hover:underline bg-transparent border-none cursor-pointer outline-none"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>

    <div class="hidden lg:block lg:w-2/3 relative bg-blue-950">
      <div class="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')] bg-cover bg-center opacity-40"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-transparent"></div>
      <div class="absolute bottom-20 left-20 z-20 text-white max-w-lg text-left">
        <h3 class="text-5xl font-black mb-6 leading-tight">Rejoignez la <br/>communauté Pro.</h3>
        <p class="text-xl text-blue-100/80 font-light">Gérez vos missions, collaborez avec vos clients et développez votre business sur une seule plateforme.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const roles = [
  { id: 'client', label: 'Client' },
  { id: 'prestataire', label: 'Prestataire' },
  { id: 'entreprise', label: 'Entreprise' }
]

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'prestataire' // Valeur par défaut
})

const goToLogin = () => {
  router.push('/login')
}

const handleRegister = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role // Très important pour le dispatching côté backend
      })
    })

    const data = await res.json()

    if (res.ok) {
      // On affiche le succès et on précise où il a été créé
      alert(`Compte ${form.role} créé avec succès !`)
      goToLogin()
    } else {
      alert(data.error || "Erreur lors de l'inscription")
    }
  } catch (err) {
    console.error("Erreur réseau:", err)
    alert("Impossible de contacter le serveur.")
  }
}
</script>