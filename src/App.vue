<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import WinnersList from '@/components/WinnersList.vue'
import Modal from '@/components/Modal.vue'
import type { Participant } from '@/types.ts'
import BaseButton from '@/components/BaseButton.vue'
import SearchBar from '@/components/SearchBar.vue'

const participants = ref<Participant[]>([])
const filteredParticipants = ref<Participant[]>([])
const winners = ref<Participant[]>([])
const errorMessage = ref('')
let nextId = 1

onMounted(() => {
  const stored = localStorage.getItem('participants')
  if (stored) {
    participants.value = JSON.parse(stored)
    filteredParticipants.value = participants.value
  }

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      showEditModal.value = false
      showDeleteModal.value = false
    }
  }
  window.addEventListener('keydown', handleEsc)
  onUnmounted(() => window.removeEventListener('keydown', handleEsc))
})

watch(
  participants,
  (newVal) => {
    localStorage.setItem('participants', JSON.stringify(newVal))
  },
  { deep: true },
)

function addParticipant(participant: {
  name: string
  email: string
  phone: string
  birthDate: string
}) {
  const exists = participants.value.some(
    (p) => p.email.toLowerCase() === participant.email.toLowerCase()
  )

  if (exists) {
    errorMessage.value = 'Учасник з таким e-mail вже існує!'
    return
  }

  const p: Participant = {
    id: nextId++,
    name: participant.name,
    birthDate: participant.birthDate,
    email: participant.email,
    phone: participant.phone,
  }
  participants.value.push(p)
  filteredParticipants.value = participants.value
  errorMessage.value = ''
}

const canAddWinner = computed(() => participants.value.length > 0 && winners.value.length < 3)

function addWinner() {
  if (!canAddWinner.value) return
  const remaining = participants.value.filter((p) => !winners.value.some((w) => w.id === p.id))
  if (remaining.length === 0) return
  const pick = remaining[Math.floor(Math.random() * remaining.length)]
  winners.value.push(pick)
}

function removeWinner(id: number) {
  winners.value = winners.value.filter((w) => w.id !== id)
}

const showEditModal = ref(false)
const editingParticipant = ref<Participant | null>(null)

function openEdit(participant: Participant) {
  editingParticipant.value = { ...participant }
  showEditModal.value = true
}

function saveEditedParticipant(updated: Participant) {
  participants.value = participants.value.map((p) => (p.id === updated.id ? { ...updated } : p))
  showEditModal.value = false
  editingParticipant.value = null
}

const deletingParticipant = ref<Participant | null>(null)
const showDeleteModal = ref(false)

function confirmDelete(participant: Participant) {
  deletingParticipant.value = participant
  showDeleteModal.value = true
}

function deleteParticipant() {
  if (deletingParticipant.value) {
    participants.value = participants.value.filter(p => p.id !== deletingParticipant.value!.id)
    winners.value = winners.value.filter(w => w.id !== deletingParticipant.value!.id)
    filteredParticipants.value = participants.value
  }
  showDeleteModal.value = false
  deletingParticipant.value = null
}


function filterByName(query: string) {
  const lowerQuery = query.toLowerCase().trim()

  if (lowerQuery === '') {
    filteredParticipants.value = participants.value
  } else {
    filteredParticipants.value = participants.value.filter((p) =>
      p.name.toLowerCase().includes(lowerQuery),
    )
  }
}
</script>

<template>
  <div class="container py-4">
    <div class="row g-3">
      <WinnersList
        :winners="winners"
        :can-add-winner="canAddWinner"
        @add-winner="addWinner"
        @remove-winner="removeWinner"
      />
      <RegistrationForm @add-participant="addParticipant" :model-value="null" mode="create" />
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>

      <SearchBar @filter-by-name="filterByName" />

      <ParticipantsTable
        :participants="filteredParticipants"
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
        <BaseButton label="Cancel" variant="secondary" @click="showEditModal = false" />
      </template>
    </Modal>
    <Modal v-model="showDeleteModal">
      <template #header>
        <h5 class="modal-title">Підтвердження видалення</h5>
      </template>

      <div class="modal-body">
        Ви впевнені, що хочете видалити учасника
        <strong>{{ deletingParticipant?.name }}</strong
        >?
      </div>

      <template #footer>
        <BaseButton label="Відмінити" variant="secondary" @click="showDeleteModal = false" />
        <BaseButton label="Видалити" variant="danger" @click="deleteParticipant" />
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
