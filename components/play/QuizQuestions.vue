<template>
  <div>
    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
      <div
        class="bg-pink-500 h-full transition-all duration-300"
        :style="{ width: `${(activeQuestion / (questions?.length || 1)) * 100}%` }"
      ></div>
    </div>

    <div class="flex items-center justify-between mt-4">
      <span class="font-bold text-gray-700">
        Question {{ activeQuestion }} / {{ questions?.length }}
      </span>
      <span class="text-sm text-gray-500"> Seuil de réussite: {{ passScore }}% </span>
    </div>

    <div class="mt-2 mb-6">
      <label
        class="block font-semibold text-xl text-gray-800 mb-6 bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500"
      >
        {{ currentQuestion?.content }}
      </label>

      <ul class="space-y-3 mt-6">
        <li
          v-for="(answer, idx) in currentQuestion?.answers"
          :key="idx"
          class="transition-all duration-200"
        >
          <div
            class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-pink-50"
            :class="{ 'bg-pink-50 border-pink-300 shadow-sm': modelValue === answer.id }"
            @click="$emit('update:modelValue', answer.id)"
          >
            <input
              type="radio"
              :id="`answer-${activeQuestion}-${idx}`"
              :name="`question-${activeQuestion}`"
              class="mr-3 accent-pink-500 h-5 w-5"
              :value="answer.id"
              :checked="modelValue === answer.id"
              @change="$emit('update:modelValue', answer.id)"
            />
            <label
              :for="`answer-${activeQuestion}-${idx}`"
              class="flex-1 cursor-pointer font-medium text-gray-700"
            >
              {{ answer.content }}
            </label>
          </div>
        </li>
      </ul>

      <div class="flex justify-between mt-8">
        <div>
          <slot name="prev-button"></slot>
        </div>
        <div>
          <slot name="next-button"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/question/Question';

const { questions, activeQuestion, passScore, modelValue } = defineProps<{
  questions: Question[];
  activeQuestion: number;
  passScore: number;
  modelValue: number | null;
}>();

defineEmits(["update:modelValue"]);

const currentQuestion = computed(() => {
  if (questions && questions.length >= activeQuestion) {
    return questions[activeQuestion - 1];
  }
  return null;
});
</script>
