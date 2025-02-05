<template>
  <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-2 text-gray-700">Agregar Nueva Funcionalidad</h2>
    <form @submit.prevent="addFunctionality" class="space-y-2">
      <input
        v-model="newFunctionalityName"
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
        <TaskList
          :functionality="functionality"
          :categories="categories"
          @add-task="addTask"
          @delete-task="deleteTask"
          @edit-task="editTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskList from './TaskList.vue'

const props = defineProps({
  functionalities: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-functionality', 'toggle-functionality', 'edit-functionality', 'save-functionality', 'cancel-edit', 'add-task', 'delete-task', 'edit-task'])

const newFunctionalityName = ref('')

const addFunctionality = () => {
  emit('add-functionality', newFunctionalityName.value)
  newFunctionalityName.value = ''
}

const toggleFunctionality = (id) => {
  emit('toggle-functionality', id)
}

const editFunctionality = (id) => {
  emit('edit-functionality', id)
}

const saveFunctionality = (id) => {
  emit('save-functionality', id)
}

const cancelEdit = (id) => {
  emit('cancel-edit', id)
}

const calculateFunctionalityHours = (functionality) => {
  return functionality.tasks.reduce((total, task) => {
    return total + Object.values(task.hours).reduce((sum, hours) => sum + hours, 0)
  }, 0)
}

const calculateCategoryHours = (category) => {
  return props.functionalities.reduce((total, functionality) => {
    return functionality.tasks.reduce((sum, task) => sum + (task.hours[category] || 0), total)
  }, 0)
}

const addTask = (functionalityId, task) => {
  emit('add-task', { functionalityId, task })
}

const deleteTask = (functionalityId, taskId) => {
  emit('delete-task', { functionalityId, taskId })
}

const editTask = (functionalityId, taskId) => {
  emit('edit-task', { functionalityId, taskId })
}
</script>