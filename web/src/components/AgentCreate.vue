<script setup lang="ts">
import { ref } from 'vue';
import type { PropertyAgent } from '../types';
import api from '../api';

const emit = defineEmits<{
  (e: 'create-success', agent: PropertyAgent): void;
  (e: 'cancel'): void;
}>();

// --- STATE ---
const loading = ref(false);
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  agentNotes: '',
});

// --- ACTIONS ---
const handleSave = async () => {
  // Basic validation
  if (!editForm.value.firstName || !editForm.value.lastName || !editForm.value.email || !editForm.value.mobileNumber) {
    alert('Please fill in all required fields (First Name, Last Name, Email, Phone).');
    return;
  }

  loading.value = true;
  
  try {
    const payload = {
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName,
      email: editForm.value.email,
      mobileNumber: editForm.value.mobileNumber,
      agentNotes: editForm.value.agentNotes,
    };
    
    const response = await api.post('/agents', payload);
    emit('create-success', response.data);
  } catch (error: any) {
    console.error('Creation failed:', error);
    const message = error.response?.data?.message || 'Failed to create new agent.';
    alert(message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10 animate-fade-in">
    <!-- Header Hero (Static for Create) -->
    <div class="flex justify-between items-start">
      <div class="space-y-1">
        <h2 class="text-4xl font-bold text-gray-900 tracking-tight">New Agent</h2>
        <p class="text-gray-500 font-medium text-lg">Enter the details to register a new property agent</p>
      </div>
    </div>

    <!-- Create Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      <div class="px-8 py-4 border-b border-gray-100 bg-gray-50/30">
        <p class="text-sm font-bold text-gray-700">Create New Agent</p>
      </div>
      <div class="p-8 space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase">First Name</label>
            <input 
              v-model="editForm.firstName" 
              type="text" 
              class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="First Name"
              required
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase">Last Name</label>
            <input 
              v-model="editForm.lastName" 
              type="text" 
              class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
          <input 
            v-model="editForm.email" 
            type="email" 
            class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="email@example.com"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase">Phone</label>
          <input 
            v-model="editForm.mobileNumber" 
            type="tel" 
            class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase">Notes</label>
          <textarea 
            v-model="editForm.agentNotes" 
            rows="4"
            class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Enter agent notes here..."
          ></textarea>
        </div>

        <!-- Bottom Buttons -->
        <div class="flex justify-end items-center gap-3 pt-4">
          <button 
            @click="emit('cancel')"
            :disabled="loading"
            class="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            @click="handleSave"
            :disabled="loading"
            class="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Create Agent
          </button>
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

input:focus, textarea:focus {
  background-color: white;
}
</style>
