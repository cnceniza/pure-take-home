<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" @click="emit('cancel')"></div>

      <!-- Modal Content -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="scale-95 opacity-0 translate-y-4"
        enter-to-class="scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="scale-100 opacity-100 translate-y-0"
        leave-to-class="scale-95 opacity-0 translate-y-4"
      >
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span class="text-2xl">⚠️</span>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-900 leading-tight">
                  {{ title || 'Delete Confirmation' }}
                </h3>
                <p class="mt-2 text-slate-500 text-sm leading-relaxed">
                  {{ message || 'Are you sure you want to delete this agent? This action cannot be undone and all associated data will be permanently removed.' }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row-reverse gap-3 border-t border-slate-100">
            <button
              type="button"
              :disabled="loading"
              @click="emit('confirm')"
              class="inline-flex justify-center items-center px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              {{ confirmText || 'Delete Agent' }}
            </button>
            <button
              type="button"
              :disabled="loading"
              @click="emit('cancel')"
              class="inline-flex justify-center items-center px-6 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
