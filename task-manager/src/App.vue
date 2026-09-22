<template>
  <div class="min-h-screen transition-colors duration-200">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">📋 任务管理</h1>
            <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
              共 {{ tasks.length }} 个任务
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openAddForm" class="btn-primary text-sm flex items-center gap-1.5">
              <span class="text-lg leading-none">+</span>
              <span>新建任务</span>
            </button>
            <ThemeToggle :isDark="isDark" @toggle="toggleTheme" />
          </div>
        </div>
      </div>
    </header>

    <!-- Kanban Board -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          v-for="col in columns"
          :key="col.status"
          :title="col.title"
          :tasks="getTasksByStatus(col.status)"
          :status="col.status"
          :color="col.color"
          @drop="onDrop"
          @edit="openEditForm"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty state -->
      <div v-if="tasks.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-gray-500 dark:text-gray-400 text-lg mb-4">还没有任何任务，开始创建第一个吧！</p>
        <button @click="openAddForm" class="btn-primary">+ 新建任务</button>
      </div>
    </main>

    <!-- Task Form Modal -->
    <TaskForm
      :visible="showForm"
      :task="editingTask"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTasks } from './composables/useTasks.js'
import { useTheme } from './composables/useTheme.js'
import ThemeToggle from './components/ThemeToggle.vue'
import TaskForm from './components/TaskForm.vue'
import KanbanColumn from './components/KanbanColumn.vue'

const { tasks, addTask, updateTask, deleteTask, moveTask, getTasksByStatus } = useTasks()
const { isDark, toggleTheme } = useTheme()

const showForm = ref(false)
const editingTask = ref(null)

const columns = [
  { status: 'todo', title: '📋 待办', color: 'border-t-blue-500' },
  { status: 'doing', title: '🔄 进行中', color: 'border-t-yellow-500' },
  { status: 'done', title: '✅ 已完成', color: 'border-t-green-500' },
]

function openAddForm() {
  editingTask.value = null
  showForm.value = true
}

function openEditForm(task) {
  editingTask.value = task
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingTask.value = null
}

function handleSubmit(data) {
  if (editingTask.value) {
    updateTask(editingTask.value.id, data)
  } else {
    addTask(data.title, data.description, data.priority)
  }
  closeForm()
}

function handleDelete(id) {
  if (confirm('确定要删除这个任务吗？')) {
    deleteTask(id)
  }
}

function onDrop(taskId, newStatus) {
  moveTask(taskId, newStatus)
}
</script>