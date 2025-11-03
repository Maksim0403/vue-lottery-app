<script setup lang="ts">

import RegistrationForm from '@/components/RegistrationForm.vue'
import type { Participant } from '@/types.ts'
import { createUser } from '@/repositories/UserRepository.ts'
import { ref } from 'vue'

const errorMessage = ref('')
const users = ref<Participant[]>([])
const filteredUsers = ref<Participant[]>([])
const isLoading = ref(false)

async function addParticipant(user: Omit<Participant, 'id'>) {
  if (users.value.some((p) => p.email.toLowerCase() === user.email.toLowerCase())) {
    errorMessage.value = 'Користувач з таким e-mail вже існує!'
    return
  }

  isLoading.value = true
  try {
    const newUser = await createUser(user)

    users.value.push(newUser)
    filteredUsers.value = [...users.value]
    localStorage.setItem('participants', JSON.stringify(users.value))

    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = 'Помилка при створенні користувача: ' + (err as Error).message
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <RegistrationForm
    @add-user="addParticipant"
    :model-value="null"
    mode="create"
  />

  <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
</template>
