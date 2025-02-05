<template>
  <div class="mb-6 p-4 bg-gray-100 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-2 text-gray-700">Configuración del Proyecto</h2>
    <div class="grid grid-cols-4 gap-4">
      <div v-for="category in categories" :key="category" class="mb-4">
        <label class="block text-sm font-medium text-gray-700">{{ category }} FT</label>
        <input
          :value="resources[category] || 1"
          @input="updateResource(category, $event)"
          type="number"
          step="0.1"
          min="0"
          class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          required
        />
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Fecha de inicio</label>
        <input
          :value="startDate"
          @input="$emit('update:start-date', $event.target.value)"
          type="date"
          class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Días no laborables</label>
        <input
          :value="nonWorkingDays"
          @input="$emit('update:non-working-days', parseInt($event.target.value))"
          type="number"
          min="0"
          class="mt-1 block w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          required
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  resources: {
    type: Object,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  nonWorkingDays: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:resources', 'update:start-date', 'update:non-working-days'])

const updateResource = (category, event) => {
  const value = parseFloat(event.target.value) || 1
  const updatedResources = { ...props.resources, [category]: value }
  emit('update:resources', updatedResources)
}
</script>