<template>
  <NumberField v-model="internalValue" :min="30" :step="step">
    <Label class="font-normal">{{ label }}</Label>
    <NumberFieldContent>
      <NumberFieldDecrement :disabled="internalValue <= 30" />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

const props = defineProps<{
  label?: string
  modelValue: number
  step?: number
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const internalValue = ref(props.modelValue ?? 30)
const step = props.step ?? 10

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val
})

watch(internalValue, (val) => {
  if (val < 30) {
    internalValue.value = 30
    emit('update:modelValue', 30)
  } else {
    emit('update:modelValue', val)
  }
})
</script>