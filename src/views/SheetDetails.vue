<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSheetStore } from '../stores/sheets';
import { useRoute } from 'vue-router';
import type { Expense } from '../types';

const store = useSheetStore();
const route = useRoute();
const sheetId = route.params.id as string;

const showAddPersonModal = ref(false);
const showAddExpenseModal = ref(false);
const newPersonName = ref('');
const newExpense = ref({
  description: '',
  amount: 0,
  payerId: '',
  sharedBy: [] as string[],
  date: new Date().toISOString()
});

const sheet = computed(() => 
  store.sheets.find(s => s.id === sheetId)
);

const addPerson = () => {
  if (newPersonName.value.trim()) {
    store.addPerson(sheetId, newPersonName.value);
    newPersonName.value = '';
    showAddPersonModal.value = false;
  }
};

const addExpense = () => {
  if (newExpense.value.description && newExpense.value.amount > 0) {
    store.addExpense(sheetId, newExpense.value);
    newExpense.value = {
      description: '',
      amount: 0,
      payerId: '',
      sharedBy: [],
      date: new Date().toISOString()
    };
    showAddExpenseModal.value = false;
  }
};

const balances = computed(() => {
  if (sheet.value) {
    return store.calculateBalances(sheet.value);
  }
  return [];
});
</script>

<template>
  <div v-if="sheet" class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">{{ sheet.name }}</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Persons Section -->
      <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Participants</h2>
          <button
            @click="showAddPersonModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Person
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="person in sheet.persons"
            :key="person.id"
            class="bg-white p-4 rounded-lg shadow"
          >
            <h3 class="font-medium">{{ person.name }}</h3>
            <p class="text-sm text-gray-600">
              Paid: ${{ person.totalPaid.toFixed(2) }}
            </p>
            <p class="text-sm text-gray-600">
              Owed: ${{ person.totalOwed.toFixed(2) }}
            </p>
          </div>
        </div>
      </section>

      <!-- Expenses Section -->
      <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Expenses</h2>
          <button
            @click="showAddExpenseModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>
        <div class="space-y-4">
          <div
            v-for="expense in sheet.expenses"
            :key="expense.id"
            class="bg-white p-4 rounded-lg shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium">{{ expense.description }}</h3>
                <p class="text-sm text-gray-600">
                  Paid by: {{ sheet.persons.find(p => p.id === expense.payerId)?.name }}
                </p>
              </div>
              <p class="font-medium">${{ expense.amount.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Balances Section -->
      <section>
        <h2 class="text-xl font-semibold mb-4">To Be Paid</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <div v-for="balance in balances" :key="`${balance.from}-${balance.to}`">
            <p>
              {{ sheet.persons.find(p => p.id === balance.from)?.name }} owes
              {{ sheet.persons.find(p => p.id === balance.to)?.name }}
              ${{ balance.amount.toFixed(2) }}
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Add Person Modal -->
    <div v-if="showAddPersonModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Add New Person</h3>
        <input
          v-model="newPersonName"
          type="text"
          placeholder="Enter person's name"
          class="w-full px-3 py-2 border rounded-md mb-4"
        />
        <div class="flex justify-end space-x-3">
          <button
            @click="showAddPersonModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="addPerson"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showAddExpenseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Add New Expense</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <input
              v-model="newExpense.description"
              type="text"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Amount</label>
            <input
              v-model.number="newExpense.amount"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Paid By</label>
            <select
              v-model="newExpense.payerId"
              class="w-full px-3 py-2 border rounded-md"
            >
              <option v-for="person in sheet.persons" :key="person.id" :value="person.id">
                {{ person.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Shared By</label>
            <div class="space-y-2">
              <div v-for="person in sheet.persons" :key="person.id">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    :value="person.id"
                    v-model="newExpense.sharedBy"
                    class="rounded border-gray-300"
                  />
                  <span class="ml-2">{{ person.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddExpenseModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="addExpense"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  </div>
</template>