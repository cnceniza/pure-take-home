<script setup lang="ts">
import type { PropertyAgent } from '../types';

defineProps<{
  agent: PropertyAgent;
  selectedPropertyId?: string | null;
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10 animate-fade-in">
    <!-- Header Hero -->
    <div class="flex justify-between items-start">
      <div class="space-y-1">
        <h2 class="text-4xl font-bold text-gray-900 tracking-tight">{{ agent.firstName }} {{ agent.lastName }}</h2>
        <p class="text-gray-500 font-medium text-lg">{{ agent.email }}</p>
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
          <p class="text-base font-bold text-gray-800 italic">{{ agent.email }}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</p>
          <p class="text-base font-bold text-gray-800 italic">{{ agent.mobileNumber }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5">Record Created</p>
          <p class="text-base text-gray-700 font-medium leading-relaxed">
            {{ agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A' }}
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
         <p class="text-base font-bold text-gray-700">Managed Properties ({{ agent.properties?.length || 0 }})</p>
      </div>
      <div class="px-8 py-4 border-b border-gray-50">
         <p class="text-sm text-gray-400 font-medium">Full asset portfolio managed by this agent</p>
      </div>
      <div class="p-8 space-y-4">
        <div 
          v-for="prop in agent.properties" 
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

        <div v-if="!agent.properties || agent.properties.length === 0" class="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
           <p class="text-sm text-gray-400 font-medium">No properties currently assigned to this agent.</p>
        </div>
      </div>
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
</style>
