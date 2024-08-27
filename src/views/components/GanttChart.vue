<template>
  <div>
    <canvas id="ganttChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const props = defineProps({
  functionalities: Array,
  startDate: String
})

const ganttChart = ref(null)

onMounted(() => {
  if (ganttChart.value) {
    const ctx = document.getElementById('ganttChart').getContext('2d')

    const datasets = props.functionalities.map((functionality, index) => {
      const color = `hsl(${index * 60}, 70%, 50%)`
      const tasks = functionality.tasks.map((task) => ({
        x: task.name,
        y: functionality.name,
        start: new Date(props.startDate),
        end: new Date(
          new Date(props.startDate).getTime() +
            (task.frontendHours + task.backendHours) * 60 * 60 * 1000
        )
      }))

      return {
        label: functionality.name,
        data: tasks.map((task) => ({
          x: [task.start, task.end],
          y: functionality.name
        })),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        fill: true
      }
    })

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.functionalities.map((f) => f.name),
        datasets: datasets
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            },
            title: {
              display: true,
              text: 'Tiempo'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Funcionalidades'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          datalabels: {
            display: false
          }
        }
      },
      plugins: [ChartDataLabels]
    })
  }
})

watch(
  () => [props.functionalities, props.startDate],
  () => {}
)
</script>
