<script setup lang="ts">
import InputText from 'primevue/inputtext'

const { value } = defineProps<{
  value: string[]
}>()
</script>

<template>
  <InputText :value="value.join()" />
</template>
