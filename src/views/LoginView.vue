<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { login } from '@/repositories/UserRepository'
import * as yup from 'yup'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const errorMessage = ref('')

const isLoading = ref(false)

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters')
})

const onLogin = async (values: { email: string; password: string }) => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const data = await login(values.email, values.password)

    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
      await router.push('/')
    } else {
      errorMessage.value = 'Email або пароль неправильні'
    }
  } catch (error) {
    errorMessage.value = 'Помилка при вході'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card mt-5">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login</h2>

            <Form :validation-schema="schema" @submit="onLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <Field
                  name="email"
                  type="email"
                  class="form-control"
                  placeholder="admin@mail.com"
                />
                <ErrorMessage name="email" class="text-danger small" />
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <Field
                  name="password"
                  type="password"
                  class="form-control"
                  placeholder="admin123"
                />
                <ErrorMessage name="password" class="text-danger small" />
              </div>

              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <div class="alert small">
                <strong>Test:</strong> admin@mail.com / admin123
              </div>

              <BaseButton
                type="submit"
                label="Login"
                variant="primary"
                class="w-100"
                :disabled="isLoading"
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
