<script setup lang="ts">
import type { Participant } from '@/types.ts'
import BaseButton from '@/components/BaseButton.vue'
import { computed, ref } from 'vue'

const props = defineProps<{ participants: Participant[] }>()

const emit = defineEmits<{
  (e: 'edit-participant', p: Participant): void
  (e: 'delete-participant', p: Participant): void
}>()

const sortBy = ref<'name' | 'birthDate' | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleSort(field: 'name' | 'birthDate') {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const sortedParticipants = computed(() => {
  const result = [...props.participants]

  if (sortBy.value) {
    result.sort((a, b) => {
      const aVal = a[sortBy.value!]
      const bVal = b[sortBy.value!]

      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  return result
})
</script>

<template>
  <div class="card">
    <div class="card-body p-0">
      <table class="table mb-0">
        <thead>
          <tr>
            <th @click="toggleSort('name')">
              Sort by name
              <i v-if="sortBy === 'name'">
                {{ sortOrder === 'desc' ? '↑' : '↓' }}
              </i>
            </th>
            <th @click="toggleSort('birthDate')" style="cursor: pointer;">
              Birth Date
              <i v-if="sortBy === 'birthDate'"
                 :class="sortOrder === 'asc' ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
            </th>
          </tr>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Birth date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, idx) in sortedParticipants" :key="p.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.email }}</td>
            <td>{{ p.phone }}</td>
            <td>{{ p.birthDate }}</td>
            <td>
              <BaseButton
                label="Редагувати"
                variant="primary"
                @click="emit('edit-participant', p)"
              />
              <BaseButton
                label="Видалити"
                variant="danger"
                @click="emit('delete-participant', p)"
              />
            </td>
          </tr>
          <tr v-if="participants.length === 0">
            <td colspan="6" class="text-center py-3">No participants</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
