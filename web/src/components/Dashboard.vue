<script setup lang="ts">
import { ref, computed } from 'vue';

// --- MOCK DATA ---
const agents = ref([
  {
    id: 'agent-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@company.com',
    phone: '+1 (555) 123-4567',
    propertiesCount: 3,
    notes: 'Top performer this quarter. Focus on luxury properties.',
    properties: [
      { id: 'prop-1', address: '123 Maple Street', city: 'San Francisco', state: 'CA', zip: '94102', price: 2500000, beds: 4, baths: 3 },
      { id: 'prop-2', address: '456 Oak Avenue', city: 'San Jose', state: 'CA', zip: '95110', price: 1800000, beds: 3, baths: 2 },
      { id: 'prop-3', address: '789 Pine Lane', city: 'Oakland', state: 'CA', zip: '94612', price: 1200000, beds: 2, baths: 1 }
    ]
  },
  {
    id: 'agent-2',
    name: 'James Rodriguez',
    email: 'james.rodriguez@company.com',
    phone: '+1 (555) 234-5678',
    propertiesCount: 2,
    notes: 'Specializes in commercial properties. Recently closed major deal.',
    properties: [
      { id: 'prop-4', address: '321 Commerce Boulevard', city: 'San Francisco', state: 'CA', zip: '94105', price: 4500000, beds: 0, baths: 2 },
      { id: 'prop-5', address: '654 Industrial Drive', city: 'Fremont', state: 'CA', zip: '94538', price: 3200000, beds: 0, baths: 4 }
    ]
  },
  {
    id: 'agent-3',
    name: 'Emily Chen',
    email: 'emily.chen@company.com',
    phone: '+1 (555) 345-6789',
    propertiesCount: 2,
    notes: 'New agent with strong client relations. Training in progress.',
    properties: [
      { id: 'prop-6', address: '147 Riverside Road', city: 'Berkeley', state: 'CA', zip: '94702', price: 950000, beds: 2, baths: 2 },
      { id: 'prop-7', address: '258 Garden Street', city: 'Hayward', state: 'CA', zip: '94542', price: 750000, beds: 1, baths: 1 }
    ]
  }
]);

// --- STATE ---
const selectedAgentId = ref('agent-1');
const expandedAgents = ref<Set<string>>(new Set(['agent-1', 'agent-2', 'agent-3']));

// --- COMPUTED ---
const selectedAgent = computed(() => agents.value.find(a => a.id === selectedAgentId.value));

// --- ACTIONS ---
const toggleExpand = (id: string) => {
  if (expandedAgents.value.has(id)) {
    expandedAgents.value.delete(id);
  } else {
    expandedAgents.value.add(id);
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="h-screen w-full bg-white flex flex-col font-sans text-gray-900 overflow-hidden">
    <!-- Top Header -->
    <header class="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
      <h1 class="text-xl font-bold text-gray-800 tracking-tight">Property Management</h1>
      <p class="text-base text-gray-500 font-medium">Manage agents, properties, and tenants</p>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-[500px] border-r border-gray-200 bg-[#F9FAFB] flex flex-col shrink-0">
        <div class="px-4 py-3 border-b border-gray-200">
          <p class="text-md font-bold text-gray-800">Agents ({{ agents.length }})</p>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-for="agent in agents" :key="agent.id" class="border-b border-gray-100 last:border-b-0">
            <!-- Agent Row -->
            <div 
              @click="selectedAgentId = agent.id"
              :class="['group px-4 py-3 cursor-pointer flex items-start gap-2 relative', selectedAgentId === agent.id ? 'bg-[#E5E9F0]' : 'hover:bg-gray-100']"
            >
              <div v-if="selectedAgentId === agent.id" class="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600"></div>
              
              <button @click.stop="toggleExpand(agent.id)" class="mt-1 text-gray-500">
                <svg v-if="expandedAgents.has(agent.id)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>

              <div class="flex-1 min-w-0">
                <p class="text-md font-semibold text-gray-900">{{ agent.name }}</p>
                <p class="text-sm text-gray-500 truncate mt-0.5">{{ agent.email }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <span class="text-sm text-gray-400">@</span>
                  <span class="text-sm font-medium text-gray-500">{{ agent.propertiesCount }} properties</span>
                </div>
              </div>

              <!-- Trash Icon -->
              <button class="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-white rounded transition-all shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <!-- Nested Properties -->
            <div v-if="expandedAgents.has(agent.id)" class="bg-gray-50/50">
              <div 
                v-for="prop in agent.properties" 
                :key="prop.id"
                class="px-10 py-2.5 flex items-start gap-2 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                 <svg class="w-3 h-3 text-gray-300 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 <div class="min-w-0">
                   <p class="text-md font-medium text-gray-700 truncate">{{ prop.address }}</p>
                   <p class="text-sm text-gray-400 font-medium truncate">{{ prop.city }}, {{ prop.state }}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50/30 p-10">
        <div v-if="selectedAgent" class="max-w-4xl mx-auto space-y-10 animate-fade-in">
          <!-- Header Hero -->
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <h2 class="text-4xl font-bold text-gray-900 tracking-tight">{{ selectedAgent.name }}</h2>
              <p class="text-gray-500 font-medium text-lg">{{ selectedAgent.email }}</p>
            </div>
            <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
          </div>

          <!-- Information Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-8 py-4 border-b border-gray-100 bg-gray-50/30">
              <p class="text-md font-bold text-gray-700">Agent Information</p>
            </div>
            <div class="p-8 grid grid-cols-2 gap-y-8">
              <div>
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</p>
                <p class="text-md font-bold text-gray-800 italic">{{ selectedAgent.email }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</p>
                <p class="text-md font-bold text-gray-800 italic">{{ selectedAgent.phone }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Notes</p>
                <p class="text-md text-gray-700 font-medium leading-relaxed">{{ selectedAgent.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Properties Managed Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-8 py-5 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2">
               <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               <p class="text-base font-bold text-gray-700">Managed Properties ({{ selectedAgent.properties.length }})</p>
            </div>
            <div class="p-8 space-y-4">
              <div v-for="prop in selectedAgent.properties" :key="prop.id" class="p-6 border border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                <p class="text-md font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{{ prop.address }}</p>
                <p class="text-sm text-gray-400 font-bold mt-0.5">{{ prop.city }}, {{ prop.state }} {{ prop.zip }}</p>
                <div class="flex gap-4 mt-3 text-sm font-bold text-gray-500">
                  <span>{{ formatPrice(prop.price) }}</span>
                  <span class="text-gray-200">•</span>
                  <span>{{ prop.beds }} bd • {{ prop.baths }} ba</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
</style>
