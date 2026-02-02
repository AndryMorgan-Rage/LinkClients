<template>
  <div class="flex h-screen w-full overflow-hidden font-sans bg-blue-900">

    <div class="w-full lg:w-1/3 flex items-center justify-center relative z-30 p-8">
      <div class="absolute inset-0 bg-blue-800/50 backdrop-blur-2xl"></div>

      <div class="relative z-40 w-full max-w-md">
        <div class="mb-6">
          <h1 class="text-4xl font-extrabold text-white mb-2">LinkClients</h1>
          <p class="text-blue-200/70 text-sm">Sélectionnez votre profil pour vous connecter.</p>
        </div>

        <div class="flex bg-white/10 p-1 rounded-2xl mb-8 border border-white/10">
          <button
              v-for="role in roles"
              :key="role.id"
              @click="selectedRole = role.id"
              :class="[
              'flex-1 py-2.5 px-1 text-[11px] uppercase tracking-wider font-black rounded-xl transition-all duration-300',
              selectedRole === role.id ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-white/5'
            ]"
          >
            {{ role.label }}
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase mb-2 tracking-widest">
              Email {{ currentEmailHint }}
            </label>
            <input
                v-model="email"
                type="email"
                class="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-200/30 transition-all backdrop-blur-md"
                :placeholder="currentPlaceholder"
                required
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-blue-200 uppercase mb-2 tracking-widest">Mot de passe</label>
            <input
                v-model="password"
                type="password"
                class="w-full p-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:ring-2 focus:ring-white text-white placeholder-blue-200/30 transition-all backdrop-blur-md"
                placeholder="••••••••"
                required
            >
          </div>

          <button
              type="submit"
              class="w-full bg-white text-blue-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Se connecter ({{ currentRoleLabel }})
          </button>
        </form>

        <div class="mt-8 text-center text-sm">
          <span class="text-blue-200/60">Pas encore membre ?</span>
          <router-link to="/register" class="ml-2 text-white font-bold hover:underline">Créer un compte</router-link>
        </div>
      </div>
    </div>

    <div class="hidden lg:block lg:w-2/3 relative">
      <transition-group name="fade">
        <div
            v-for="(img, index) in images"
            :key="img"
            v-show="currentImage === index"
            class="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            :style="{ backgroundImage: `url(${img})` }"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-transparent"></div>
        </div>
      </transition-group>

      <div class="absolute bottom-20 left-20 z-20 text-white max-w-lg">
        <transition name="slide" mode="out-in">
          <div :key="currentImage">
            <h3 class="text-4xl font-bold mb-4 drop-shadow-lg">{{ slogans[currentImage].title }}</h3>
            <p class="text-xl text-white/90 leading-relaxed drop-shadow-md">{{ slogans[currentImage].text }}</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const currentImage = ref(0)
const selectedRole = ref('prestataire')

const roles = [
  { id: 'client', label: 'Client' },
  { id: 'prestataire', label: 'Prestataire' },
  { id: 'entreprise', label: 'Entreprise' }
]

const currentEmailHint = computed(() => {
  if (selectedRole.value === 'prestataire') return '(ex: morgan@novity.com)'
  if (selectedRole.value === 'client') return '(ex: nomduclient@gmail.com)'
  if (selectedRole.value === 'entreprise') return '(ex: nomdeEntreprise@gmail.com)'
  return ''
})

const currentPlaceholder = computed(() => {
  if (selectedRole.value === 'prestataire') return 'morgan@novity.com'
  if (selectedRole.value === 'client') return 'nomduclient@gmail.com'
  if (selectedRole.value === 'entreprise') return 'nomdeEntreprise@gmail.com'
  return 'votre@email.com'
})

const currentRoleLabel = computed(() => {
  return roles.find(r => r.id === selectedRole.value)?.label
})

const images = [
  'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
  'https://images.pexels.com/photos/10375901/pexels-photo-10375901.jpeg',
  'https://images.pexels.com/photos/7310202/pexels-photo-7310202.jpeg'
]

const slogans = [
  { title: "Collaborez efficacement", text: "Communiquez avec vos clients et suivez vos projets en temps réel." },
  { title: "Développez votre identité", text: "LinkClients structure votre stratégie marketing et votre image." },
  { title: "Gérez sans devinettes", text: "Suivez vos performances grâce à nos outils d'analyse intégrés." }
]

onMounted(() => {
  setInterval(() => {
    currentImage.value = (currentImage.value + 1) % images.length
  }, 6000)
})

// --- MODIFICATION ICI : REDIRECTION UNIQUE ---
const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: selectedRole.value
      })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data))
      // FORCE LA REDIRECTION VERS TA PAGE GESTION CLIENTS
      router.push('/clients')
    } else {
      alert(data.error || "Identifiants invalides")
    }
  } catch (err) {
    alert("Vérifiez que votre backend est bien lancé.")
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 1.5s ease-in-out; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active { transition: all 0.8s ease-out; }
.slide-enter-from { transform: translateY(20px); opacity: 0; }
</style>