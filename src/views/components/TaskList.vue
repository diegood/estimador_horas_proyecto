<template>
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
                      @change="$emit('update-task', task)"
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
                @click="$emit('delete-task', functionality.id, task.id)"
                class="text-red-600 hover:underline"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" stroke-width="2" 
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="9" y1="3" x2="15" y2="3" />
                  <line x1="10" y1="4" x2="14" y2="4" />
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
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
                @click="$emit('edit-task', functionality.id, task.id)"
                class="text-blue-600 hover:underline"
              >
                Editar
              </button>
              <button
                @click="$emit('delete-task', functionality.id, task.id)"
                class="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </template>
        </div>
      </li>
    </ul>

    <form @submit.prevent="addTask" class="mt-4 space-y-2">
      <input
        v-model="newTaskName"
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
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  functionality: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-task', 'delete-task', 'edit-task', 'update-task'])

const newTaskName = ref('')

const addTask = () => {
  const newTask = {
    name: newTaskName.value,
    hours: props.categories.reduce((acc, category) => {
      acc[category] = 0
      return acc
    }, {}),
    isEditing: true
  }
  emit('add-task', props.functionality.id, newTask)
  newTaskName.value = ''
}
</script>