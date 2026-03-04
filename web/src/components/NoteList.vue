<script setup lang="ts">
import type { NoteReminder, PropertyAgent } from '../types';

defineProps<{
  notes: NoteReminder[];
  agent: PropertyAgent;
}>();

const getPropertyName = (agent: PropertyAgent, propertyId: string | null) => {
  if (!propertyId) return 'Across Portfolio';
  const prop = agent.properties?.find(p => p.id === propertyId);
  return prop ? prop.address : 'Unknown Property';
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getNoteTypeClass = (type: string) => {
  switch (type) {
    case 'Maintenance': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Inspection': return 'bg-green-50 text-green-600 border-green-100';
    case 'Pest Control': return 'bg-purple-50 text-purple-600 border-purple-100';
    default: return 'bg-blue-50 text-blue-600 border-blue-100';
  }
};
</script>

<template>
  <div class="space-y-4">
    <div 
      v-for="note in notes" 
      :key="note.id"
      class="p-5 border border-gray-100 rounded-xl bg-gray-50/20 hover:border-blue-100 transition-colors group"
    >
      <div class="flex justify-between items-start mb-2.5">
        <div class="flex flex-col gap-1">
          <span :class="['w-fit px-2 py-0.5 text-xs font-bold uppercase rounded border', getNoteTypeClass(note.type)]">
            {{ note.type }}
          </span>
          <div class="flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 uppercase tracking-tight">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {{ getPropertyName(agent, note.propertyId) }}
          </div>
        </div>
        <span class="text-xs font-bold text-gray-400 uppercase tracking-tighter">
          Due {{ formatDate(note.dueDate) }}
        </span>
      </div>
      <p class="text-md mt-4 font-semibold text-gray-800 leading-snug group-hover:text-gray-900 transition-colors">
        {{ note.description }}
      </p>
    </div>
  </div>
</template>
