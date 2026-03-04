<script setup lang="ts">
import type { Tenant } from '../types';

defineProps<{
  tenants: Tenant[];
}>();
</script>

<template>
  <div class="mt-6 pt-6 border-t border-gray-100/60 transition-all animate-fade-in">
    <p class="text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Current Occupants</p>
    <div class="overflow-hidden rounded-lg border border-gray-100 bg-white">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50">
            <th class="px-4 py-2 text-sm font-bold text-gray-500 uppercase">First Name</th>
            <th class="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Last Name</th>
            <th class="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Family</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-gray-50/30 transition-colors">
            <td class="px-4 py-2 text-sm font-semibold text-gray-700">{{ tenant.firstName }}</td>
            <td class="px-4 py-2 text-sm font-semibold text-gray-700">{{ tenant.lastName }}</td>
            <td class="px-4 py-2 text-sm font-black text-blue-600 uppercase tracking-tighter">{{ tenant.familyName || '---' }}</td>
          </tr>
        </tbody>
      </table>
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
