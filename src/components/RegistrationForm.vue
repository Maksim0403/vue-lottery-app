<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { Participant } from '@/types'

const props = defineProps<{
  modelValue: Participant | null
  mode?: 'edit' | 'create'
}>()

const emit = defineEmits<{
  (e: 'save', updatedUser: Participant): void
  (e: 'add-user', newUser: Omit<Participant, 'id'>): void
}>()

const form = ref<Omit<Participant, 'id'>>({
  name: '',
  email: '',
  password: '',
  avatar: '',
})

const touched = ref({
  name: false,
  email: false,
  password: false,
  avatar: false,
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        email: newVal.email,
        password: newVal.password ?? '',
        avatar: newVal.avatar,
      }
    } else {
      form.value = { name: '', email: '', password: '', avatar: '' }
    }

    touched.value = { name: false, email: false, password: false, avatar: false }
  },
  { immediate: true },
)

const nameError = computed(() =>
  touched.value.name && form.value.name.trim() === '' ? 'Name is required' : '',
)

const emailError = computed(() => {
  if (!touched.value.email) return ''
  const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.value.email.trim() === '') return 'Email is required'
  if (!r.test(form.value.email)) return 'Invalid email format'
  return ''
})

const passwordError = computed(() => {
  if (!touched.value.password) return ''
  if (form.value.password.trim() === '') return 'Password is required'
  if (form.value.password.length < 6) return 'Min 6 characters'
  return ''
})

const avatarError = computed(() => {
  if (!touched.value.avatar) return ''
  if (form.value.avatar.trim() === '') return 'Avatar URL is required'
  return ''
})

const isFormValid = computed(
  () =>
    !nameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !avatarError.value &&
    form.value.name &&
    form.value.email &&
    form.value.password &&
    form.value.avatar,
)

function markTouched(field: keyof typeof touched.value) {
  touched.value[field] = true
}

function onSave() {
  if (!isFormValid.value) return

  if (props.mode === 'edit' && props.modelValue) {
    emit('save', { ...props.modelValue, ...form.value })
  } else {
    emit('add-user', { ...form.value })
  }
}
</script>

<template>
  <form class="card" @submit.prevent="onSave">
    <div class="card-body">

      <BaseInput
        v-model="form.name"
        label="Name"
        placeholder="Enter name"
        :error="nameError"
        :touched="touched.name"
        @blur="markTouched('name')"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        placeholder="Enter email"
        :error="emailError"
        :touched="touched.email"
        @blur="markTouched('email')"
      />

      <BaseInput
        v-model="form.password"
        label="Password"
        placeholder="Enter password"
        :error="passwordError"
        :touched="touched.password"
        @blur="markTouched('password')"
      />

      <BaseInput
        v-model="form.avatar"
        label="Avatar URL"
        placeholder="Enter avatar image link"
        :error="avatarError"
        :touched="touched.avatar"
        @blur="markTouched('avatar')"
      />

      <div class="d-flex justify-content-end">
        <BaseButton
          class="text-white"
          type="submit"
          label="Save"
          variant="info"
          :disabled="!isFormValid"
        />
      </div>

    </div>
  </form>
</template>
