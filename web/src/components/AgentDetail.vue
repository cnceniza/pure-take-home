<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PropertyAgent, NoteReminder } from '../types';
import api from '../api';

const props = defineProps<{
  agent: PropertyAgent;
  selectedPropertyId?: string | null;
}>();

const emit = defineEmits<{
  (e: 'update-success', agent: PropertyAgent): void;
}>();

// --- STATE ---
const isEditing = ref(false);
const loading = ref(false);
const notes = ref<NoteReminder[]>([]);
const notesLoading = ref(false);
const isAddingNote = ref(false);

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

const editForm = ref({
  fullName: `${props.agent.firstName} ${props.agent.lastName}`,
  email: props.agent.email,
  mobileNumber: props.agent.mobileNumber,
  agentNotes: props.agent.agentNotes || '',
});

// --- ACTIONS ---
const fetchNotes = async () => {
  if (!props.agent.id) return;
  notesLoading.value = true;
  try {
    const response = await api.get(`/agents/${props.agent.id}/notes`);
    notes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
  } finally {
    notesLoading.value = false;
  }
};

const saveNote = async () => {
  if (!noteForm.value.description || !noteForm.value.dueDate) {
    alert('Please fill in both description and due date.');
    return;
  }

  loading.value = true;
  try {
    await api.post(`/agents/${props.agent.id}/notes`, noteForm.value);
    await fetchNotes();
    isAddingNote.value = false;
    resetNoteForm();
  } catch (error) {
    console.error('Failed to save note:', error);
    alert('Failed to save the reminder.');
  } finally {
    loading.value = false;
  }
};

const getPropertyName = (propertyId: string | null) => {
  if (!propertyId) return 'Across Portfolio';
  const prop = props.agent.properties?.find(p => p.id === propertyId);
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

// Sync form if prop changes
watch(() => props.agent, (newAgent) => {
  editForm.value = {
    fullName: `${newAgent.firstName} ${newAgent.lastName}`,
    email: newAgent.email,
    mobileNumber: newAgent.mobileNumber,
    agentNotes: newAgent.agentNotes || '',
  };
  isEditing.value = false;
  isAddingNote.value = false;
  resetNoteForm();
  fetchNotes();
}, { deep: true, immediate: true });

// --- ACTIONS ---
const handleSave = async () => {
  loading.value = true;
  
  // Split fullName back into first and last
  const nameParts = editForm.value.fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    const payload = {
      firstName,
      lastName,
      email: editForm.value.email,
      mobileNumber: editForm.value.mobileNumber,
      agentNotes: editForm.value.agentNotes,
    };
    
    const response = await api.put(`/agents/${props.agent.id}`, payload);
    emit('update-success', response.data);
    isEditing.value = false;
  } catch (error) {
    console.error('Update failed:', error);
    alert('Failed to update agent information.');
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editForm.value = {
    fullName: `${props.agent.firstName} ${props.agent.lastName}`,
    email: props.agent.email,
    mobileNumber: props.agent.mobileNumber,
    agentNotes: props.agent.agentNotes || '',
  };
  isEditing.value = false;
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
      
      <button 
        v-if="!isEditing"
        @click="isEditing = true"
        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>

    <!-- Agent Information / Edit Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      <template v-if="!isEditing">
        <div class="px-8 py-4 border-b border-gray-100 bg-gray-50/30">
          <p class="text-sm font-bold text-gray-700">Agent Information</p>
        </div>
        <div class="p-8 space-y-8">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</p>
              <p class="text-base font-bold text-gray-800">{{ agent.email }}</p>
            </div>
            <div>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</p>
              <p class="text-base font-bold text-gray-800">{{ agent.mobileNumber }}</p>
            </div>
          </div>
          <div>
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Notes</p>
            <p class="text-base text-gray-700 leading-relaxed">{{ agent.agentNotes || 'No notes available for this agent.' }}</p>
          </div>
        </div>
      </template>

      <!-- EDIT MODE CARD -->
      <template v-else>
        <div class="px-8 py-4 border-b border-gray-100 bg-gray-50/30">
          <p class="text-sm font-bold text-gray-700">Edit Agent Details</p>
        </div>
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase">Name</label>
              <input 
                v-model="editForm.fullName" 
                type="text" 
                class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Full Name"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
              <input 
                v-model="editForm.email" 
                type="email" 
                class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase">Phone</label>
            <input 
              v-model="editForm.mobileNumber" 
              type="tel" 
              class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="+1 (555) 000-0000"
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
              @click="cancelEdit"
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
              Save Changes
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Notes & Reminders Card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in shadow-blue-500/5">
      <div class="px-8 py-5 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-base font-bold text-gray-800 tracking-tight">Notes & Reminders</p>
        </div>
        <button 
          v-if="!isAddingNote"
          @click="isAddingNote = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-blue-100/50 group"
        >
          <svg class="w-3 h-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>

      <div class="p-8 space-y-5">
        <!-- Create Note Form -->
        <div v-if="isAddingNote" class="space-y-6 animate-fade-in">
          <div class="space-y-4">
            <!-- Property Selector -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase">Related Property</label>
              <select 
                v-model="noteForm.propertyId"
                class="w-full text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option :value="null">Across Portfolio (General)</option>
                <option v-for="prop in agent.properties" :key="prop.id" :value="prop.id">
                  {{ prop.address }}
                </option>
              </select>
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
              @click="isAddingNote = false"
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

        <!-- Dynamic Notes List -->
        <div v-else-if="notes.length > 0" class="space-y-4">
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
                  {{ getPropertyName(note.propertyId) }}
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

        <div v-else-if="!notesLoading" class="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
           <p class="text-sm text-gray-400 font-medium">No reminders set for this agent.</p>
        </div>

        <div v-if="notesLoading" class="flex justify-center py-8">
          <div class="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
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
            'p-6 border rounded-xl transition-all group',
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
            <span class="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase">Verified Listing</span>
          </div>

          <!-- Tenant Table -->
          <div v-if="prop.tenants && prop.tenants.length > 0" class="mt-6 pt-6 border-t border-gray-100/60">
            <p class="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Current Occupants</p>
            <div class="overflow-hidden rounded-lg border border-gray-100 bg-white">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/50">
                    <th class="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">First Name</th>
                    <th class="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Last Name</th>
                    <th class="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Family</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="tenant in prop.tenants" :key="tenant.id" class="hover:bg-gray-50/30 transition-colors">
                    <td class="px-4 py-2 text-xs font-semibold text-gray-700">{{ tenant.firstName }}</td>
                    <td class="px-4 py-2 text-xs font-semibold text-gray-700">{{ tenant.lastName }}</td>
                    <td class="px-4 py-2 text-xs font-black text-blue-600 uppercase tracking-tighter">{{ tenant.familyName || '---' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

input:focus, textarea:focus {
  background-color: white;
}
</style>
