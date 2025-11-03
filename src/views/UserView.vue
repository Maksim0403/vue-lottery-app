<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getUserById } from '@/repositories/UserRepository'

const route = useRoute()
const user = ref(null)

async function loadUser(id: string | string[] | undefined) {
  if (!id) {
    user.value = null
    return
  }
  user.value = await getUserById(id)
}

onMounted(() => {
  loadUser(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    loadUser(newId)
  },
)
</script>

<template>
  <div v-if="user" class="container py-4 d-flex justify-content-center">
    <div class="card user-card p-3">
      <div class="text-center mb-3">
        <img :src="user.avatar" alt="User Avatar" class="avatar rounded-circle mb-2" />
        <h2 class="mb-0">{{ user.name }}</h2>
        <small class="text-muted">{{ user.role }}</small>
      </div>

      <div class="list-group list-group-flush">
        <div class="list-group-item">
          <b>Email:</b> {{ user.email }}
        </div>
        <div class="list-group-item">
          <b>Role:</b> {{ user.role }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.user-card {
  max-width: 360px;
  border-radius: 12px;
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid #f1f1f1;
}
</style>
