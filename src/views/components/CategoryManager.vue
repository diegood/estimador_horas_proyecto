<template>
  <div class="mb-4 p-4 bg-gray-100 rounded">
    <h2 class="text-lg font-semibold text-gray-700">Categorías del Proyecto</h2>
    <div class="grid gap-2 grid-cols-4">
      <div v-for="(category, index) in categories" :key="index" class="flex items-center">
        <span class="text-gray-700">{{ category }}</span>
        <button
          @click="$emit('remove-category', index)"
          class="ml-2 text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
    <form @submit.prevent="addCategory" class="mt-4 flex">
      <input
        v-model="newCategoryName"
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
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-category', 'remove-category'])

const newCategoryName = ref('')

const addCategory = () => {
  if (newCategoryName.value && !props.categories.includes(newCategoryName.value.toLowerCase())) {
    emit('add-category', newCategoryName.value.toLowerCase())
    newCategoryName.value = ''
  }
}
</script>