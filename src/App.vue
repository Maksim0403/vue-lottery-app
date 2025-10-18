<script setup lang="ts">
import { computed, ref } from 'vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import WinnersList from '@/components/WinnersList.vue'
import type { Participant } from '@/types.ts'

const participants = ref<Participant[]>([])
const winners = ref<Participant[]>([])
let nextId = 1

function addParticipant(participant: {
  name: string
  email: string
  phone: string
  birthDate: string
}) {
  const p: Participant = {
    id: nextId++,
    name: participant.name,
    birthDate: participant.birthDate,
    email: participant.email,
    phone: participant.phone,
  }
  participants.value.push(p)
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
      <RegistrationForm @add-participant="addParticipant" />
      <ParticipantsTable :participants="participants" />
    </div>
  </div>
</template>

<style scoped></style>
