<script setup>
import { ref, onMounted } from 'vue'

const clients = ref([])
const selectedClient = ref(null)
const messages = ref([])
const newMessage = ref('')

const newClient = ref({
  name: '',
  company: '',
  mission: '',
  deadline: '',
  repo_link: '',
  project_link: ''
})

const fetchClients = async () => {
  const res = await fetch('http://localhost:3000/api/clients')
  clients.value = await res.json()
}

const openChat = async (client) => {
  selectedClient.value = client
  const res = await fetch(`http://localhost:3000/api/communications?client_id=${client.id}`)
  messages.value = await res.json()
}

const deleteClient = async (client) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ${client.name} ? Toutes les données associées seront effacées.`)) return

  try {
    const res = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      if (selectedClient.value && selectedClient.value.id === client.id) {
        selectedClient.value = null
      }
      fetchClients()
    } else {
      alert("Erreur lors de la suppression")
    }
  } catch (err) {
    console.error(err)
    alert("Impossible de contacter le serveur")
  }
}

const addClient = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return alert("Session expirée, reconnectez-vous.")

  await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...newClient.value, user_id: user.id })
  })
  newClient.value = { name: '', company: '', mission: '', deadline: '', repo_link: '', project_link: '' }
  fetchClients()
}

const startVideoCall = (client) => {
  const roomName = `LinkClients-${client.id}-${client.name.replace(/\s+/g, '-')}`;
  const videoUrl = `https://meet.jit.si/${roomName}`;
  window.open(videoUrl, '_blank');
  newMessage.value = "🎥 J'ai démarré un appel vidéo. Rejoignez-moi ici !";
  sendMessage();
}

const sendMessage = async () => {
  if (!newMessage.value) return
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
}

onMounted(fetchClients)
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <div class="flex-1 p-8 overflow-y-auto">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">Gestion des Missions Clients</h1>

      <div class="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase">Nom</label>
          <input v-model="newClient.name" type="text" class="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jean Dupont">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase">Entreprise</label>
          <input v-model="newClient.company" type="text" class="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dupont & Co">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase">Mission</label>
          <input v-model="newClient.mission" type="text" class="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Développement...">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase">Dépôt Code</label>
          <input v-model="newClient.repo_link" type="text" class="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="URL Git">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase">Lien Projet</label>
          <input v-model="newClient.project_link" type="text" class="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="URL Site">
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase">Deadline</label>
          <input v-model="newClient.deadline" type="date" class="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button @click="addClient" type="button" class="md:col-span-3 lg:col-span-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all">Ajouter la mission +</button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="p-4 text-xs font-bold text-gray-400 uppercase">Client</th>
            <th class="p-4 text-xs font-bold text-gray-400 uppercase">Mission & Liens</th>
            <th class="p-4 text-xs font-bold text-gray-400 uppercase">Deadline</th> <th class="p-4 text-xs font-bold text-gray-400 uppercase text-center">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="c in clients" :key="c.id" class="border-b hover:bg-blue-50/50 transition-colors">
            <td class="p-4">
              <div class="font-bold text-gray-800">{{ c.name }}</div>
              <div class="text-xs text-gray-500">{{ c.company }}</div>
            </td>
            <td class="p-4">
              <div class="flex flex-col gap-1">
                <span class="font-medium text-sm text-gray-700">{{ c.mission || 'En attente' }}</span>
                <div class="flex gap-3 mt-1">
                  <a v-if="c.repo_link" :href="c.repo_link" target="_blank" class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded hover:bg-gray-200">📁 Code</a>
                  <a v-if="c.project_link" :href="c.project_link" target="_blank" class="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-200">🚀 Site Live</a>
                </div>
              </div>
            </td>
            <td class="p-4">
              <div v-if="c.deadline" class="flex items-center text-sm font-semibold text-red-500">
                <span class="mr-1">📅</span> {{ new Date(c.deadline).toLocaleDateString() }}
              </div>
              <div v-else class="text-gray-300 text-xs">Non définie</div>
            </td>
            <td class="p-4">
              <div class="flex items-center justify-center gap-2">
                <button @click="openChat(c)" type="button" class="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                  Chat
                </button>
                <button @click="deleteClient(c)" type="button" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedClient" class="w-96 bg-white border-l border-gray-200 flex flex-col shadow-2xl">
      <div class="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
            {{ selectedClient.name.charAt(0) }}
          </div>
          <h3 class="font-bold">{{ selectedClient.name }}</h3>
        </div>
        <div class="flex items-center gap-2">
          <button @click="startVideoCall(selectedClient)" class="p-2 hover:bg-blue-500 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button @click="selectedClient = null" class="text-2xl font-light hover:text-red-300">×</button>
        </div>
      </div>
      <div class="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        <div v-for="m in messages" :key="m.id" :class="m.sender_type === 'prestataire' ? 'flex justify-end' : 'flex justify-start'">
          <div :class="m.sender_type === 'prestataire' ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg' : 'bg-white text-gray-800 border border-gray-200 rounded-r-lg rounded-tl-lg'" class="p-3 text-sm max-w-[85%] shadow-sm">
            {{ m.message }}
          </div>
        </div>
      </div>
      <div class="p-4 border-t bg-white flex gap-2">
        <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Message..." class="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
        <button @click="sendMessage" class="bg-blue-600 text-white p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
      </div>
    </div>
  </div>
</template>