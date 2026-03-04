<script setup lang="ts">
import { ref } from 'vue';
import type { PropertyAgent, Property } from '../types';

const props = defineProps<{
  agents: PropertyAgent[];
  selectedAgentId?: string;
  selectedPropertyId?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-agent', id: string): void;
  (e: 'select-property', agentId: string, propertyId: string): void;
  (e: 'view-notes', agentId: string): void;
}>();

const expandedAgents = ref<Set<string>>(new Set());

const toggleExpand = (id: string) => {
  if (expandedAgents.value.has(id)) {
    expandedAgents.value.delete(id);
  } else {
    expandedAgents.value.add(id);
  }
};

const handleAgentClick = (agent: PropertyAgent) => {
  if (agent.id) {
    emit('select-agent', agent.id);
    toggleExpand(agent.id);
  }
};
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50 border-r border-slate-200 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-slate-200 bg-white">
      <h2 class="text-xl font-bold text-slate-900">Property Agents</h2>
      <p class="text-sm text-slate-500 mt-1">Manage your team and their portfolios</p>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-24 bg-slate-200 animate-pulse rounded-xl"></div>
      </div>

      <div v-else-if="agents.length === 0" class="text-center py-12">
        <div class="text-4xl mb-3">🏢</div>
        <p class="text-slate-500 font-medium">No agents found</p>
      </div>

      <div v-for="agent in agents" :key="agent.id" class="space-y-1">
        <!-- Agent Card -->
        <div
          @click="handleAgentClick(agent)"
          :class="[
            'p-4 rounded-xl transition-all cursor-pointer border group',
            selectedAgentId === agent.id
              ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-100'
              : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-xs'
          ]"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 :class="['font-bold transition-colors', selectedAgentId === agent.id ? 'text-indigo-600' : 'text-slate-900']">
                {{ agent.firstName }} {{ agent.lastName }}
              </h3>
              <div class="flex flex-col gap-0.5 mt-1">
                <span class="text-xs text-slate-500 flex items-center gap-1.5">
                  <span class="opacity-70">✉️</span> {{ agent.email }}
                </span>
                <span class="text-xs text-slate-500 flex items-center gap-1.5">
                  <span class="opacity-70">📱</span> {{ agent.mobileNumber }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span @click.stop="agent.id && emit('view-notes', agent.id)" class="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                {{ agent.noteCount || 0 }} Notes
              </span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {{ agent.propertyCount || 0 }} Properties
              </span>
            </div>
          </div>
        </div>

        <!-- Expanded Properties -->
        <div v-if="expandedAgents.has(agent.id!)" class="pl-6 pr-2 py-1 space-y-1 overflow-hidden transition-all">
          <div
            v-for="prop in agent.properties"
            :key="prop.id"
            @click="emit('select-property', agent.id!, prop.id)"
            :class="[
              'p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center',
              selectedPropertyId === prop.id
                ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
            ]"
          >
            <div class="flex flex-col">
              <span class="text-sm font-semibold leading-tight">{{ prop.address }}</span>
              <span class="text-[10px] opacity-70">{{ prop.city }}, {{ prop.state }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                {{ prop.tenantCount || 0 }} Tenants
              </span>
              <span class="text-slate-300">→</span>
            </div>
          </div>
          <div v-if="!agent.properties || agent.properties.length === 0" class="p-3 text-center text-xs text-slate-400 italic bg-white/50 rounded-lg border border-dashed border-slate-200">
            No properties managed
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
