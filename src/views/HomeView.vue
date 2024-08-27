<template>
  <div class="mx-auto p-4 w-full grid grid-cols-2 gap-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-800 col-span-2">
      Estimación de
      <input
        type="text"
        v-model="projectName"
        placeholder="Nombre del proyecto"
        class="p-2 border-0 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
        required
      />
    </h1>
    <section>
      <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 text-gray-700">Agregar Nueva Funcionalidad</h2>
        <form @submit.prevent="addFunctionality" class="space-y-2">
          <input
            v-model="newFunctionality.name"
            placeholder="Nombre de la funcionalidad"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            required
          />
          <button
            type="submit"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Agregar Funcionalidad
          </button>
        </form>
      </div>

      <div class="space-y-6">
        <div
          v-for="functionality in functionalities"
          :key="functionality.id"
          class="border p-4 rounded-lg shadow-md bg-white"
        >
          <div
            @click="toggleFunctionality(functionality.id)"
            class="flex justify-between items-center cursor-pointer"
          >
            <h3 class="text-lg font-semibold text-gray-800">{{ functionality.name }}</h3>
            <svg
              :class="{ 'transform rotate-180': functionality.isExpanded }"
              class="w-6 h-6 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <p class="text-sm text-gray-600">
            Horas totales: {{ calculateFunctionalityHours(functionality) }}
          </p>
          <div class="mt-2 flex space-x-4">
            <p class="text-sm text-blue-600">
              Frontend: {{ calculateFunctionalityFrontendHours(functionality) }} horas
            </p>
            <p class="text-sm text-green-600">
              Backend: {{ calculateFunctionalityBackendHours(functionality) }} horas
            </p>
            <p class="text-sm text-gray-500">Tareas: {{ functionality.tasks.length }}</p>
          </div>
          <div v-show="functionality.isExpanded" class="mt-4">
            <!-- Tareas -->
            <div class="mt-4">
              <h4 class="font-medium text-gray-700">Tareas:</h4>
              <ul class="mt-2 space-y-2">
                <li
                  v-for="task in functionality.tasks"
                  :key="task.id"
                  class="bg-gray-50 p-2 rounded"
                >
                  <p class="font-medium">{{ task.name }}</p>
                  <div class="flex justify-between mt-1">
                    <span class="text-sm text-blue-600"
                      >Frontend: {{ task.frontendHours }} horas</span
                    >
                    <span class="text-sm text-green-600"
                      >Backend: {{ task.backendHours }} horas</span
                    >
                  </div>
                </li>
              </ul>
            </div>

            <form @submit.prevent="addTask(functionality.id)" class="mt-4 space-y-2">
              <input
                v-model="newTask.name"
                placeholder="Nombre de la tarea"
                class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
              <div class="flex space-x-2">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700">Horas Frontend</label>
                  <input
                    v-model.number="newTask.frontendHours"
                    type="number"
                    min="0"
                    class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    required
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700">Horas Backend</label>
                  <input
                    v-model.number="newTask.backendHours"
                    type="number"
                    min="0"
                    class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                class="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                Agregar Tarea
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    <section>
      <ReccuringEventsCard
        v-model="recurringEvents"
        @update:modelValue="recurringEvents = $event"
      />
      <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 text-gray-700">Configuración del Proyecto</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Frontend FT</label>
            <input
              v-model.number="resources.frontend"
              type="number"
              step="0.1"
              min="0"
              @input="recalculateEstimation"
              class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Backend FT</label>
            <input
              v-model.number="resources.backend"
              type="number"
              step="0.1"
              min="0"
              @input="recalculateEstimation"
              class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha de inicio</label>
            <input
              v-model="startDate"
              type="date"
              @input="recalculateEstimation"
              class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Días no laborables</label>
            <input
              v-model.number="nonWorkingDays"
              type="number"
              min="0"
              @input="recalculateEstimation"
              class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              required
            />
          </div>
        </div>
      </div>

      <div class="mt-8 p-4 bg-gray-100 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 text-gray-800">Resumen de la Estimación</h2>
        <p class="text-gray-700">Total de horas: {{ totalHours }}</p>
        <div class="mt-2">
          <p class="text-blue-600">Horas Frontend: {{ frontendHours }}</p>
          <p class="text-green-600">Horas Backend: {{ backendHours }}</p>
          <p class="text-purple-600">Horas Eventos Recurrentes: {{ recurringEventHours }}</p>
        </div>
        <div class="mt-4">
          <h3 class="font-semibold text-gray-700">Estimaciones basadas en recursos asignados:</h3>
          <p class="text-gray-700">Días laborales (8 horas/día):</p>
          <p class="text-blue-600">Frontend: {{ estimatedFrontendDays }} días</p>
          <p class="text-green-600">Backend: {{ estimatedBackendDays }} días</p>
          <p class="text-gray-700 mt-2">Semanas estimadas: {{ estimatedWeeks }}</p>
          <p class="text-gray-700">Meses estimados: {{ estimatedMonths }}</p>
          <p class="text-gray-700 font-semibold mt-2">Fecha de inicio: {{ formattedStartDate }}</p>
          <p class="text-gray-700 font-semibold">
            Fecha estimada de finalización: {{ estimatedEndDate }}
          </p>
        </div>
        <button
          @click="exportCSV"
          class="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 mt-4"
        >
          Exportar a CSV
        </button>
      </div>
    </section>
    <section class="col-span-2 mt-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Gráfico Gantt del Proyecto</h2>
      <GanttChart :functionalities="functionalities" :startDate="startDate" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import ReccuringEventsCard from './components/ReccuringEventsCard.vue'
import GanttChart from './components/GanttChart.vue'

const WORKING_HOURS = 8
const functionalities = ref([])
const resources = ref({ frontend: 1, backend: 1 })
const startDate = ref(new Date().toISOString().split('T')[0])
const nonWorkingDays = ref(0)
const recurringEvents = ref([])
const projectName = ref('')

const newFunctionality = ref({ name: '' })
const newTask = ref({ name: '', frontendHours: 0, backendHours: 0 })


const addFunctionality = () => {
  functionalities.value.push({
    id: Date.now(),
    name: newFunctionality.value.name,
    tasks: [],
    isExpanded: true
  })
  newFunctionality.value = { name: '' }
}

const addTask = (functionalityId) => {
  const functionality = functionalities.value.find(f => f.id === functionalityId)
  if (functionality) {
    functionality.tasks.push({
      id: Date.now(),
      name: newTask.value.name,
      frontendHours: newTask.value.frontendHours,
      backendHours: newTask.value.backendHours
    })
    newTask.value = { name: '', frontendHours: 0, backendHours: 0 }
  }
  recalculateEstimation()
}

const toggleFunctionality = (id) => {
  const functionality = functionalities.value.find(f => f.id === id)
  if (functionality) {
    functionality.isExpanded = !functionality.isExpanded
  }
}

const calculateFunctionalityHours = (functionality) => {
  return functionality.tasks.reduce((total, task) => total + task.frontendHours + task.backendHours, 0)
}

const calculateFunctionalityFrontendHours = (functionality) => {
  return functionality.tasks.reduce((total, task) => total + task.frontendHours, 0)
}

const calculateFunctionalityBackendHours = (functionality) => {
  return functionality.tasks.reduce((total, task) => total + task.backendHours, 0)
}

const frontendHours = computed(() => {
  return functionalities.value.reduce((total, functionality) => total + calculateFunctionalityFrontendHours(functionality), 0)
})

const backendHours = computed(() => {
  return functionalities.value.reduce((total, functionality) => total + calculateFunctionalityBackendHours(functionality), 0)
})

const recurringEventHours = computed(() => {
  return recurringEvents.value.reduce((total, event) => {
    const weeklyHours = event.frequency === 'diario' ? event.hours * 5 :
                        event.frequency === 'semanal' ? event.hours :
                        event.hours / 4 // mensual
    return total + weeklyHours
  }, 0)
})

const totalHours = computed(() => {
  return frontendHours.value + backendHours.value + recurringEventHours.value * estimatedWeeks.value
})

const estimatedFrontendDays = computed(() => {
  return resources.value.frontend > 0 
    ? Math.ceil(frontendHours.value / (WORKING_HOURS  * resources.value.frontend)) 
    : Infinity
})

const estimatedBackendDays = computed(() => {
  return resources.value.backend > 0 
    ? Math.ceil(backendHours.value / (WORKING_HOURS  * resources.value.backend)) 
    : Infinity
})

const estimatedWorkDays = computed(() => {
  return Math.max(estimatedFrontendDays.value, estimatedBackendDays.value)
})

const estimatedWeeks = computed(() => {
  return (estimatedWorkDays.value / 5).toFixed(1)
})

const estimatedMonths = computed(() => {
  return (estimatedWeeks.value / 4).toFixed(1)
})

const formattedStartDate = computed(() => {
  return new Date(startDate.value).toLocaleDateString()
})

const estimatedEndDate = computed(() => {
  let endDate = new Date(startDate.value);
  let daysToAdd = estimatedWorkDays.value + Number(nonWorkingDays.value);

  // Agrega los días de trabajo calculados
  while (daysToAdd > 0) {
    endDate.setDate(endDate.getDate() + 1);
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) { // No es sábado ni domingo
      daysToAdd--;
    }
  }

  let additionalDaysFromRecurringEvents = Math.ceil((recurringEventHours.value * estimatedWeeks.value) / WORKING_HOURS);
  
  while (additionalDaysFromRecurringEvents > 0) {
    endDate.setDate(endDate.getDate() + 1);
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) { // No es sábado ni domingo
      additionalDaysFromRecurringEvents--;
    }
  }

  return endDate.toLocaleDateString();
});


const exportCSV = () => {
  const header = "Funcionalidad,Tarea,Horas Frontend,Horas Backend\n";
  let csvContent = "data:text/csv;charset=utf-8,";

  csvContent += header;

  functionalities.value.forEach(functionality => {
    functionality.tasks.forEach(task => {
      csvContent += `${functionality.name},${task.name},${task.frontendHours},${task.backendHours}\n`;
    });
  });

  csvContent += `\n,,Total Horas Frontend,${frontendHours.value}\n`;
  csvContent += `,,Total Horas Backend,${backendHours.value}\n`;
  csvContent += `,,Total Horas Eventos Recurrentes,${recurringEventHours.value}\n`;
  csvContent += `,,Total Horas,${totalHours.value}\n`;
  csvContent += `,,Estimado en Semanas,${estimatedWeeks.value}\n`;
  csvContent += `,,Estimado en Meses,${estimatedMonths.value}\n`;
  csvContent += `,,Fecha Estimada de Finalización,${estimatedEndDate.value}\n`;

  downloadCSV(csvContent);
};

const downloadCSV = (csvContent) => {
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `estimacion ${projectName.value}.csv`);
  link.click();
};


const recalculateEstimation = () => {
}

watch([resources, startDate, nonWorkingDays, recurringEvents], recalculateEstimation)
</script>

