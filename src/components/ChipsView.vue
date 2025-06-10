<script setup lang="ts">
import Textarea from 'primevue/textarea'

const { modelValue } = defineProps<{
  modelValue?: { text: string }[]
}>()

const emits = defineEmits<{
  'update:modelValue': [value: { text: string }[]]
}>()
</script>

<template>
  <Textarea
    rows="1"
    autoResize
    @keydown.enter.prevent
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
