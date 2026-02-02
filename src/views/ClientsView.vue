<script setup>
import { ref, onMounted, computed } from 'vue'

const clients = ref([])
const selectedClient = ref(null)
const messages = ref([])
const newMessage = ref('')

// États pour les nouveaux clients
const newClient = ref({
  name: '',
  company: '',
  mission: '',
  deadline: '',
  repo_link: '',
  project_link: ''
})

// --- STATISTIQUES DYNAMIQUES ---
const stats = computed(() => {
  const totalMissions = clients.value.length
  const withDeadline = clients.value.filter(c => c.deadline).length
  const messageCount = messages.value.length

  return [
    { label: 'Missions Actives', value: totalMissions, color: 'bg-blue-600', percent: '100%' },
    { label: 'Projets avec Deadline', value: withDeadline, color: 'bg-blue-400', percent: '65%' },
    { label: 'Volume Messages', value: messageCount, color: 'bg-blue-800', percent: '40%' },
    { label: 'Satisfaction Client', value: '98%', color: 'bg-blue-500', percent: '98%' }
  ]
})

// --- LOGIQUE API ---
const fetchClients = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/clients')
    clients.value = await res.json()
  } catch (err) {
    console.error("Erreur fetch clients:", err)
  }
}

const openChat = async (client) => {
  selectedClient.value = client
  try {
    const res = await fetch(`http://localhost:3000/api/communications?client_id=${client.id}`)
    messages.value = await res.json()
  } catch (err) {
    console.error("Erreur fetch messages:", err)
  }
}

const deleteClient = async (client) => {
  if (!confirm(`Supprimer ${client.name} ? Cette action est irréversible.`)) return
  try {
    const res = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      if (selectedClient.value?.id === client.id) selectedClient.value = null
      fetchClients()
    }
  } catch (err) {
    alert("Erreur lors de la suppression")
  }
}

const addClient = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return alert("Session expirée, reconnectez-vous.")

  try {
    const res = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newClient.value, user_id: user.id })
    })
    if (res.ok) {
      newClient.value = { name: '', company: '', mission: '', deadline: '', repo_link: '', project_link: '' }
      fetchClients()
    }
  } catch (err) {
    alert("Erreur lors de l'ajout")
  }
}

const startVideoCall = (client) => {
  const roomName = `LinkClients-${client.id}-${client.name.replace(/\s+/g, '-')}`
  const videoUrl = `https://meet.jit.si/${roomName}`
  window.open(videoUrl, '_blank')
  newMessage.value = "🎥 Appel vidéo démarré. Cliquez pour rejoindre !"
  sendMessage()
}

const sendMessage = async () => {
  if (!newMessage.value || !selectedClient.value) return
  try {
    await fetch('http://localhost:3000/api/communications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: selectedClient.value.id,
        sender_type: 'prestataire',
        message: newMessage.value
      })
    })
    newMessage.value = ''
    openChat(selectedClient.value)
  } catch (err) {
    console.error("Erreur envoi message:", err)
  }
}

onMounted(fetchClients)
</script>

<template>
  <div class="flex h-screen bg-blue-50/40 font-sans overflow-hidden">

    <div class="flex-1 p-8 overflow-y-auto">

      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-black text-blue-900 tracking-tight text-left">LinkClients <span class="text-blue-500 font-medium italic">Pro</span></h1>
          <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 text-left">Espace de Gestion Prestataire</p>
        </div>
        <div class="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-blue-100">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">M</div>
          <div class="text-left">
            <p class="text-[10px] font-black text-gray-400 uppercase leading-none">Connecté</p>
            <p class="text-sm font-bold text-blue-900 leading-tight">Morgan @ Novity</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-left">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-50">
          <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">{{ stat.label }}</p>
          <div class="flex items-end justify-between">
            <span class="text-3xl font-black text-blue-900">{{ stat.value }}</span>
            <span class="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <div class="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div :class="stat.color" class="h-full transition-all duration-1000" :style="{ width: stat.percent }"></div>
          </div>
        </div>
      </div>

      <div class="mb-10 bg-blue-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 relative overflow-hidden text-left">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">✚</span>
          Nouvelle Mission & Ressources
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-blue-300 uppercase ml-1">Nom du client / Entreprise</label>
            <input v-model="newClient.name" type="text" class="bg-white/10 border border-white/10 rounded-2xl p-3.5 text-white text-sm outline-none focus:bg-white/20 transition-all" placeholder="ex: Jean Dupont (Novity)">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-blue-300 uppercase ml-1">Mission</label>
            <input v-model="newClient.mission" type="text" class="bg-white/10 border border-white/10 rounded-2xl p-3.5 text-white text-sm outline-none focus:bg-white/20 transition-all" placeholder="ex: Développement Web">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-blue-300 uppercase ml-1">Dépôt Git (Optionnel)</label>
            <input v-model="newClient.repo_link" type="text" class="bg-white/10 border border-white/10 rounded-2xl p-3.5 text-white text-sm outline-none focus:bg-white/20 transition-all" placeholder="https://github.com/...">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-blue-300 uppercase ml-1">Lien Projet Live</label>
            <input v-model="newClient.project_link" type="text" class="bg-white/10 border border-white/10 rounded-2xl p-3.5 text-white text-sm outline-none focus:bg-white/20 transition-all" placeholder="https://monsite.com">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-blue-300 uppercase ml-1">Date d'échéance</label>
            <input v-model="newClient.deadline" type="date" class="bg-white/10 border border-white/10 rounded-2xl p-3.5 text-white text-sm outline-none focus:bg-white/20 transition-all">
          </div>
          <div class="flex items-end">
            <button @click="addClient" class="w-full bg-white text-blue-900 font-black py-3.5 rounded-2xl hover:shadow-xl active:scale-95 transition-all uppercase text-xs tracking-widest">
              Enregistrer la mission
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] shadow-sm border border-blue-50 overflow-hidden text-left">
        <table class="w-full">
          <thead class="bg-blue-50/50">
          <tr>
            <th class="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Client</th>
            <th class="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Mission & Ressources</th>
            <th class="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Échéance</th>
            <th class="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">Actions</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-blue-50">
          <tr v-for="c in clients" :key="c.id" class="group hover:bg-blue-50/20 transition-colors">
            <td class="p-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black border border-blue-200 shadow-sm">
                  {{ c.name.charAt(0) }}
                </div>
                <div>
                  <div class="font-bold text-blue-900 text-base">{{ c.name }}</div>
                  <div class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{{ c.company || 'Sans Entreprise' }}</div>
                </div>
              </div>
            </td>
            <td class="p-6">
              <div class="flex flex-col gap-2">
                <span class="text-sm font-bold text-gray-700">{{ c.mission || 'Détails à venir' }}</span>
                <div class="flex gap-2">
                  <a v-if="c.repo_link" :href="c.repo_link" target="_blank" class="flex items-center gap-1.5 text-[9px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 transition-all uppercase">
                    <span class="text-xs">📁</span> Code
                  </a>
                  <a v-if="c.project_link" :href="c.project_link" target="_blank" class="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-all uppercase">
                    <span class="text-xs">🚀</span> Live
                  </a>
                </div>
              </div>
            </td>
            <td class="p-6">
              <div v-if="c.deadline" class="flex flex-col">
                <span class="text-xs font-black text-red-400 uppercase tracking-tighter">Deadline</span>
                <span class="text-sm font-bold text-blue-900">{{ new Date(c.deadline).toLocaleDateString() }}</span>
              </div>
              <span v-else class="text-gray-300 text-xs italic">Non définie</span>
            </td>
            <td class="p-6 text-center">
              <div class="flex items-center justify-center gap-3">
                <button @click="openChat(c)" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
                  Ouvrir Chat
                </button>
                <button @click="deleteClient(c)" class="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedClient" class="w-[450px] bg-white border-l border-blue-50 flex flex-col shadow-2xl animate-slide-left">
      <div class="p-6 bg-blue-900 text-white flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center font-black border border-white/20">
            {{ selectedClient.name.charAt(0) }}
          </div>
          <div class="text-left">
            <h3 class="font-bold">{{ selectedClient.name }}</h3>
            <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest">En ligne</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="startVideoCall(selectedClient)" class="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button @click="selectedClient = null" class="p-3 hover:bg-white/10 rounded-xl text-xl">×</button>
        </div>
      </div>

      <div class="flex-1 p-6 overflow-y-auto space-y-6 bg-blue-50/10">
        <div v-for="m in messages" :key="m.id" :class="m.sender_type === 'prestataire' ? 'flex justify-end' : 'flex justify-start'">
          <div :class="m.sender_type === 'prestataire' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-blue-900 border border-blue-50 rounded-2xl rounded-tl-none'" class="p-4 text-sm max-w-[85%] shadow-lg">
            {{ m.message }}
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-blue-50 bg-white">
        <div class="flex gap-3 bg-blue-50 rounded-[1.5rem] p-2">
          <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Échangez avec votre client..." class="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-medium">
          <button @click="sendMessage" class="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-800 transition-all shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-left { animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>