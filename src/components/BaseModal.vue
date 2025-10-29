<script setup lang="ts">

withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: false
})

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <header class="modal-header">
          <slot name="header">
            <h5 class="modal-title">Modal</h5>
          </slot>
          <button type="button" class="btn-close" @click="close"></button>
        </header>

        <div class="modal-body">
          <slot />
        </div>

        <footer class="modal-footer">
          <slot name="footer">
            <button class="btn btn-secondary" @click="close">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  z-index: 1050;
}
.modal-dialog {
  max-width: 720px;
  width: 100%;
  padding: 1rem;
}
.modal-content {
  background: #fff;
  border-radius: .25rem;
  overflow: hidden;
}
.modal-header, .modal-footer {
  padding: .75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
}
.modal-body {
  padding: 1rem;
}
.btn-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
}
</style>
