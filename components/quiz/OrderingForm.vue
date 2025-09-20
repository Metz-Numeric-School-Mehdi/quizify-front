<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium">Éléments à remettre dans l'ordre</h4>
      <span class="text-xs text-gray-500">Ordre correct (1 = premier)</span>
    </div>

    <div class="space-y-3">
      <div 
        v-for="(answer, index) in modelValue" 
        :key="index"
        class="flex items-center gap-3 p-3 border rounded-lg"
      >
        <div class="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-pink-600">{{ answer.order_position }}</span>
        </div>
        
        <Input
          :value="answer.content"
          @input="(e: Event) => updateAnswer(index, 'content', (e.target as HTMLInputElement).value)"
          placeholder="Saisissez un élément..."
          class="flex-1"
        />
        
        <div class="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="moveUp(index)"
            :disabled="index === 0"
            title="Monter"
          >
            <Icon name="ChevronUp" class="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="moveDown(index)"
            :disabled="index === modelValue.length - 1"
            title="Descendre"
          >
            <Icon name="ChevronDown" class="w-4 h-4" />
          </Button>
        </div>
        
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
      Ajouter un élément
    </Button>

    <div v-if="!allElementsFilled" class="text-sm text-red-500">
      Veuillez remplir tous les éléments
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

const allElementsFilled = computed(() => {
  return props.modelValue.every(answer => answer.content.trim() !== '');
});

const updateAnswer = (index: number, field: keyof QuestionFormAnswer, value: any) => {
  const newAnswers = [...props.modelValue];
  newAnswers[index] = { ...newAnswers[index], [field]: value };
  emit('update:modelValue', newAnswers);
};

const addAnswer = () => {
  if (props.modelValue.length >= 6) return;
  
  const newAnswers = [
    ...props.modelValue,
    { 
      content: '', 
      is_correct: true, 
      order_position: props.modelValue.length + 1 
    }
  ];
  emit('update:modelValue', newAnswers);
};

const removeAnswer = (index: number) => {
  if (props.modelValue.length <= 2) return;
  
  const newAnswers = props.modelValue
    .filter((_, i) => i !== index)
    .map((answer, i) => ({
      ...answer,
      order_position: i + 1
    }));
  
  emit('update:modelValue', newAnswers);
};

const moveUp = (index: number) => {
  if (index === 0) return;
  
  const newAnswers = [...props.modelValue];
  [newAnswers[index], newAnswers[index - 1]] = [newAnswers[index - 1], newAnswers[index]];
  
  // Mettre à jour les positions
  newAnswers.forEach((answer, i) => {
    answer.order_position = i + 1;
  });
  
  emit('update:modelValue', newAnswers);
};

const moveDown = (index: number) => {
  if (index === props.modelValue.length - 1) return;
  
  const newAnswers = [...props.modelValue];
  [newAnswers[index], newAnswers[index + 1]] = [newAnswers[index + 1], newAnswers[index]];
  
  // Mettre à jour les positions
  newAnswers.forEach((answer, i) => {
    answer.order_position = i + 1;
  });
  
  emit('update:modelValue', newAnswers);
};
</script>
