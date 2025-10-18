<script setup lang="ts">
import type { Participant } from '@/types.ts'

defineProps<{
  winners: Participant[]
  canAddWinner: boolean
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
            <span v-for="winner in winners" :key="winner.id" class="badge bg-info text-white">
              {{ winner.name }}
              <button
                type="button"
                class="btn-close btn-close-white btn-sm ms-1"
                aria-label="Remove"
                @click="emit('remove-winner', winner.id)"
              ></button>
            </span>
            Winners
          </div>
        </div>

        <button
          class="btn btn-info text-white ms-3"
          @click="emit('add-winner')"
          :disabled="!canAddWinner"
        >
          New winner
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-info {
  background-color: #17a2b8;
}

.winner-item {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}

.winner-item:hover {
  background-color: #e9ecef;
}

.btn-outline-danger {
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
}
</style>
