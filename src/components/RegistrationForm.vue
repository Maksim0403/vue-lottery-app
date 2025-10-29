<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { Participant } from '@/types.ts'

const props = defineProps<{
  modelValue: Participant | null
  mode?: 'edit' | 'create'
}>()

const emit = defineEmits<{
  (e: 'save', updatedParticipant: Participant): void
  (e: 'add-participant', newParticipant: Omit<Participant, 'id'>): void
}>()

const form = ref<Omit<Participant, 'id'>>({
  name: '',
  birthDate: '',
  email: '',
  phone: '',
})

const touched = ref({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        birthDate: newVal.birthDate,
        email: newVal.email,
        phone: newVal.phone,
      }
    } else {
      form.value = { name: '', birthDate: '', email: '', phone: '' }
    }
    // скидаємо стани touched при новому завантаженні
    touched.value = { name: false, birthDate: false, email: false, phone: false }
  },
  { immediate: true },
)

const nameError = computed(() => {
  if (!touched.value.name) return ''
  if (form.value.name.trim() === '') return 'Name is required'
  return ''
})

const birthDateError = computed(() => {
  if (!touched.value.birthDate) return ''
  if (!form.value.birthDate) return 'Birth date is required'
  if (new Date(form.value.birthDate) > new Date()) return 'Birth date cannot be in the future'
  return ''
})

const emailError = computed(() => {
  if (!touched.value.email) return ''
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.value.email.trim() === '') return 'Email is required'
  if (!regex.test(form.value.email)) return 'Invalid email format'
  return ''
})

const phoneError = computed(() => {
  if (!touched.value.phone) return ''
  if (form.value.phone.trim() === '') return 'Phone is required'
  const regex = /^\+380\d{9}$/
  if (!regex.test(form.value.phone)) return 'Invalid phone format (expected: +380XXXXXXXXX)'
  return ''
})

const isFormValid = computed(
  () =>
    form.value.name.trim() !== '' &&
    form.value.birthDate !== '' &&
    form.value.email.trim() !== '' &&
    form.value.phone.trim() !== '' &&
    !nameError.value &&
    !birthDateError.value &&
    !emailError.value &&
    !phoneError.value,
)

function markTouched(field: keyof typeof touched.value) {
  touched.value[field] = true
}

function onSave() {
  if (!isFormValid.value) return
  if (props.mode === 'edit' && props.modelValue) {
    emit('save', {
      ...props.modelValue,
      name: form.value.name,
      birthDate: form.value.birthDate,
      email: form.value.email,
      phone: form.value.phone,
    })
  } else {
    emit('add-participant', {
      name: form.value.name,
      birthDate: form.value.birthDate,
      email: form.value.email,
      phone: form.value.phone,
    })
  }
  form.value = { name: '', birthDate: '', email: '', phone: '' }
  touched.value = { name: false, birthDate: false, email: false, phone: false }
}
</script>

<template>
  <form class="card" @submit.prevent="onSave">
    <div class="card-body">
      <BaseInput
        v-model="form.name"
        label="Name"
        placeholder="Введіть ім'я"
        :error="nameError"
        :touched="touched.name"
        @blur="markTouched('name')"
      />

      <BaseInput
        type="date"
        v-model="form.birthDate"
        label="Birth Date"
        :error="birthDateError"
        :touched="touched.birthDate"
        @blur="markTouched('birthDate')"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        placeholder="Введіть email"
        :error="emailError"
        :touched="touched.email"
        @blur="markTouched('email')"
      />

      <BaseInput
        v-model="form.phone"
        label="Phone"
        placeholder="Введіть номер"
        :error="phoneError"
        :touched="touched.phone"
        @blur="markTouched('phone')"
      />

      <div class="d-flex justify-content-end">
        <BaseButton
          class="text-white"
          label="Save"
          :disabled="!isFormValid"
          variant="info"
          @click="onSave"
          type="submit"
        />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
