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

      <div v-if="currentQuestion?.question_type_id === 4" class="mt-6">
        <p class="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
          <strong>Instructions :</strong> Cliquez sur les éléments dans l'ordre que vous pensez correct
        </p>
        
        <div class="space-y-2">
          <div
            v-for="(answer, idx) in shuffledAnswers"
            :key="answer.id"
            class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-300"
            :class="{ 
              'bg-blue-50 border-blue-300 shadow-sm': userOrder.includes(answer.id),
              'bg-green-50 border-green-300': userOrder.includes(answer.id)
            }"
            @click="handleOrderClick(answer.id)"
          >
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
                 :class="userOrder.includes(answer.id) ? 'bg-green-100' : 'bg-gray-100'">
              <span class="text-sm font-medium" 
                    :class="userOrder.includes(answer.id) ? 'text-green-600' : 'text-gray-600'">
                {{ userOrder.indexOf(answer.id) + 1 || '' }}
              </span>
            </div>
            <span class="flex-1 font-medium text-gray-700">{{ answer.content }}</span>
            <div v-if="userOrder.includes(answer.id)" class="flex-shrink-0 ml-3 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div v-if="userOrder.length > 0" class="mt-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-2"><strong>Votre ordre :</strong></p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(answerId, index) in userOrder" :key="answerId" 
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {{ index + 1 }}. {{ shuffledAnswers.find(a => a.id === answerId)?.content }}
            </span>
          </div>
          <button @click="resetOrder" 
                  class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
            Recommencer
          </button>
        </div>
      </div>

      <ul v-else class="space-y-3 mt-6">
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
import { ref, watch } from 'vue';
import type { Question } from '~/types/question/Question';

const { questions, activeQuestion, passScore, modelValue } = defineProps<{
  questions: Question[];
  activeQuestion: number;
  passScore: number;
  modelValue: number | number[] | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const currentQuestion = computed(() => {
  if (questions && questions.length >= activeQuestion) {
    return questions[activeQuestion - 1];
  }
  return null;
});

const userOrder = ref<number[]>([]);
const shuffledAnswersCache = ref<Map<number, any[]>>(new Map());

const shuffledAnswers = computed(() => {
  if (!currentQuestion.value?.answers || currentQuestion.value.question_type_id !== 4) return [];
  
  const questionId = currentQuestion.value.id;
  if (!shuffledAnswersCache.value.has(questionId)) {
    const shuffled = [...currentQuestion.value.answers].sort(() => Math.random() - 0.5);
    shuffledAnswersCache.value.set(questionId, shuffled);
  }
  
  return shuffledAnswersCache.value.get(questionId) || [];
});

const handleOrderClick = (answerId: number) => {
  const currentIndex = userOrder.value.indexOf(answerId);
  
  if (currentIndex !== -1) {
    userOrder.value.splice(currentIndex, 1);
  } else {
    userOrder.value.push(answerId);
  }
  
  emit('update:modelValue', userOrder.value);
};

const resetOrder = () => {
  userOrder.value = [];
  emit('update:modelValue', []);
};

watch(() => currentQuestion.value, (newQuestion) => {
  if (newQuestion?.question_type_id === 4) {
    userOrder.value = Array.isArray(modelValue) ? [...modelValue] : [];
    if (userOrder.value.length === 0) {
      emit('update:modelValue', []);
    }
  }
}, { immediate: true });

watch(() => modelValue, (newValue) => {
  if (currentQuestion.value?.question_type_id === 4 && Array.isArray(newValue)) {
    userOrder.value = [...newValue];
  }
});
</script>
