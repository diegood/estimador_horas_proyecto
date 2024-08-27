<template>
  <div>
    <canvas id="ganttChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import 'chartjs-adapter-date-fns'  // Importa el adaptador de fechas

const props = defineProps({
  functionalities: Array,
  startDate: String
})

let ganttChartInstance = null; // Mantiene una referencia al gráfico

const renderGanttChart = () => {
  const ctx = document.getElementById('ganttChart').getContext('2d')

  // Destruir el gráfico anterior si existe para evitar reutilizar el canvas
  if (ganttChartInstance) {
    ganttChartInstance.destroy();
  }

  const datasets = props.functionalities.map((functionality, index) => {
    const color = `hsl(${index * 60}, 70%, 50%)`; // Generar un color diferente para cada funcionalidad
    const tasks = functionality.tasks.map(task => {
      const start = new Date(props.startDate);
      const end = new Date(start.getTime() + (task.frontendHours + task.backendHours) * 60 * 60 * 1000);

      return {
        x: [start, end],
        y: functionality.name,
      };
    });

    return {
      label: functionality.name,
      data: tasks,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
      fill: false,
    };
  });

  ganttChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: datasets,
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          type: 'time',  // Usa la escala de tiempo
          time: {
            unit: 'day',  // Configura la unidad de tiempo para los días
          },
          title: {
            display: true,
            text: 'Fecha',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Funcionalidades',
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          display: false,
        },
      },
    },
    plugins: [ChartDataLabels],
  });
};

onMounted(() => {
  if (props.functionalities.length > 0) {
    renderGanttChart();
  }
});

// Watch para actualizar el gráfico cuando las props cambian
watch(
  () => props.functionalities, 
  () => {
    renderGanttChart();
  }, 
  { deep: true }
);

watch(
  () => props.startDate, 
  () => {
    renderGanttChart();
  }
);

// Destruir el gráfico al desmontar el componente para liberar recursos
onBeforeUnmount(() => {
  if (ganttChartInstance) {
    ganttChartInstance.destroy();
  }
});
</script>
