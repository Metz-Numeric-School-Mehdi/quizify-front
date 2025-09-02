<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium">Réponses possibles</h4>
      <span class="text-xs text-gray-500">
        {{ multiple ? 'Plusieurs réponses correctes possibles' : 'Une seule réponse correcte' }}
      </span>
    </div>

    <div class="space-y-3">
      <div 
        v-for="(answer, index) in modelValue" 
        :key="index"
        class="flex items-center gap-3 p-3 border rounded-lg"
      >
        <div class="flex-shrink-0">
          <Checkbox 
            v-if="multiple"
            :checked="answer.is_correct"
            @update:checked="(checked: boolean) => updateAnswer(index, 'is_correct', checked)"
          />
          <input 
            v-else
            type="radio"
            :name="`answer-${Math.random()}`"
            :checked="answer.is_correct"
            @change="setCorrectAnswer(index)"
            class="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
          />
        </div>
        
        <Input
          :value="answer.content"
          @input="(e: Event) => updateAnswer(index, 'content', (e.target as HTMLInputElement).value)"
          placeholder="Saisissez une réponse..."
          class="flex-1"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="removeAnswer(index)"
          :disabled="modelValue.length <= 2"
          class="text-red-500 hover:text-red-700"
        >
          <Icon name="X" class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <Button
      type="button"
      variant="outline"
      @click="addAnswer"
      :disabled="modelValue.length >= 6"
      class="w-full"
    >
      <Icon name="Plus" class="w-4 h-4 mr-2" />
      Ajouter une réponse
    </Button>

    <div v-if="!hasCorrectAnswer" class="text-sm text-red-500">
      Veuillez sélectionner au moins une réponse correcte
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuestionFormAnswer } from '~/types/question/QuestionForm';

interface Props {
  modelValue: QuestionFormAnswer[];
  multiple: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: QuestionFormAnswer[]]
}>();

const hasCorrectAnswer = computed(() => {
  return props.modelValue.some(answer => answer.is_correct);
});

const updateAnswer = (index: number, field: keyof QuestionFormAnswer, value: any) => {
  const newAnswers = [...props.modelValue];
  newAnswers[index] = { ...newAnswers[index], [field]: value };
  emit('update:modelValue', newAnswers);
};

const setCorrectAnswer = (index: number) => {
  const newAnswers = props.modelValue.map((answer, i) => ({
    ...answer,
    is_correct: i === index
  }));
  emit('update:modelValue', newAnswers);
};

const addAnswer = () => {
  if (props.modelValue.length >= 6) return;
  
  const newAnswers = [
    ...props.modelValue,
    { content: '', is_correct: false }
  ];
  emit('update:modelValue', newAnswers);
};

const removeAnswer = (index: number) => {
  if (props.modelValue.length <= 2) return;
  
  const newAnswers = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', newAnswers);
};
</script>
