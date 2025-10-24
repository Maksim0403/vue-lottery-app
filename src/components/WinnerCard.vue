<script setup lang="ts">
import type { Participant } from '@/types.ts'
import BaseButton from '@/components/BaseButton.vue'

defineProps<{
  winner: Participant
}>()

const emit = defineEmits<{
  (e: 'remove-winner', id: number): void
}>()

</script>

<template>
  <span class="badge bg-info text-white d-flex align-items-center">
    {{ winner.name }}
    <BaseButton
      :type="'button'"
      class="btn-close btn-close-white btn-sm ms-1"
      @click="emit('remove-winner', winner.id)"
    />
  </span>
</template>

<style scoped>

</style>
