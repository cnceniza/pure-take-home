<script setup lang="ts">
import { ref } from 'vue';
import AgentList from './AgentList.vue';
import api from '../api';
import type { PropertyAgent } from '../types';

// --- STATE ---
const selectedAgentId = ref<string | null>(null);
const selectedAgent = ref<PropertyAgent | null>(null);
const selectedPropertyId = ref<string | null>(null);
const loadingDetails = ref(false);

// --- ACTIONS ---
const handleSelectAgent = async (id: string) => {
  if (selectedAgentId.value === id) return;
  
  selectedAgentId.value = id;
  selectedPropertyId.value = null;
  loadingDetails.value = true;
  
  try {
    const response = await api.get(`/agents/${id}`);
    selectedAgent.value = response.data;
  } catch (error) {
    console.error('Failed to fetch agent details:', error);
  } finally {
    loadingDetails.value = false;
  }
};

const handleSelectProperty = (agentId: string, propertyId: string) => {
  handleSelectAgent(agentId);
  selectedPropertyId.value = propertyId;
};

const handleAgentDelete = (deletedId: string) => {
  if (selectedAgentId.value === deletedId) {
    selectedAgentId.value = null;
    selectedAgent.value = null;
    selectedPropertyId.value = null;
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
      <p class="text-sm text-gray-500 font-medium">Manage agents, properties, and tenants</p>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar Component -->
      <AgentList 
        :selectedAgentId="selectedAgentId || undefined"
        :selectedPropertyId="selectedPropertyId || undefined"
        @select-agent="handleSelectAgent"
        @select-property="handleSelectProperty"
        @on-agent-delete="handleAgentDelete"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50/30 p-10">
        <!-- Loading State -->
        <div v-if="loadingDetails" class="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
           <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
           <div class="h-4 w-48 bg-gray-200 rounded"></div>
           <div class="h-3 w-32 bg-gray-100 rounded"></div>
        </div>

        <!-- Detail View -->
        <div v-else-if="selectedAgent" class="max-w-4xl mx-auto space-y-10 animate-fade-in">
          <!-- Header Hero -->
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <h2 class="text-4xl font-bold text-gray-900 tracking-tight">{{ selectedAgent.firstName }} {{ selectedAgent.lastName }}</h2>
              <p class="text-gray-500 font-medium text-lg">{{ selectedAgent.email }}</p>
            </div>
            <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          <!-- Information Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-8 py-4 border-b border-gray-100 bg-gray-50/30">
              <p class="text-sm font-bold text-gray-700">Agent Information</p>
            </div>
            <div class="p-8 grid grid-cols-2 gap-y-8">
              <div>
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</p>
                <p class="text-base font-bold text-gray-800 italic">{{ selectedAgent.email }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</p>
                <p class="text-base font-bold text-gray-800 italic">{{ selectedAgent.mobileNumber }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Record Created</p>
                <p class="text-base text-gray-700 font-medium leading-relaxed">
                  {{ selectedAgent.createdAt ? new Date(selectedAgent.createdAt).toLocaleDateString() : 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Properties Managed Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-8 py-5 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2">
               <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <p class="text-base font-bold text-gray-700">Managed Properties ({{ selectedAgent.properties?.length || 0 }})</p>
            </div>
            <div class="px-8 py-4 border-b border-gray-50">
               <p class="text-sm text-gray-400 font-medium">Full asset portfolio managed by this agent</p>
            </div>
            <div class="p-8 space-y-4">
              <div 
                v-for="prop in selectedAgent.properties" 
                :key="prop.id" 
                :class="[
                  'p-6 border rounded-xl transition-all cursor-pointer group',
                  selectedPropertyId === prop.id ? 'border-blue-600 bg-blue-50/30 shadow-sm' : 'border-gray-100 hover:border-blue-100 hover:bg-blue-50/20'
                ]"
              >
                <p :class="['text-base font-bold transition-colors', selectedPropertyId === prop.id ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600']">
                  {{ prop.address }}
                </p>
                <p class="text-sm text-gray-400 font-bold mt-0.5">{{ prop.city }}, {{ prop.state }} {{ prop.zip }}</p>
                <div class="flex gap-4 mt-3 text-sm font-bold text-gray-500">
                  <span v-if="prop.tenantCount !== undefined">{{ prop.tenantCount }} Tenants</span>
                  <span v-else>Active Asset</span>
                  <span class="text-gray-200">•</span>
                  <span class="text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase">Verified Listing</span>
                </div>
              </div>

              <div v-if="!selectedAgent.properties || selectedAgent.properties.length === 0" class="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                 <p class="text-sm text-gray-400 font-medium">No properties currently assigned to this agent.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="h-full flex flex-col items-center justify-center text-center p-10">
           <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-4">
              <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24-24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
           </div>
           <h3 class="text-lg font-bold text-gray-800">No Agent Selected</h3>
           <p class="text-sm text-gray-500 mt-1 max-w-xs">Select a property agent from the sidebar to view their portfolio and details.</p>
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
