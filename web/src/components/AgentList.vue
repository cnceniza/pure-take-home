<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';
import type { PropertyAgent } from '../types';

const props = defineProps<{
  selectedAgentId?: string;
  selectedPropertyId?: string;
}>();

const emit = defineEmits<{
  (e: 'select-agent', id: string): void;
  (e: 'select-property', agentId: string, propertyId: string): void;
  (e: 'delete-agent', id: string): void;
}>();

const agents = ref<PropertyAgent[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const expandedAgents = ref<Set<string>>(new Set());

const fetchAgents = async () => {
  loading.value = true;
  try {
    const response = await api.get('/agents');
    agents.value = response.data.data;
    if (agents.value.length > 0) {
      expandedAgents.value.add(agents.value[0].id!);
    }
  } catch (err: any) {
    error.value = 'Failed to load agents';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const toggleExpand = (id: string) => {
  if (expandedAgents.value.has(id)) {
    expandedAgents.value.delete(id);
  } else {
    expandedAgents.value.add(id);
  }
};

onMounted(() => {
  fetchAgents();
});
</script>

<template>
  <aside class="w-[500px] border-r border-gray-200 bg-[#F9FAFB] flex flex-col shrink-0">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200">
      <p class="text-sm font-bold text-gray-800">Agents ({{ agents.length }})</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 text-center">
      <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">Loading records...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 text-center text-red-500">
      <p class="text-sm font-bold uppercase tracking-widest">{{ error }}</p>
      <button @click="fetchAgents" class="mt-2 text-[10px] font-black underline uppercase">Retry Fetch</button>
    </div>

    <!-- List -->
    <div v-else class="flex-1 overflow-y-auto">
      <div v-for="agent in agents" :key="agent.id" class="border-b border-gray-100 last:border-b-0">
        <!-- Agent Row -->
        <div 
          @click="agent.id && emit('select-agent', agent.id)"
          :class="[
            'group px-4 py-3 cursor-pointer flex items-start gap-3 relative transition-colors', 
            selectedAgentId === agent.id ? 'bg-[#E5E9F0]' : 'hover:bg-gray-100'
          ]"
        >
          <div v-if="selectedAgentId === agent.id" class="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600"></div>
          
          <button @click.stop="agent.id && toggleExpand(agent.id)" class="mt-1 text-gray-400 hover:text-blue-600 transition-colors">
            <svg v-if="expandedAgents.has(agent.id!)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div class="flex-1 min-w-0">
            <p class="text-md font-semibold text-gray-900 leading-tight">{{ agent.firstName }} {{ agent.lastName }}</p>
            <p class="text-sm text-gray-500 truncate mt-0.5">{{ agent.email }}</p>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="text-md text-gray-300">@</span>
              <span class="text-xs font-bold text-gray-400 underline decoration-slate-200 uppercase tracking-tighter">
                {{ agent.propertyCount || 0 }} managed assets
              </span>
            </div>
          </div>

          <!-- Trash Icon -->
          <button 
            @click.stop="agent.id && emit('delete-agent', agent.id)"
            class="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white text-red-500 rounded-md transition-all shrink-0 shadow-sm border border-transparent hover:border-red-100"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Nested Properties -->
        <div v-if="expandedAgents.has(agent.id!)" class="bg-gray-50/50 border-t border-gray-100/50">
          <div 
            v-for="prop in agent.properties" 
            :key="prop.id"
            @click="emit('select-property', agent.id!, prop.id)"
            :class="[
              'px-11 py-2.5 flex items-start gap-2.5 transition-all cursor-pointer group hover:bg-white border-l-2',
              selectedPropertyId === prop.id ? 'border-blue-600 bg-white' : 'border-transparent'
            ]"
          >
            <svg class="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div class="min-w-0">
              <p :class="['text-md font-semibold truncate', selectedPropertyId === prop.id ? 'text-blue-600' : 'text-gray-700']">
                {{ prop.address }}
              </p>
              <p class="text-sm text-gray-400 font-medium truncate mt-0.5">{{ prop.city }}, {{ prop.state }}</p>
            </div>
          </div>
          <div v-if="!agent.properties || agent.properties.length === 0" class="px-11 py-3 text-[10px] text-gray-400 italic">
            No active property listings
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
