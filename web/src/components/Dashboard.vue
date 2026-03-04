<script setup lang="ts">
import { ref } from 'vue';
import AgentList from './AgentList.vue';
import AgentDetail from './AgentDetail.vue';
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
        <AgentDetail 
          v-else-if="selectedAgent" 
          :agent="selectedAgent" 
          :selectedPropertyId="selectedPropertyId"
        />

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
