
<template>
  <div
    class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-gray-100"
  >
    <div class="text-start flex-1 w-full">
      <h2 class="text-2xl sm:text-[2rem] font-bold mb-3 text-pink-600 tracking-tight">
        {{ quiz?.title }}
      </h2>
      <div class="text-gray-600">
        {{ quiz?.description }}
      </div>
    </div>
    <div
      v-if="quiz?.duration && !quizFinished"
      class="flex-shrink-0 mt-4 sm:mt-0 self-end sm:self-auto"
    >
      <div
        class="relative w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-full p-1 shadow-md"
      >
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="#f3c6d4" stroke-width="4" />
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            :stroke="timer <= 10 ? '#ef4444' : '#ec4899'"
            stroke-width="4"
            :stroke-dasharray="2 * Math.PI * 24"
            :stroke-dashoffset="(1 - timer / durationInSeconds) * 2 * Math.PI * 24"
            stroke-linecap="round"
            class="transition-all duration-300"
          />
        </svg>
        <span
          class="absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-bold text-pink-700 select-none"
        >
          {{ formattedTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quiz } from "~/types/quiz/Quiz";

const { quiz, timer, quizFinished } = defineProps<{
  quiz?: Quiz | null;
  timer: number;
  quizFinished?: boolean;
}>();

const formattedTime = computed(() => {
  const min = Math.floor(timer / 60);
  const sec = timer % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
});

const durationInSeconds = computed(() => {
  return quiz?.duration ? quiz.duration * 60 : 1;
});
</script>
