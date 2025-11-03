<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import Modal from '@/components/BaseModal.vue'
import type { Participant } from '@/types.ts'
import BaseButton from '@/components/BaseButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getUsers, updateUser, deleteUser, logout } from '@/repositories/UserRepository'
import AppHeader from '@/components/AppHeader.vue'

const isAuthenticated = ref(false)

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('token')
}

const users = ref<Participant[]>([])
const filteredUsers = ref<Participant[]>([])
const winners = ref<Participant[]>([])
const errorMessage = ref('')
const isLoading = ref(false)

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    showEditModal.value = false
    showDeleteModal.value = false
  }
}

async function loadUsers() {
  isLoading.value = true
  try {
    const saved = localStorage.getItem('participants')

    if (saved) {
      users.value = JSON.parse(saved)
    } else {
      users.value = await getUsers()
      localStorage.setItem('participants', JSON.stringify(users.value))
    }

    filteredUsers.value = users.value
  } catch (err) {
    console.error('Error loading users:', err)
    errorMessage.value = 'Помилка завантаження користувачів'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadUsers()
  window.addEventListener('keydown', handleEsc)
  checkAuth()
  window.addEventListener('storage', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
  window.removeEventListener('storage', checkAuth)
})

watch(
  () => localStorage.getItem('token'),
  (newToken) => {
    isAuthenticated.value = !!newToken
  }
)

const handleLogout = () => {
  logout()
  isAuthenticated.value = false
}

const showEditModal = ref(false)
const editingParticipant = ref<Participant | null>(null)

function openEdit(participant: Participant) {
  editingParticipant.value = { ...participant }
  showEditModal.value = true
  errorMessage.value = ''
}

async function saveEditedParticipant(updated: Participant) {
  if (!updated.id) {
    errorMessage.value = 'Некоректний ID користувача'
    return
  }

  isLoading.value = true
  try {
    const updatedUser = await updateUser(updated.id, {
      name: updated.name,
      email: updated.email,
      password: updated.password,
      role: updated.role,
      avatar: updated.avatar,
    })

    users.value = users.value.map((p) => (p.id === updatedUser.id ? updatedUser : p))
    filteredUsers.value = users.value

    localStorage.setItem('participants', JSON.stringify(users.value))

    winners.value = winners.value.map((w) => (w.id === updatedUser.id ? updatedUser : w))

    showEditModal.value = false
    editingParticipant.value = null
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = 'Помилка при оновленні користувача: ' + (err as Error).message
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const deletingParticipant = ref<Participant | null>(null)
const showDeleteModal = ref(false)

function confirmDelete(participant: Participant) {
  if (!participant || !participant.id) {
    errorMessage.value = 'Помилка: некоректні дані користувача'
    return
  }

  deletingParticipant.value = { ...participant }
  showDeleteModal.value = true
  errorMessage.value = ''
}

async function deleteParticipant() {
  if (!deletingParticipant.value?.id) {
    errorMessage.value = 'Помилка: не вибрано користувача для видалення'
    return
  }

  const id = deletingParticipant.value.id
  isLoading.value = true

  try {
    await deleteUser(id)

    users.value = users.value.filter(u => u.id !== id)
    filteredUsers.value = filteredUsers.value.filter(u => u.id !== id)
    winners.value = winners.value.filter(w => w.id !== id)

    showDeleteModal.value = false
    deletingParticipant.value = null
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = 'Не вдалося видалити користувача: ' + (err as Error).message
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function filterByName(query: string) {
  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery === '') {
    filteredUsers.value = users.value
  } else {
    filteredUsers.value = users.value.filter((p) =>
      p.name.toLowerCase().includes(lowerQuery)
    )
  }
}
</script>

<template>
  <div class="container py-4">
    <div class="row g-3">
      <AppHeader :is-authenticated="isAuthenticated" @logout="handleLogout"/>

      <main>
        <router-view :key="$route.params.id"/>
      </main>

      <div v-if="isLoading" class="text-center my-3">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Завантаження...</span>
        </div>
      </div>

      <SearchBar @filter-by-name="filterByName" />

      <ParticipantsTable
        :users="filteredUsers"
        @edit-participant="openEdit"
        @delete-participant="confirmDelete"
      />
    </div>

    <Modal v-model="showEditModal" >
      <template #header>
        <h5 class="modal-title">Редагувати учасника</h5>
      </template>

      <RegistrationForm
        :model-value="editingParticipant"
        mode="edit"
        @save="saveEditedParticipant"
      />
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>

      <template #footer>
        <BaseButton
          label="Відмінити"
          variant="secondary"
          @click="showEditModal = false"
          :disabled="isLoading"
        />
      </template>
    </Modal>

    <Modal v-model="showDeleteModal">
      <template #header>
        <h5 class="modal-title">Підтвердження видалення</h5>
      </template>

      <div class="modal-body">
        Ви впевнені, що хочете видалити учасника
        <strong>{{ deletingParticipant?.name }}</strong>?
      </div>

      <template #footer>
        <BaseButton
          label="Відмінити"
          variant="secondary"
          @click="showDeleteModal = false"
          :disabled="isLoading"
        />
        <BaseButton
          label="Видалити"
          variant="danger"
          @click="deleteParticipant"
          :disabled="isLoading"
        />
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
