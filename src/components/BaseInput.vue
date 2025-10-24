<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: 'name' | 'date' | 'email' | 'phone'
  label?: string
  placeholder?: string
  error?: string
  touched?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label">{{ label }}</label>
    <input
      :type="type || 'text'"
      class="form-control"
      :class="{
        'is-invalid': error,
        'is-valid': touched && !error
      }"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <div class="invalid-feedback" v-if="error">{{ error }}</div>
  </div>
</template>

<style scoped>

</style>
