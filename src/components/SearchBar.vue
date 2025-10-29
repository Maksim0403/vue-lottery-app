<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void
}>()

</script>

<template>
<input
  type="text"
  class="form-control mb-3"
  placeholder="Search participants by name..."
  v-model="searchQuery"
  @input="emit('filter-by-name', searchQuery)">
</template>

<style scoped>

</style>
