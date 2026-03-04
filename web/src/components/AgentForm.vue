<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../api';
import type { PropertyAgent } from '../types';

const props = defineProps<{
  agentId?: string;
  showTitle?: boolean;
}>();

const emit = defineEmits<{
  (e: 'success', agent: PropertyAgent): void;
  (e: 'cancel'): void;
  (e: 'delete', id: string): void;
}>();

const form = ref<Omit<PropertyAgent, 'id' | 'createdAt' | 'updatedAt'>>({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
});

const timestamps = ref({
  createdAt: '',
  updatedAt: '',
});

const loading = ref(false);
const error = ref<string | null>(null);
const isEdit = ref(false);

const fetchAgent = async (id: string) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get<PropertyAgent>(`/agents/${id}`);
    const agent = response.data;
    form.value = {
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      mobileNumber: agent.mobileNumber,
    };
    timestamps.value = {
      createdAt: agent.createdAt ? new Date(agent.createdAt).toLocaleString() : '',
      updatedAt: agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : '',
    };
    isEdit.value = true;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch agent details';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.agentId) {
    fetchAgent(props.agentId);
  }
});

watch(() => props.agentId, (newId) => {
  if (newId) {
    fetchAgent(newId);
  } else {
    isEdit.value = false;
    form.value = { firstName: '', lastName: '', email: '', mobileNumber: '' };
    timestamps.value = { createdAt: '', updatedAt: '' };
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  try {
    let response;
    if (isEdit.value && props.agentId) {
      response = await api.put<PropertyAgent>(`/agents/${props.agentId}`, form.value);
    } else {
      response = await api.post<PropertyAgent>('/agents', form.value);
    }
    emit('success', response.data);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Something went wrong. Please check your input.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="h-full flex flex-col bg-white overflow-hidden">
    <div v-if="showTitle" class="p-8 border-b border-slate-100">
      <h2 class="text-3xl font-black text-slate-900 tracking-tight">{{ isEdit ? 'Agent Profile' : 'New Agent Registration' }}</h2>
      <p class="text-slate-500 mt-2 text-lg">Manage the personal information and credentials for this agent.</p>
    </div>

    <div class="flex-1 overflow-y-auto p-8">
      <form @submit.prevent="handleSubmit" class="max-w-3xl space-y-10">
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <span class="text-xl">⚠️</span>
          <p class="text-sm font-bold">{{ error }}</p>
        </div>

        <!-- Personal Information Section -->
        <section class="space-y-6">
          <div class="flex items-center gap-4 mb-2">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">01</span>
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Personal Identification</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pl-12">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-tighter ml-1">First Name</label>
              <input v-model="form.firstName" type="text" required class="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-hidden transition-all text-slate-900 font-medium shadow-inner" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-tighter ml-1">Last Name</label>
              <input v-model="form.lastName" type="text" required class="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-hidden transition-all text-slate-900 font-medium shadow-inner" />
            </div>
          </div>
        </section>

        <!-- Contact Records Section -->
        <section class="space-y-6">
          <div class="flex items-center gap-4 mb-2">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">02</span>
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
          </div>
          
          <div class="grid grid-cols-1 gap-8 pl-12">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-tighter ml-1">Electronic Mail</label>
              <input v-model="form.email" type="email" required class="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-hidden transition-all text-slate-900 font-medium shadow-inner" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-tighter ml-1">Mobile Telephone</label>
              <input v-model="form.mobileNumber" type="tel" required class="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-hidden transition-all text-slate-900 font-medium shadow-inner" />
            </div>
          </div>
        </section>

        <!-- Timestamps (Only for Edit) -->
        <section v-if="isEdit" class="pt-10 border-t border-slate-100">
           <div class="grid grid-cols-2 gap-4 pl-12">
             <div class="flex flex-col gap-1">
               <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered On</span>
               <span class="text-sm text-slate-600">{{ timestamps.createdAt }}</span>
             </div>
             <div class="flex flex-col gap-1">
               <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Activity</span>
               <span class="text-sm text-slate-600">{{ timestamps.updatedAt }}</span>
             </div>
           </div>
        </section>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between gap-4 pt-10 border-t border-slate-100 pl-12">
          <div>
            <button v-if="isEdit" type="button" @click="emit('delete', props.agentId!)" class="text-sm font-bold text-red-500 hover:text-red-700 transition-colors py-2">
              Delete Account
            </button>
          </div>
          <div class="flex gap-4">
            <button type="button" @click="emit('cancel')" class="px-8 py-4 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3">
              <span v-if="loading" class="w-4 h-4 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
              {{ isEdit ? 'Save Changes' : 'Complete Setup' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
