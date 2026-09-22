<template>
  <div
    class="task-card group"
    :class="{ 'dragging': isDragging, 'opacity-50': draggingOver }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent
  >
    <div class="flex items-start justify-between mb-2">
      <h3 class="font-semibold text-sm leading-tight flex-1 break-words">{{ task.title }}</h3>
      <span
        class="text-xs px-2 py-0.5 rounded-full font-medium ml-2 whitespace-nowrap"
        :class="priorityClass"
      >
        {{ priorityLabel }}
      </span>
    </div>
    <p v-if="task.description" class="text-xs text-gray-500 dark:text-gray-400 mb-3 break-words">
      {{ task.description }}
    </p>
    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ formattedDate }}
      </span>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button @click="$emit('edit', task)" class="btn-ghost text-xs px-2 py-1" title="编辑">✏️</button>
        <button @click="$emit('delete', task.id)" class="btn-danger text-xs px-2 py-1" title="删除">🗑️</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  task: { type: Object, required: true },
})

defineEmits(['edit', 'delete'])

const isDragging = ref(false)
const draggingOver = ref(false)

const priorityMap = {
  high: { label: '高', class: 'priority-high' },
  medium: { label: '中', class: 'priority-medium' },
  low: { label: '低', class: 'priority-low' },
}

const priorityLabel = computed(() => priorityMap[props.task.priority]?.label || '中')
const priorityClass = computed(() => priorityMap[props.task.priority]?.class || 'priority-medium')

const formattedDate = computed(() => {
  if (!props.task.createdAt) return ''
  const d = new Date(props.task.createdAt)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
})

function onDragStart(e) {
  isDragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', props.task.id)
}

function onDragEnd() {
  isDragging.value = false
}
</script>