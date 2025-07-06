<template>
  <Select
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    @update:open="onOpen"
  >
    <SelectTrigger>
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="(val, index) in options" :key="index" :value="val.id">
        {{ val.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number | null;
  options: any[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "open"): void;
}>();

/* plus besoin de cette fonction, la logique est directement dans le template */

function onOpen(isOpen: boolean) {
  if (isOpen) emit("open");
}
</script>
