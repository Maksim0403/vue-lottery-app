<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
  variant?: 'primary' | 'danger' | 'secondary' | 'success' | 'info'
  type?: 'button' | 'submit' | 'reset'
  text?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
<button
  :class="['btn', `btn-${variant}`]"
  :disabled="disabled"
  :type="type || 'button'"
  @click="emit('click')"
>
<slot>{{ label }}</slot>
</button>
</template>

<style scoped>

</style>
