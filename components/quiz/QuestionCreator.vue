<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Type de question</label>
      <Select v-model="selectedType" @update:model-value="(value: any) => onTypeChange(String(value || ''))">
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un type de question" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem 
            v-for="type in questionTypes" 
            :key="type.id" 
            :value="type.id.toString()"
          >
            {{ type.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="selectedType" class="space-y-4">
      <div>
        <label for="question-content" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Énoncé de la question</label>
        <Textarea
          id="question-content"
          v-model="questionContent"
          placeholder="Saisissez votre question..."
          class="mt-1"
          rows="3"
        />
      </div>

      <!-- Formulaire spécifique selon le type -->
      <MultipleChoiceForm 
        v-if="getQuestionTypeName() === 'Choix multiples'"
        v-model="answers"
        :multiple="true"
      />
      
      <MultipleChoiceForm 
        v-if="getQuestionTypeName() === 'Choix unique'"
        v-model="answers"
        :multiple="false"
      />
      
      <TrueFalseForm 
        v-if="getQuestionTypeName() === 'Vrai ou Faux'"
        v-model="answers"
      />
      
      <OrderingForm 
        v-if="getQuestionTypeName() === 'Remise dans l\'ordre'"
        v-model="answers"
      />

      <div class="flex gap-2 justify-end">
        <Button type="button" variant="outline" @click="resetForm">
          Annuler
        </Button>
        <Button type="button" @click="addQuestion" :disabled="!canAddQuestion">
          Ajouter la question
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQuestionTypeStore } from '~/stores/questionTypeStore';
import type { QuestionForm } from '~/types/question/QuestionForm';
import type { QuestionFormAnswer } from '~/types/question/QuestionForm';
import MultipleChoiceForm from './MultipleChoiceForm.vue';
import TrueFalseForm from './TrueFalseForm.vue';
import OrderingForm from './OrderingForm.vue';

const emit = defineEmits<{
  addQuestion: [question: QuestionForm]
}>();

const questionTypeStore = useQuestionTypeStore();

const selectedType = ref<string>('');
const questionContent = ref<string>('');
const answers = ref<QuestionFormAnswer[]>([]);

const questionTypes = computed(() => questionTypeStore.state.questionTypes || []);

const getQuestionTypeName = () => {
  if (!selectedType.value) return '';
  const type = questionTypes.value.find(t => t.id.toString() === selectedType.value);
  return type?.name || '';
};

const canAddQuestion = computed(() => {
  return questionContent.value.trim() !== '' && 
         answers.value.length >= 2 && 
         answers.value.some(a => a.is_correct);
});

const onTypeChange = (value: string) => {
  selectedType.value = value;
  resetAnswers();
};

const resetAnswers = () => {
  const typeName = getQuestionTypeName();
  
  if (typeName === 'Vrai ou Faux') {
    answers.value = [
      { content: 'Vrai', is_correct: false },
      { content: 'Faux', is_correct: false }
    ];
  } else if (typeName === 'Remise dans l\'ordre') {
    answers.value = [
      { content: '', is_correct: true, order_position: 1 },
      { content: '', is_correct: true, order_position: 2 }
    ];
  } else {
    answers.value = [
      { content: '', is_correct: false },
      { content: '', is_correct: false }
    ];
  }
};

const addQuestion = () => {
  if (!canAddQuestion.value) return;

  const question: QuestionForm = {
    content: questionContent.value.trim(),
    question_type_id: parseInt(selectedType.value),
    answers: [...answers.value]
  };

  emit('addQuestion', question);
  resetForm();
};

const resetForm = () => {
  selectedType.value = '';
  questionContent.value = '';
  answers.value = [];
};

onMounted(async () => {
  if (!questionTypes.value.length) {
    await questionTypeStore.getAll();
  }
});
</script>
