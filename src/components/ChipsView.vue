<script setup lang="ts">
import InputText from 'primevue/inputtext'

const { modelValue } = defineProps<{
  modelValue?: { text: string }[]
}>()

const emits = defineEmits<{
  'update:modelValue': [value: { text: string }[]]
}>()
</script>

<template>
  <InputText
    :value="(modelValue ?? []).map((e) => e.text).join(';')"
    @value-change="
      emits(
        'update:modelValue',
        ($event ?? '').split(';').map((e) => ({ text: e })),
      )
    "
    @blur="
      emits(
        'update:modelValue',
        (modelValue ?? []).filter((e) => e.text.trim() !== ''),
      )
    "
  />
</template>
