<script setup lang="ts">
import WinnersList from '@/components/WinnersList.vue'
import { computed, onMounted, ref } from 'vue'
import type { Participant } from '@/types.ts'

const users = ref<Participant[]>([])
const winners = ref<Participant[]>([])
const canAddWinner = computed(() => users.value.length > 0 && winners.value.length < 3)

onMounted(() => {
  const saved = localStorage.getItem('participants')
  if (saved) {
    users.value = JSON.parse(saved)
  }
})

function addWinner() {
  if (!canAddWinner.value) return
  const remaining = users.value.filter((p) => !winners.value.some((w) => w.id === p.id))
  if (remaining.length === 0) return
  const pick = remaining[Math.floor(Math.random() * remaining.length)]
  winners.value.push(pick)
}

function removeWinner(id: number) {
  winners.value = winners.value.filter((w) => w.id !== id)
}
</script>

<template>
  <WinnersList
    :winners="winners"
    :can-add-winner="canAddWinner"
    @add-winner="addWinner"
    @remove-winner="removeWinner"
  />
</template>
