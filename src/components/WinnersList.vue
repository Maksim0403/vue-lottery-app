<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import WinnerCard from '@/components/WinnerCard.vue'
import type { Participant } from '@/types.ts'
defineProps<{
  canAddWinner: boolean
  winners: Participant[]
}>()

const emit = defineEmits<{
  (e: 'add-winner'): void
  (e: 'remove-winner', id: number): void
}>()
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="flex-grow-1">
          <div class="form-control d-flex flex-wrap align-items-center gap-3 py-2">
            <WinnerCard
              v-for="winner in winners"
              :key="winner.id"
              :winner="winner"
              @remove-winner="emit('remove-winner', winner.id)"
            />
            Winners
          </div>
        </div>

        <BaseButton
          label="New winner"
          variant="info"
          class="text-white ms-3"
          :disabled="!canAddWinner"
          @click="emit('add-winner')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
