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
          <div>
            <template v-if="functionality.isEditing">
              <input
                v-model="functionality.name"
                placeholder="Editar nombre"
                class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
              <button @click="saveFunctionality(functionality.id)" class="text-green-600">Guardar</button>
              <button @click="cancelEdit(functionality.id)" class="text-red-600">Cancelar</button>
            </template>
            <template v-else>
              <h3 class="text-lg font-semibold text-gray-800">{{ functionality.name }}</h3>
              <button @click="editFunctionality(functionality.id)" class="text-blue-600">Editar</button>
            </template>
          </div>

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
          <div class="mt-2 flex flex-wrap space-x-4">
            <p
              v-for="category in categories"
              :key="category"
              class="text-sm"
              :class="{ 'text-blue-600': category === 'frontend', 'text-green-600': category === 'backend', 'text-gray-600': category !== 'frontend' && category !== 'backend' }"
            >
              {{ category }}: {{ calculateCategoryHours(category) }} horas
            </p>
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

                <div>
                  <template v-if="task.isEditing">
                    <div class="space-y-2">
                      <input
                        v-model="task.name"
                        placeholder="Nombre de la tarea"
                        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        required
                      />
                      <div class="flex space-x-2">
                        <div class="space-y-2">
                            <div
                              v-for="category in categories"
                              :key="category"
                              class="flex items-center space-x-4"
                            >
                              <label class="block text-sm font-medium text-gray-700">Horas {{ category }}</label>
                              <input
                                v-model.number="task.hours[category]"
                                type="number"
                                step="0.5"
                                min="0"
                                class="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                              />
                            </div>
                          </div>
                      </div>
                      <button
                        @click="task.isEditing = false"
                        class="text-blue-600 hover:underline"
                      >
                        ok
                      </button>
                      <button
                        @click="deleteTask(functionality.id, task.id)"
                        class="text-red-600 hover:underline"
                      >
                            <svg width="18" height="18" viewBox="0 0 24 24" 
                                fill="none" stroke="currentColor" stroke-width="2" 
                                stroke-linecap="round" stroke-linejoin="round" 
                                xmlns="http://www.w3.org/2000/svg">
                              <!-- Línea superior de la tapa -->
                              <line x1="9" y1="3" x2="15" y2="3" />
                              <!-- Asa o bisagra de la tapa -->
                              <line x1="10" y1="4" x2="14" y2="4" />
                              <!-- Tapa y línea horizontal superior -->
                              <polyline points="3 6 5 6 21 6" />
                              <!-- Cuerpo de la papelera -->
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <!-- Líneas internas (representan las varillas de la papelera) -->
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>

                      </button>
                    </div>
                  </template>

                  <template v-else>
                    <p class="font-medium">{{ task.name }}</p>
                    <div class="flex flex-wrap space-x-4 mt-1">
                      <span
                        v-for="(hours, category) in task.hours"
                        :key="category"
                        class="text-sm"
                        :class="{ 'text-blue-600': category === 'frontend', 'text-green-600': category === 'backend', 'text-gray-600': category !== 'frontend' && category !== 'backend' }"
                      >
                        {{ category }}: {{ hours }} horas
                      </span>
                    </div>

                    <div class="mt-2 flex space-x-2">
                      <button
                        @click="editTask(functionality.id, task.id)"
                        class="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        @click="deleteTask(functionality.id, task.id)"
                        class="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </template>

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
      <div class="mb-4 p-4 bg-gray-100 rounded">
        <h2 class="text-lg font-semibold text-gray-700">Categorías del Proyecto</h2>
        <ul class="mt-2 space-y-2">
          <li v-for="(category, index) in categories" :key="index" class="flex items-center">
            <span class="text-gray-700">{{ category }}</span>
            <button
              @click="removeCategory(index)"
              class="ml-2 text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        </ul>
        <form @submit.prevent="addCategory" class="mt-4 flex">
          <input
            v-model="newCategory"
            placeholder="Nueva categoría"
            class="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
          <button
            type="submit"
            class="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Agregar
          </button>
        </form>
      </div>

      <ReccuringEventsCard
        v-model="recurringEvents"
        @update:modelValue="recurringEvents = $event"
      />
      <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 text-gray-700">Configuración del Proyecto</h2>
        <div v-for="category in categories" :key="category" class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{ category }} FT</label>
          <input
            :value="resources[category] || 1"
            @input="(resources.value[category] = parseFloat($event.target.value) || 1)"
            type="number"
            step="0.1"
            min="0"
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
import { ref, computed, watch, reactive } from 'vue'
import dayjs from 'dayjs'
import ReccuringEventsCard from './components/ReccuringEventsCard.vue'
import GanttChart from './components/GanttChart.vue'

const WORKING_HOURS = 8
const functionalities = ref([])
const startDate = ref(new Date().toISOString().split('T')[0])
const nonWorkingDays = ref(0)
const recurringEvents = ref([])
const projectName = ref('')

const newFunctionality = ref({ name: '' })

const categories = ref(['Front-end', 'Back-end']);
const newCategory = ref('');
const resources = ref({});

const newTask = ref({
  name: '',
  hours: categories.value.reduce((acc, category) => {
    acc[category] = 0; // Inicializa las horas de cada categoría en 0
    return acc;
  }, {})
});


const addFunctionality = () => {
  const lastEndDate = functionalities.value.length > 0
    ? functionalities.value[functionalities.value.length - 1].tasks.slice(-1)[0]?.endDate
    : startDate.value;

  functionalities.value.push({
    id: Date.now(),
    name: newFunctionality.value.name,
    tasks: [],
    isExpanded: true,
    startDate: lastEndDate,
  });

  newFunctionality.value = { name: '' };
};


const addTask = (functionalityId) => {
  const functionality = functionalities.value.find(f => f.id === functionalityId);

  if (functionality) {
    const hours = reactive(categories.value.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {}));

    const startDate = calculateTaskStartDate(functionality, Object.keys(hours)[0]);


    const endDate = new Date(startDate.getTime() + calculateTaskHours(hours) * 60 * 60 * 1000);

    functionality.tasks.push({
      id: Date.now(),
      name: newTask.value.name,
      hours,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isEditing: true,
    });

    newTask.value = {
      name: '',
      hours: categories.value.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {}),
    };
  }
};

const calculateTaskStartDate = (functionality, category) => {
  const lastTask = functionality.tasks.filter(task => task.hours[category] > 0).slice(-1)[0];
  return lastTask ? new Date(lastTask.endDate) : new Date(functionality.startDate);
};


const calculateTaskHours = (hours) => {
  return Object.values(hours).reduce((sum, value) => sum + value, 0) / WORKING_HOURS;
};



const deleteTask = (functionalityId, taskId) => {
  const functionality = functionalities.value.find(f => f.id === functionalityId);
  if (functionality) {
    functionality.tasks = functionality.tasks.filter(task => task.id !== taskId);
  }
};



const editFunctionality = (id) => {
  functionalities.value = functionalities.value.map(f => 
    f.id === id ? { ...f, isEditing: true } : f
  );
};

const saveFunctionality = (id) => {
  functionalities.value = functionalities.value.map(f => 
    f.id === id ? { ...f, isEditing: false } : f
  );
};

const cancelEdit = (id) => {
  functionalities.value = functionalities.value.map(f => 
    f.id === id ? { ...f, isEditing: false } : f
  );
};

const editTask = (functionalityId, taskId) => {
  const functionality = functionalities.value.find(f => f.id === functionalityId);
  if (functionality) {
    const task = functionality.tasks.find(t => t.id === taskId);
    if (task) {
      task.isEditing = true;
    }
  }
};


const addCategory = () => {
  if (newCategory.value && !categories.value.includes(newCategory.value.toLowerCase())) {
    const category = newCategory.value.toLowerCase();
    categories.value.push(category);
    newTask.value.hours[category] = 0;
    if (!resources.value[category]) {
      resources.value[category] = 1;
    }

    newCategory.value = '';
  }
};



const removeCategory = (index) => {
  const categoryToRemove = categories.value[index];
  categories.value.splice(index, 1);
  delete resources.value[categoryToRemove];
};


const toggleFunctionality = (id) => {
  const functionality = functionalities.value.find(f => f.id === id)
  if (functionality) {
    functionality.isExpanded = !functionality.isExpanded
  }
}

const calculateFunctionalityHours = (functionality) => {
  return functionality.tasks.reduce((total, task) => {
    return total + Object.values(task.hours).reduce((sum, hours) => sum + hours, 0);
  }, 0);
};


const calculateCategoryHours = (category) => {
  return functionalities.value.reduce((total, functionality) => {
    return functionality.tasks.reduce((sum, task) => sum + (task.hours[category] || 0), total);
  }, 0);
};

const totalHours = computed(() => {
  return categories.value.reduce((total, category) => {
    return total + calculateCategoryHours(category);
  }, 0) + recurringEventHours.value * estimatedWeeks.value;
});


const estimatedWeeks = computed(() => {
  return (Math.max(...estimatedDaysByCategory.value) / 5).toFixed(1);
});

const estimatedMonths = computed(() => {
  return (parseFloat(estimatedWeeks.value) / 4).toFixed(1); // 4 semanas en un mes
});


const estimatedEndDate = computed(() => {
  let endDate = new Date(startDate.value);
  let daysToAdd = Math.max(...estimatedDaysByCategory.value) + Number(nonWorkingDays.value);

  // Agregar días hábiles al cálculo
  while (daysToAdd > 0) {
    endDate.setDate(endDate.getDate() + 1);
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) { // No es sábado ni domingo
      daysToAdd--;
    }
  }

  return endDate.toLocaleDateString(); // Formato de fecha legible
});


const recurringEventHours = computed(() => {
  return recurringEvents.value.reduce((total, event) => {
    const weeklyHours = event.frequency === 'diario' ? event.hours * 5 :
                        event.frequency === 'semanal' ? event.hours :
                        event.hours / 4 // mensual
    return total + weeklyHours
  }, 0)
})

const estimatedDaysByCategory = computed(() => {
  return categories.value.map(category => {
    const resource = resources.value[category] !== undefined ? resources.value[category] : 1; // Asume 1 FT si no se define recurso
    return resource > 0
      ? Math.ceil(calculateCategoryHours(category) / (WORKING_HOURS * resource))
      : Infinity;
  });
});



const formattedStartDate = computed(() => {
  return new Date(startDate.value).toLocaleDateString()
})



const exportCSV = () => {
  const header = "Funcionalidad,Tarea,Horas Categoría\n";
  let csvContent = "data:text/csv;charset=utf-8,";

  csvContent += header;

  functionalities.value.forEach((functionality) => {
    functionality.tasks.forEach((task) => {
      Object.entries(task.hours).forEach(([category, hours]) => {
        csvContent += `${functionality.name},${task.name},${category},${hours}\n`;
      });
    });
  });

  csvContent += `\n,,Total Horas\n`;
  categories.value.forEach((category) => {
    csvContent += `,,${category},${calculateCategoryHours(category)}\n`;
  });
  csvContent += `,,Total Eventos Recurrentes,${recurringEventHours.value}\n`;
  csvContent += `,,Total Horas,${totalHours.value}\n`;
  csvContent += `,,Estimado en Semanas,${estimatedWeeks.value}\n`;

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

watch([functionalities, categories, resources], recalculateEstimation, {
  deep: true,
});

watch(
  categories,
  (newCategories) => {
    newCategories.forEach((category) => {
      if (!resources.value[category]) {
        resources.value[category] = 1; // Valor predeterminado
      }
    });

    Object.keys(resources.value).forEach((key) => {
      if (!newCategories.includes(key)) {
        delete resources.value[key];
      }
    });
  },
  { immediate: true, deep: true }
);
</script>

