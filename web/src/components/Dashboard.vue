<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AgentList from './AgentList.vue';
import AgentDetail from './AgentDetail.vue';
import AgentCreate from './AgentCreate.vue';
import api from '../api';
import type { PropertyAgent } from '../types';

// --- STATE ---
const selectedAgent = ref<PropertyAgent | null>(null);
const selectedPropertyId = ref<string | null>(null);
const loadingDetails = ref(false);
const isCreating = ref(false);

const agentListRef = ref<any>(null);

// --- ACTIONS ---
const handleSelectAgent = async (id: string) => {
  isCreating.value = false; // Exit creation mode when an agent is selected
  if (selectedAgent.value?.id === id) return; // If already selected, do nothing
  
  selectedAgent.value = null; // Clear current agent to show loading
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

const handleSelectProperty = async (agentId: string, propertyId: string) => {
  isCreating.value = false; // Exit creation mode when a property is selected
  if (!selectedAgent.value || selectedAgent.value.id !== agentId) {
    await handleSelectAgent(agentId); // Fetch agent details if not already selected
  }
  selectedPropertyId.value = propertyId;
};

const handleAgentDeleted = (deletedId: string) => {
  if (selectedAgent.value?.id === deletedId) {
    selectedAgent.value = null;
    selectedPropertyId.value = null;
  }
  isCreating.value = false; // Ensure creation mode is off if an agent is deleted
};

const handleUpdateSuccess = (updatedAgent: PropertyAgent) => {
  selectedAgent.value = updatedAgent;
  // Refresh the sidebar list to show potential name/email changes
  if (agentListRef.value) {
    agentListRef.value.fetchAgents();
  }
};

const handleCreateClick = () => {
  selectedAgent.value = null;
  selectedPropertyId.value = null;
  isCreating.value = true;
};

const handleCreateSuccess = (newAgent: PropertyAgent) => {
  isCreating.value = false;
  selectedAgent.value = newAgent;
  // Refresh the sidebar list to include the new agent
  if (agentListRef.value) {
    agentListRef.value.fetchAgents();
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
        ref="agentListRef"
        :selectedAgentId="selectedAgent?.id" 
        :selectedPropertyId="selectedPropertyId || undefined"
        @select-agent="handleSelectAgent"
        @select-property="handleSelectProperty"
        @agent-deleted="handleAgentDeleted"
        @create-click="handleCreateClick"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-[#F3F4F6] p-12">
        <div v-if="isCreating">
          <AgentCreate 
            @create-success="handleCreateSuccess"
            @cancel="isCreating = false"
          />
        </div>
        <div v-else-if="loadingDetails" class="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
           <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
           <div class="h-4 w-48 bg-gray-200 rounded"></div>
           <div class="h-3 w-32 bg-gray-100 rounded"></div>
        </div>
        <div v-else-if="selectedAgent">
          <AgentDetail 
            :agent="selectedAgent" 
            :selected-property-id="selectedPropertyId"
            @update-success="handleUpdateSuccess"
          />
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center text-center space-y-4">
          <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <svg class="w-16 h-16 text-gray-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-4 text-xl font-bold text-gray-900">No Agent Selected</h3>
            <p class="text-gray-500 max-w-xs mx-auto mt-2">Select an agent from the list or click the <span class="text-blue-600 font-bold">+</span> button to add a new one.</p>
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
