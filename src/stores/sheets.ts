import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Sheet, Person, Expense, Balance } from '../types';
import { useLocalStorage } from '@vueuse/core';

export const useSheetStore = defineStore('sheets', () => {
  const sheets = useLocalStorage<Sheet[]>('trip-sheets', []);

  const addSheet = (name: string) => {
    const newSheet: Sheet = {
      id: crypto.randomUUID(),
      name,
      totalExpenses: 0,
      persons: [],
      expenses: []
    };
    sheets.value.push(newSheet);
  };

  const addPerson = (sheetId: string, name: string) => {
    const sheet = sheets.value.find(s => s.id === sheetId);
    if (sheet) {
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name,
        totalPaid: 0,
        totalOwed: 0
      };
      sheet.persons.push(newPerson);
    }
  };

  const addExpense = (sheetId: string, expense: Omit<Expense, 'id'>) => {
    const sheet = sheets.value.find(s => s.id === sheetId);
    if (sheet) {
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID()
      };
      sheet.expenses.push(newExpense);
      updateBalances(sheet);
    }
  };

  const calculateBalances = (sheet: Sheet): Balance[] => {
    const balances: Balance[] = [];
    sheet.expenses.forEach(expense => {
      const perPersonAmount = expense.amount / expense.sharedBy.length;
      expense.sharedBy.forEach(personId => {
        if (personId !== expense.payerId) {
          balances.push({
            from: personId,
            to: expense.payerId,
            amount: perPersonAmount
          });
        }
      });
    });
    return balances;
  };

  const updateBalances = (sheet: Sheet) => {
    sheet.persons.forEach(person => {
      person.totalPaid = 0;
      person.totalOwed = 0;
    });

    sheet.expenses.forEach(expense => {
      const payer = sheet.persons.find(p => p.id === expense.payerId);
      if (payer) {
        payer.totalPaid += expense.amount;
      }

      const perPersonAmount = expense.amount / expense.sharedBy.length;
      expense.sharedBy.forEach(personId => {
        const person = sheet.persons.find(p => p.id === personId);
        if (person) {
          person.totalOwed += perPersonAmount;
        }
      });
    });

    sheet.totalExpenses = sheet.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  return {
    sheets,
    addSheet,
    addPerson,
    addExpense,
    calculateBalances
  };
});