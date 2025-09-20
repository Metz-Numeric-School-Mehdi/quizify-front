<template>
  <button :class="buttonClass" @click="$emit('click')" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  ctaButton?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();

const buttonClass = computed(() =>
  props.ctaButton
    ? "flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-[length:120%_120%] bg-[position:0_0] hover:bg-[position:40%_0] transition-all duration-300 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-2xl animate-bounce-slow text-base sm:text-lg"
    : "flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white text-purple-600 font-bold rounded-full border border-purple-300 shadow hover:bg-purple-50 hover:scale-105 transition-all duration-300 text-base sm:text-lg"
);
</script>
