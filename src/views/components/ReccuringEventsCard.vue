<template>
  <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-2 text-gray-700">Eventos Recurrentes</h2>
    <div class="space-y-2">
      <div
        v-for="event in recurringEvents"
        :key="event.id"
        class="flex items-center justify-between bg-white p-2 rounded"
      >
        <span>{{ event.name }} ({{ event.hours }} horas - {{ event.frequency }})</span>
        <button @click="removeRecurringEvent(event.id)" class="text-red-500 hover:text-red-700">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <form @submit.prevent="addRecurringEvent" class="mt-4 space-y-2">
      <div class="grid grid-cols-7 gap-4">
        <input
          v-model="newRecurringEvent.name"
          placeholder="Nombre del evento"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 col-span-3"
          required
        />
        <input
          v-model.number="newRecurringEvent.hours"
          type="number"
          min="0"
          step="0.5"
          placeholder="Horas"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          required
        />
        <select
          v-model="newRecurringEvent.frequency"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 col-span-2"
          required
        >
          <option value="diario">Diario</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
        </select>
        <button
          type="submit"
          class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recurringEvents = defineModel({
  type: Array,
  default: () => []
})

const newRecurringEvent = ref({
  name: '',
  hours: 0,
  frequency: 'diario'
})

const addRecurringEvent = () => {
  recurringEvents.value.push({ ...newRecurringEvent.value, id: Date.now() })
  newRecurringEvent.value = { name: '', hours: 0, frequency: 'diario' }
}

const removeRecurringEvent = (id) => {
  recurringEvents.value = recurringEvents.value.filter((event) => event.id !== id)
}
</script>
