<template>
  <div class="w-full">
    <div class="flex items-center border-b border-gray-200 mb-4">
      <div class="flex-grow flex space-x-2 overflow-x-auto">
        <button
          v-for="(project, index) in projects"
          :key="index"
          @click="activeTab = index"
          class="px-4 py-2 whitespace-nowrap"
          :class="{
            'border-b-2 border-blue-500 text-blue-600': activeTab === index,
            'text-gray-600 hover:text-gray-800': activeTab !== index
          }"
        >
          {{ project.name || 'Sin nombre' }}
          <span
            @click.stop="removeProject(index)"
            class="ml-2 text-gray-400 hover:text-red-500"
          >
            ×
          </span>
        </button>
      </div>
      <button
        @click="addNewProject"
        class="ml-2 px-3 py-1 text-blue-500 hover:text-blue-600 text-xl font-bold"
      >
        +
      </button>
    </div>
    
    <div v-if="projects.length > 0">
      <HomeView
        v-for="(project, index) in projects"
        :key="index"
        v-show="activeTab === index"
        :project-data="project"
        @update:project-data="updateProjectData(index, $event)"
      />
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      Haga clic en el botón + para agregar un nuevo proyecto
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import HomeView from '../views/HomeView.vue'
import { saveProjects, loadProjects } from '../services/indexedDB'

const projects = ref([])
const activeTab = ref(0)

onMounted(async () => {
  const savedProjects = await loadProjects()
  projects.value = savedProjects
})

const addNewProject = () => {
  projects.value.push({
    name: '',
    functionalities: [],
    startDate: new Date().toISOString().split('T')[0],
    categories: ['Front-end', 'Back-end'],
    recurringEvents: []
  })
  activeTab.value = projects.value.length - 1
}

const removeProject = (index) => {
  if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
    projects.value.splice(index, 1)
    if (activeTab.value >= projects.value.length) {
      activeTab.value = Math.max(0, projects.value.length - 1)
    }
    saveProjects(projects.value)
  }
}

const updateProjectData = (index, newData) => {
  projects.value[index] = { ...newData }
  saveProjects(projects.value)
}
</script>