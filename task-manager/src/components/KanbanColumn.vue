<template>
  <div
    class="kanban-column border-t-4"
    :class="color"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-bold text-gray-700 dark:text-gray-200">{{ title }}</h2>
      <span class="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
        {{ tasks.length }}
      </span>
    </div>

    <div
      class="space-y-3 min-h-[100px] transition-colors duration-200 rounded-lg p-1"
      :class="{ 'bg-blue-50 dark:bg-blue-900/20': isDragOver }"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="$emit('edit', task)"
        @delete="$emit('delete', task.id)"
      />

      <div v-if="tasks.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
        <p>拖拽任务到此处</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, default: () => [] },
  status: { type: String, required: true },
  color: { type: String, default: '' },
})

const emit = defineEmits(['drop', 'edit', 'delete'])

const isDragOver = ref(false)

function onDragOver(e) {
  isDragOver.value = true
  e.dataTransfer.dropEffect = 'move'
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e) {
  isDragOver.value = false
  const taskId = e.dataTransfer.getData('text/plain')
  if (taskId) {
    emit('drop', taskId, props.status)
  }
}
</script>