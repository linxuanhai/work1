<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {{ isEditing ? '编辑任务' : '新建任务' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="input-field"
              placeholder="请输入任务标题"
              ref="titleInput"
              maxlength="100"
            />
            <p v-if="titleError" class="text-red-500 text-xs mt-1">{{ titleError }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述（选填）
            </label>
            <textarea
              v-model="form.description"
              class="input-field resize-none"
              rows="3"
              placeholder="请输入任务描述"
              maxlength="500"
            ></textarea>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">优先级</label>
            <div class="flex gap-3">
              <label
                v-for="p in priorities"
                :key="p.value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  :value="p.value"
                  v-model="form.priority"
                  class="accent-blue-600"
                />
                <span class="text-sm px-2 py-0.5 rounded-full" :class="p.class">{{ p.label }}</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="$emit('close')" class="btn-ghost px-4 py-2">取消</button>
            <button type="submit" class="btn-primary" :disabled="!form.title.trim()">
              {{ isEditing ? '保存' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  task: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const titleInput = ref(null)
const titleError = ref('')
const isEditing = ref(false)

const priorities = [
  { value: 'high', label: '高', class: 'priority-high' },
  { value: 'medium', label: '中', class: 'priority-medium' },
  { value: 'low', label: '低', class: 'priority-low' },
]

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
})

watch(() => props.visible, async (val) => {
  if (val) {
    if (props.task) {
      isEditing.value = true
      form.title = props.task.title || ''
      form.description = props.task.description || ''
      form.priority = props.task.priority || 'medium'
    } else {
      isEditing.value = false
      form.title = ''
      form.description = ''
      form.priority = 'medium'
    }
    titleError.value = ''
    await nextTick()
    titleInput.value?.focus()
  }
})

function handleSubmit() {
  if (!form.title.trim()) {
    titleError.value = '标题不能为空'
    return
  }
  titleError.value = ''
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
  })
}
</script>