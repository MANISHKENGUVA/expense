<script setup lang="ts">
import { ref } from 'vue';
import { useSheetStore } from '../stores/sheets';
import { useRouter } from 'vue-router';

const store = useSheetStore();
const router = useRouter();
const showNewSheetModal = ref(false);
const newSheetName = ref('');

const createSheet = () => {
  if (newSheetName.value.trim()) {
    store.addSheet(newSheetName.value);
    newSheetName.value = '';
    showNewSheetModal.value = false;
  }
};

const viewSheet = (id: string) => {
  router.push(`/sheet/${id}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">Shared Trip Expenses</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Sheet List -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Your Trips</h2>
          <button
            @click="showNewSheetModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create New Sheet
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="sheet in store.sheets"
            :key="sheet.id"
            class="bg-white shadow rounded-lg p-4"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ sheet.name }}</h3>
                <p class="text-sm text-gray-500">
                  Total: ${{ sheet.totalExpenses.toFixed(2) }}
                </p>
              </div>
              <button
                @click="viewSheet(sheet.id)"
                class="text-blue-600 hover:text-blue-800"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Sheet Modal -->
    <div v-if="showNewSheetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Create New Trip Sheet</h3>
        <input
          v-model="newSheetName"
          type="text"
          placeholder="Enter trip name"
          class="w-full px-3 py-2 border rounded-md mb-4"
        />
        <div class="flex justify-end space-x-3">
          <button
            @click="showNewSheetModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="createSheet"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>