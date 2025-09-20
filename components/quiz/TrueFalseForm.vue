<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium">Réponse correcte</h4>
      <span class="text-xs text-gray-500">Sélectionnez la bonne réponse</span>
    </div>

    <div class="space-y-3">
      <div 
        v-for="(answer, index) in modelValue" 
        :key="index"
        class="flex items-center gap-3 p-3 border rounded-lg"
        :class="{ 'border-green-300 bg-green-50': answer.is_correct }"
      >
        <input 
          type="radio"
          :name="`true-false-${Math.random()}`"
          :checked="answer.is_correct"
          @change="setCorrectAnswer(index)"
          class="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
        />
        
        <span class="flex-1 font-medium">{{ answer.content }}</span>
        
        <Icon 
          v-if="answer.is_correct"
          name="Check"
          class="w-5 h-5 text-green-600"
        />
      </div>
    </div>

    <div v-if="!hasCorrectAnswer" class="text-sm text-red-500">
      Veuillez sélectionner la réponse correcte
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuestionFormAnswer } from '~/types/question/QuestionForm';

interface Props {
  modelValue: QuestionFormAnswer[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: QuestionFormAnswer[]]
}>();

const hasCorrectAnswer = computed(() => {
  return props.modelValue.some(answer => answer.is_correct);
});

const setCorrectAnswer = (index: number) => {
  const newAnswers = props.modelValue.map((answer, i) => ({
    ...answer,
    is_correct: i === index
  }));
  emit('update:modelValue', newAnswers);
};
</script>
