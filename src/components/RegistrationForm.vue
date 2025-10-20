<script setup lang="ts">
import { ref, computed } from 'vue'

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
  const regex = /^\+?\d{10,15}$/
  if (!regex.test(phone.value)) return 'Invalid phone format'
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
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': nameError, 'is-valid': touched.name && !nameError }"
          v-model="name"
          @blur="markTouched('name')"
          placeholder="Введіть ім'я"
        />
        <div class="invalid-feedback" v-if="nameError">{{ nameError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Birth Date</label>
        <input
          type="date"
          class="form-control"
          :class="{ 'is-invalid': birthDateError, 'is-valid': touched.birthDate && !birthDateError }"
          v-model="birthDate"
          @blur="markTouched('birthDate')"
        />
        <div class="invalid-feedback" v-if="birthDateError">{{ birthDateError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          :class="{ 'is-invalid': emailError, 'is-valid': touched.email && !emailError }"
          v-model="email"
          @blur="markTouched('email')"
        />
        <div class="invalid-feedback" v-if="emailError">{{ emailError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Phone</label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': phoneError, 'is-valid': touched.phone && !phoneError }"
          v-model="phone"
          @blur="markTouched('phone')"
        />
        <div class="text-danger">{{ phoneError }}</div>
      </div>

      <div class="d-flex justify-content-end">
        <button class="btn btn-info text-white" @click="saveParticipant" :disabled="!isFormValid" >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-info {
  background-color: #17a2b8;
}
</style>
