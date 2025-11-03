<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/repositories/UserRepository'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const isAuthenticated = ref(!!localStorage.getItem('token'))

window.addEventListener('storage', () => {
  isAuthenticated.value = !!localStorage.getItem('token')
})

router.afterEach(() => {
  isAuthenticated.value = !!localStorage.getItem('token')
})

const handleLogout = () => {
  logout()
  isAuthenticated.value = false
  router.push('/login')
}
</script>

<template>
  <nav class="d-flex align-items-center gap-2 mb-4">

    <router-link
      class="btn"
      active-class="btn-primary text-white"
      v-if="isAuthenticated"
      :to="{ name: 'home' }"> Home </router-link>

    <router-link
      class="btn"
      active-class="btn-primary text-white"
      v-if="isAuthenticated"
      :to="{ name: 'about' }">About</router-link>

    <router-link
      class="btn"
      active-class="btn-primary text-white"
      v-if="isAuthenticated"
      :to="{ name: 'lottery' }">Lottery</router-link>

    <router-link
      class="btn"
      active-class="btn-primary text-white"
      v-if="isAuthenticated"
      :to="{ name: 'user', params: { id: 1 } }">Users</router-link>

    <router-link
      v-if="!isAuthenticated"
      class="btn btn-primary ms-auto"
      :to="{ name: 'login' }"
    >
      Login
    </router-link>

    <BaseButton
      v-else
      variant="danger"
      class="ms-auto"
      label="Logout"
      @click="handleLogout"
    />

  </nav>
</template>
