<script setup lang="ts">
import { ref } from 'vue';
import type { PropertyAgent } from '../types';
import api from '../api';

const props = defineProps<{
  agent: PropertyAgent;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const loading = ref(false);

const noteForm = ref({
  propertyId: null as string | null,
  type: 'Maintenance' as string,
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
});

const resetNoteForm = () => {
  noteForm.value = {
    propertyId: null,
    type: 'Maintenance',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
  };
};

const saveNote = async () => {
  if (!noteForm.value.description || !noteForm.value.dueDate) {
    alert('Please fill in both description and due date.');
    return;
  }

  loading.value = true;
  try {
    await api.post(`/agents/${props.agent.id}/notes`, noteForm.value);
    emit('success');
    resetNoteForm();
  } catch (error) {
    console.error('Failed to save note:', error);
    alert('Failed to save the reminder.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="space-y-4">
      <!-- Property Selector -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-500 uppercase">Related Property</label>
        <div class="relative">
          <select 
            v-model="noteForm.propertyId"
            class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
          >
            <option :value="null">Across Portfolio (General)</option>
            <option v-for="prop in agent.properties" :key="prop.id" :value="prop.id">
              {{ prop.address }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Note Type Radio Buttons -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-500 uppercase">Type</label>
        <div class="flex flex-wrap gap-3 mt-1">
          <label v-for="type in ['Maintenance', 'Inspection', 'Pest Control', 'Other']" :key="type" class="flex items-center">
            <input 
              type="radio" 
              :value="type" 
              v-model="noteForm.type"
              class="hidden"
            />
            <span 
              :class="[
                'px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                noteForm.type === type 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600'
              ]"
            >
              {{ type }}
            </span>
          </label>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-500 uppercase">Description</label>
        <textarea 
          v-model="noteForm.description" 
          rows="3"
          class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
          placeholder="What needs to be done?"
        ></textarea>
      </div>

      <!-- Due Date -->
      <div class="space-y-1.5">
        <label class="text-xs font-bold text-gray-500 uppercase">Due Date</label>
        <input 
          v-model="noteForm.dueDate" 
          type="date" 
          class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Form Action Buttons -->
    <div class="flex justify-end items-center gap-3 pt-4 border-t border-gray-50">
      <button 
        @click="emit('cancel')"
        :disabled="loading"
        class="px-5 py-2 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 rounded-lg transition-all"
      >
        Cancel
      </button>
      <button 
        @click="saveNote"
        :disabled="loading"
        class="px-10 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        Create Reminder
      </button>
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

select:focus, input:focus, textarea:focus {
  background-color: white;
}
</style>
