<template>
  <div class="flex items-center space-x-2">
    <Switch :model-value="props.modelValue" @update:modelValue="onUpdate" id="airplane-mode" />
    <Label for="airplane-mode">{{ props.label }}</Label>
  </div>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const props = defineProps<{
  modelValue: boolean | null | undefined;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
}>();

function onUpdate(value: any) {
  emit("update:modelValue", value);
}
</script>
