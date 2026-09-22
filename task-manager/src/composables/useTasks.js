import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'task-manager-tasks'

const tasks = ref([])

export function useTasks() {
  // Load tasks from localStorage
  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        tasks.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load tasks:', e)
      tasks.value = []
    }
  })

  // Auto-save to localStorage whenever tasks change
  watch(tasks, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  }

  function addTask(title, description, priority) {
    if (!title || !title.trim()) return false
    const task = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      status: 'todo',
      createdAt: new Date().toISOString(),
    }
    tasks.value.unshift(task)
    return true
  }

  function updateTask(id, updates) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return false
    tasks.value[index] = { ...tasks.value[index], ...updates }
    return true
  }

  function deleteTask(id) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return false
    tasks.value.splice(index, 1)
    return true
  }

  function moveTask(taskId, newStatus) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = newStatus
    }
  }

  function getTasksByStatus(status) {
    return tasks.value.filter(t => t.status === status)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  }
}