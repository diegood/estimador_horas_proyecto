<template>
  <div class="gantt-container" v-if="hasData">
    <g-gantt-chart
      :chart-start="chartStart"
      :chart-end="chartEnd"
      precision="day"
      bar-start="startDate"
      bar-end="endDate"
      :row-height="40"
      @gantt-bar-change="onBarChange"
    >
      <g-gantt-row
        v-for="(row, index) in ganttRows"
        :key="index"
        :label="row.label"
        :bars="row.bars"
      />
    </g-gantt-chart>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { watchEffect } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import minMax from 'dayjs/plugin/minMax'
dayjs.extend(utc)
dayjs.extend(minMax)


const emit = defineEmits(['update-tasks']);

const props = defineProps({
  functionalities: Array,
  startDate: String
});

const onBarChange = (event) => {
  const { bar, newStartDate, newEndDate } = event;
  
  props.functionalities.forEach(funcionality => {
    funcionality.tasks.forEach(task => {
      if (task.id.toString() === bar.ganttBarConfig.id.split('-').pop()) {
        task.startDate = newStartDate;
        task.endDate = newEndDate;
      }
    });
  });
  
  emit('update-tasks', props.functionalities);
};

const categoryColors = {
  'Front-end': '#4A90E2', 
  'Back-end': '#50E3C2',  
};

const hasData = computed(() => {
  return props.functionalities?.some(f => 
    f.tasks?.some(t => 
      Object.values(t.hours).some(h => h > 0)
    )
  );
});

const ganttRows = computed(() => {
  const rows = [];
  const categoriesMap = new Map();
  
  props.functionalities.forEach(funcionality => {
    funcionality.tasks.forEach(task => {
      Object.entries(task.hours).forEach(([category, hours]) => {
        if (hours > 0) {
          if (!categoriesMap.has(category)) {
            categoriesMap.set(category, []);
          }
          categoriesMap.get(category).push({
            ...task,
            functionality: funcionality.name
          });
        }
      });
    });
  });

  categoriesMap.forEach((tasks, category) => {
    const row = {
      label: category.toUpperCase(),
      id: Symbol(),
      bars: []
    };

    const funcionalitiesMap = new Map();
    tasks.forEach(task => {
      if (!funcionalitiesMap.has(task.functionality)) {
        funcionalitiesMap.set(task.functionality, []);
      }
      funcionalitiesMap.get(task.functionality).push(task);
    });

    funcionalitiesMap.forEach((tasks, funcName) => {
      const dates = tasks.reduce((acc, task) => {
        const start = dayjs(task.startDate);
        const end = dayjs(task.endDate);
        
        return {
          min: acc.min ? (start.isBefore(acc.min) ? start : acc.min) : start,
          max: acc.max ? (end.isAfter(acc.max) ? end.add(1, 'day') : acc.max) : end.add(1, 'day')
        };
      }, { min: null, max: null });

      if (dates.min && dates.max) {
        row.bars.push({
          startDate: dates.min.format('YYYY-MM-DD 00:00'),
          endDate: dates.max.format('YYYY-MM-DD 23:59'),
          ganttBarConfig: {
            id: `functionality-${funcName}-${row.label}`,
            label: funcName,
            immobile: false,
            style: {
              background: categoryColors[category] || '#888',
              borderRadius: '4px'
            },
            hasHandles: true,
            isShadow: false,
            isMandatory: false
          }
        });
      }
    });
    
    rows.push(row);
  });
  
  return rows;
});

const chartDates = computed(() => {
  const allDates = [];
  
  props.functionalities?.forEach(func => {
    func.tasks?.forEach(task => {
      if (task.startDate && task.endDate) {
        allDates.push(dayjs(task.startDate));
        allDates.push(dayjs(task.endDate));
      }
    });
  });

  const hasValidDates = allDates.length > 0;
  const defaultStart = props.startDate 
    ? dayjs(props.startDate) 
    : dayjs().startOf('day');
  
  const defaultEnd = defaultStart.add(2, 'week');

  return {
    start: hasValidDates ? dayjs.min(allDates).subtract(1, 'day') : defaultStart,
    end: hasValidDates ? dayjs.max(allDates).add(2, 'days') : defaultEnd
  };
});


const chartStart = computed(() => {
  return chartDates.value.start?.format('YYYY-MM-DD 00:00') || dayjs().startOf('day').format('YYYY-MM-DD 00:00');
});

const chartEnd = computed(() => {
  return chartDates.value.end?.format('YYYY-MM-DD 23:59') || dayjs().endOf('day').format('YYYY-MM-DD 23:59');
});


watchEffect(() => {
  console.log({ 
    chartDates:{
      start: chartStart.value,
      end: chartEnd.value
    },
    ganttRows: JSON.parse(JSON.stringify(ganttRows.value))
  }
);
});
</script>

<style>
.gantt-container {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.g-gantt-chart {
  font-family: 'Arial', sans-serif;
  min-height: 300px;
}

.g-gantt-row-label {
  font-weight: 500;
  color: #333;
  min-width: 120px;
}

.gantt-container {
  overflow-x: auto;
  min-width: 800px;
}

.g-gantt-chart {
  --row-content-width: 200px;
  --bar-height: 24px;
  --bar-margin-top: 8px;
}
</style>