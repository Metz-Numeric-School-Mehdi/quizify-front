<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900">Questions de remise dans l'ordre</h2>
      <Button @click="showCreateForm = !showCreateForm" class="bg-pink-500 hover:bg-pink-600">
        <Icon name="Plus" class="w-4 h-4 mr-2" />
        Ajouter une question
      </Button>
    </div>

    <div v-if="showCreateForm" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 class="text-lg font-medium mb-4">Nouvelle question d'ordre</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Énoncé de la question</label>
          <Textarea
            v-model="newQuestion.content"
            placeholder="Ex: Remettez dans l'ordre chronologique les événements suivants..."
            rows="3"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Éléments à ordonner</label>
          <div class="space-y-3">
            <div 
              v-for="(answer, index) in newQuestion.answers" 
              :key="index"
              class="flex items-center gap-3 p-3 border rounded-lg bg-white"
            >
              <div class="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-pink-600">{{ answer.order_position }}</span>
              </div>
              
              <Input
                v-model="answer.content"
                placeholder="Saisissez un élément..."
                class="flex-1"
              />
              
              <div class="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="moveAnswerUp(index)"
                  :disabled="index === 0"
                >
                  <Icon name="ChevronUp" class="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="moveAnswerDown(index)"
                  :disabled="index === newQuestion.answers.length - 1"
                >
                  <Icon name="ChevronDown" class="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="removeAnswer(index)"
                :disabled="newQuestion.answers.length <= 2"
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
            :disabled="newQuestion.answers.length >= 6"
            class="w-full mt-3"
          >
            <Icon name="Plus" class="w-4 h-4 mr-2" />
            Ajouter un élément
          </Button>
        </div>

        <div class="flex gap-3 pt-4">
          <Button 
            @click="createOrderingQuestion"
            :disabled="!canCreateQuestion || isCreating"
            class="bg-pink-500 hover:bg-pink-600"
          >
            <Icon name="Check" class="w-4 h-4 mr-2" />
            Créer la question
          </Button>
          <Button variant="outline" @click="cancelCreate">
            Annuler
          </Button>
        </div>
      </div>
    </div>

    <div v-if="questions.length === 0 && !showCreateForm" class="text-center py-12 bg-gray-50 rounded-lg">
      <Icon name="FileQuestion" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune question créée</h3>
      <p class="text-gray-500 mb-4">Commencez par ajouter votre première question d'ordre.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(question, questionIndex) in questions" 
        :key="question.id"
        class="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Question {{ questionIndex + 1 }}
            </h3>
            <p class="text-gray-700">{{ question.content }}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="deleteQuestion(question.id)"
            class="text-red-500 hover:text-red-700"
          >
            <Icon name="Trash2" class="w-4 h-4" />
          </Button>
        </div>

        <div class="space-y-2">
          <h4 class="text-sm font-medium text-gray-700">Ordre correct :</h4>
          <div class="grid gap-2">
            <div 
              v-for="answer in question.answers.sort((a: Answer, b: Answer) => (a.order_position || 0) - (b.order_position || 0))" 
              :key="answer.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-pink-600">{{ answer.order_position }}</span>
              </div>
              <span class="text-gray-800">{{ answer.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '~/stores/quizStore';
import { useQuestionStore } from '~/stores/questionStore';
import type { Question } from '~/types/question/Question';
import type { Answer } from '~/types/answer/Answer';

const quizStore = useQuizStore();
const questionStore = useQuestionStore();

const showCreateForm = ref(false);
const isCreating = ref(false);

const newQuestion = ref({
  content: '',
  answers: [
    { content: '', order_position: 1 },
    { content: '', order_position: 2 }
  ]
});

const questions = computed(() => {
  return quizStore.state.quiz?.questions?.filter((q: Question) => q.question_type_id === 4) || [];
});

const canCreateQuestion = computed(() => {
  return newQuestion.value.content.trim() !== '' && 
         newQuestion.value.answers.every(a => a.content.trim() !== '') &&
         newQuestion.value.answers.length >= 2;
});

const addAnswer = () => {
  if (newQuestion.value.answers.length >= 6) return;
  
  newQuestion.value.answers.push({
    content: '',
    order_position: newQuestion.value.answers.length + 1
  });
};

const removeAnswer = (index: number) => {
  if (newQuestion.value.answers.length <= 2) return;
  
  newQuestion.value.answers.splice(index, 1);
  updatePositions();
};

const moveAnswerUp = (index: number) => {
  if (index === 0) return;
  
  const answers = [...newQuestion.value.answers];
  [answers[index], answers[index - 1]] = [answers[index - 1], answers[index]];
  newQuestion.value.answers = answers;
  updatePositions();
};

const moveAnswerDown = (index: number) => {
  if (index === newQuestion.value.answers.length - 1) return;
  
  const answers = [...newQuestion.value.answers];
  [answers[index], answers[index + 1]] = [answers[index + 1], answers[index]];
  newQuestion.value.answers = answers;
  updatePositions();
};

const updatePositions = () => {
  newQuestion.value.answers.forEach((answer, index) => {
    answer.order_position = index + 1;
  });
};

const createOrderingQuestion = async () => {
  if (!canCreateQuestion.value || !quizStore.state.quiz?.id) return;
  
  isCreating.value = true;
  
  try {
    await questionStore.createOrdering({
      quiz_id: quizStore.state.quiz.id,
      content: newQuestion.value.content,
      answers: newQuestion.value.answers.map(a => ({
        content: a.content,
        order_position: a.order_position
      }))
    });
    
    cancelCreate();
    await quizStore.getOne(quizStore.state.quiz.id);
  } catch (error) {
    console.error('Erreur lors de la création de la question:', error);
  } finally {
    isCreating.value = false;
  }
};

const deleteQuestion = async (questionId: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;
  
  try {
    await questionStore.remove(questionId);
    if (quizStore.state.quiz?.id) {
      await quizStore.getOne(quizStore.state.quiz.id);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

const cancelCreate = () => {
  showCreateForm.value = false;
  newQuestion.value = {
    content: '',
    answers: [
      { content: '', order_position: 1 },
      { content: '', order_position: 2 }
    ]
  };
};
</script>
