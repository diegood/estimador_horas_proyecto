<template>
  <div class="mt-8 p-4 bg-gray-100 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-2 text-gray-800">Resumen de la Estimación</h2>
    <p class="text-gray-700">Total de horas: {{ totalHours }}</p>
    <div class="mt-2">
      <p
        v-for="category in categories"
        :key="category"
        class="text-gray-700"
      >
        Horas {{ category }}: {{ calculateCategoryHours(category) }}
      </p>
      <p class="text-purple-600">Horas Eventos Recurrentes: {{ recurringEventHours }}</p>
    </div>
    <div class="mt-4">
      <h3 class="font-semibold text-gray-700">Estimaciones basadas en recursos asignados:</h3>
      <p class="text-gray-700">Días laborales (8 horas/día):</p>
      <p
        v-for="(days, index) in estimatedDaysByCategory"
        :key="categories[index]"
        class="text-gray-700"
      >
        {{ categories[index] }}: {{ days }} días
      </p>
      <p class="text-gray-700 mt-2">Semanas estimadas: {{ estimatedWeeks }}</p>
      <p class="text-gray-700">Meses estimados: {{ estimatedMonths }}</p>
      <p class="text-gray-700 font-semibold mt-2">Fecha de inicio: {{ formattedStartDate }}</p>
      <p class="text-gray-700 font-semibold">
        Fecha estimada de finalización: {{ estimatedEndDate }}
      </p>
    </div>
    <button
      @click="$emit('export-csv')"
      class="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mt-4"
    >
      Exportar a CSV
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  totalHours: {
    type: Number,
    required: true
  },
  recurringEventHours: {
    type: Number,
    required: true
  },
  estimatedDaysByCategory: {
    type: Array,
    required: true
  },
  estimatedWeeks: {
    type: Number,
    required: true
  },
  estimatedMonths: {
    type: Number,
    required: true
  },
  formattedStartDate: {
    type: String,
    required: true
  },
  estimatedEndDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['export-csv'])

const calculateCategoryHours = (category) => {
  return props.functionalities.reduce((total, functionality) => {
    return functionality.tasks.reduce((sum, task) => sum + (task.hours[category] || 0), total)
  }, 0)
}
</script>