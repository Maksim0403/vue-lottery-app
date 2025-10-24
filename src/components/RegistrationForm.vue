<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const name = ref('')
const birthDate = ref('')
const email = ref('')
const phone = ref('')

const touched = ref({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

const nameError = computed(() => {
  if (!touched.value.name) return
  if (name.value.trim() === '') return 'Name is required'
  return ''
})

const birthDateError = computed(() => {
  if (!touched.value.birthDate) return ''
  if (!birthDate.value) return 'Birth date is required'
  if (new Date(birthDate.value) > new Date()) return 'Birth date cannot be in the future'
  return ''
})

const emailError = computed(() => {
  if (!touched.value.email) return ''
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value.trim() === '') return 'Email is required'
  if (!regex.test(email.value)) return 'Invalid email format'
  return ''
})

const phoneError = computed(() => {
  if (!touched.value.phone) return ''
  if (phone.value.trim() === '') return 'Phone is required'
  const regex = /^\+380\d{9}$/
  if (!regex.test(phone.value)) return 'Invalid phone format (expected: +380XXXXXXXXX)'
  return ''
})

const isFormValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    birthDate.value !== '' &&
    email.value.trim() !== '' &&
    phone.value.trim() !== '' &&
    !nameError.value &&
    !birthDateError.value &&
    !emailError.value &&
    !phoneError.value
  )
})

const emit = defineEmits<{
  (
    e: 'add-participant',
    participant: {
      name: string
      email: string
      phone: string
      birthDate: string
    },
  ): void
}>()

function markTouched(field: keyof typeof touched.value) {
  touched.value[field] = true
}

function saveParticipant() {
  if (!isFormValid.value) return

  const participant = {
    name: name.value,
    birthDate: birthDate.value,
    email: email.value,
    phone: phone.value,
  }

  emit('add-participant', participant)

  name.value = ''
  birthDate.value = ''
  email.value = ''
  phone.value = ''

  touched.value = {
    name: false,
    birthDate: false,
    email: false,
    phone: false,
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <BaseInput
        v-model="name"
        label="Name"
        placeholder="Введіть ім'я"
        :error="nameError"
        :touched="touched.name"
        @blur="markTouched('name')"
      />

      <BaseInput
        type="date"
        v-model="birthDate"
        label="Birth Date"
        :error="birthDateError"
        :touched="touched.birthDate"
        @blur="markTouched('birthDate')"
      />
      <BaseInput
        v-model="email"
        label="Email"
        placeholder="Введіть email"
        :error="emailError"
        :touched="touched.email"
        @blur="markTouched('email')"
      />
      <BaseInput
        v-model="phone"
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
          @click="saveParticipant"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
