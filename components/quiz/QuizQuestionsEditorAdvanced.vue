<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900">Questions du quiz</h2>
      <Button @click="showCreateForm = !showCreateForm" type="button" class="bg-pink-500 hover:bg-pink-600">
        <Icon name="Plus" class="w-4 h-4 mr-2" />
        Ajouter une question
      </Button>
    </div>

    <div v-if="showCreateForm" class="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 class="text-lg font-medium mb-4">Nouvelle question</h3>
      
      <div class="space-y-4">
        <!-- Sélection du type de question -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de question</label>
          <Select v-model="newQuestion.question_type_id" @update:modelValue="resetAnswers">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Sélectionnez un type" />
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

        <!-- Énoncé de la question -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Énoncé de la question</label>
          <Textarea
            v-model="newQuestion.content"
            placeholder="Saisissez votre question..."
            rows="3"
            class="w-full"
          />
        </div>

        <!-- Interface spécifique selon le type -->
        <div v-if="selectedQuestionType">
          <!-- Questions à choix multiples, choix unique, vrai/faux -->
          <div v-if="isChoiceType" class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">
              Réponses {{ selectedQuestionType.name === 'Choix unique' ? '(une seule correcte)' : selectedQuestionType.name === 'Choix multiples' ? '(plusieurs possibles)' : '' }}
            </label>
            
            <div 
              v-for="(answer, index) in newQuestion.answers" 
              :key="index"
              class="flex items-center gap-3 p-3 border rounded-lg bg-white"
            >
              <input
                :type="selectedQuestionType.name === 'Choix multiples' ? 'checkbox' : 'radio'"
                :name="'correct-' + index"
                v-model="answer.is_correct"
                :value="selectedQuestionType.name === 'Choix multiples' ? answer.is_correct : true"
                @change="handleCorrectChange(index, $event)"
                class="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
              />
              
              <Input
                v-model="answer.content"
                placeholder="Saisissez une réponse..."
                class="flex-1"
              />
              
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

            <Button
              type="button"
              variant="outline"
              @click="addAnswer"
              :disabled="newQuestion.answers.length >= 6"
              class="w-full mt-3"
            >
              <Icon name="Plus" class="w-4 h-4 mr-2" />
              Ajouter une réponse
            </Button>
          </div>

          <!-- Questions de remise dans l'ordre -->
          <div v-else-if="selectedQuestionType.name === 'Remise dans l\'ordre'" class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">Éléments à ordonner</label>
            
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

            <Button
              type="button"
              variant="outline"
              @click="addOrderingAnswer"
              :disabled="newQuestion.answers.length >= 6"
              class="w-full mt-3"
            >
              <Icon name="Plus" class="w-4 h-4 mr-2" />
              Ajouter un élément
            </Button>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <Button 
            @click="createQuestion"
            :disabled="!canCreateQuestion || isCreating"
            type="button"
            class="bg-pink-500 hover:bg-pink-600"
          >
            <Icon name="Check" class="w-4 h-4 mr-2" />
            Créer la question
          </Button>
          <Button variant="outline" @click="cancelCreate" type="button">
            Annuler
          </Button>
        </div>
      </div>
    </div>

    <!-- Liste des questions existantes -->
    <div v-if="questions.length === 0 && !showCreateForm" class="text-center py-12 bg-gray-50 rounded-lg">
      <Icon name="FileQuestion" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune question créée</h3>
      <p class="text-gray-500 mb-4">Commencez par ajouter votre première question.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(question, questionIndex) in questions" 
        :key="question.id"
        class="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-medium text-gray-900">
                Question {{ questionIndex + 1 }}
              </h3>
            </div>
            <div v-if="editingQuestion === question.id && question.question_type_id === 4">
              <Textarea
                v-model="editingQuestionContent"
                placeholder="Modifiez votre question..."
                rows="2"
                class="w-full mb-2"
              />
            </div>
            <div v-else>
              <p class="text-gray-700">{{ question.content }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <!-- Boutons d'édition uniquement pour les questions d'ordonnancement (type 4) -->
            <template v-if="question.question_type_id === 4">
              <Button
                v-if="editingQuestion === question.id"
                variant="ghost"
                size="sm"
                @click="saveQuestionEdit(question)"
                type="button"
                class="text-green-500 hover:text-green-700"
              >
                <Icon name="Check" class="w-4 h-4" />
              </Button>
              <Button
                v-if="editingQuestion === question.id"
                variant="ghost"
                size="sm"
                @click="cancelQuestionEdit"
                type="button"
                class="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" class="w-4 h-4" />
              </Button>
              <Button
                v-if="editingQuestion !== question.id"
                variant="ghost"
                size="sm"
                @click="startQuestionEdit(question)"
                type="button"
                class="text-blue-500 hover:text-blue-700"
              >
                <Icon name="Edit" class="w-4 h-4" />
              </Button>
            </template>
            <!-- Bouton de suppression pour toutes les questions -->
            <Button
              variant="ghost"
              size="sm"
              @click="deleteQuestion(question.id)"
              type="button"
              class="text-red-500 hover:text-red-700"
            >
              <Icon name="Trash2" class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Affichage des réponses selon le type -->
        <div v-if="question.answers && question.answers.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-700">Réponses :</h4>
          
          <!-- Pour les questions d'ordre -->
          <div v-if="question.question_type?.name === 'Remise dans l\'ordre'" class="grid gap-2">
            <div 
              v-for="answer in question.answers.sort((a, b) => (a.order_position || 0) - (b.order_position || 0))" 
              :key="answer.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-pink-600">{{ answer.order_position }}</span>
              </div>
              <span class="text-gray-800">{{ answer.content }}</span>
            </div>
          </div>
          
          <!-- Pour les autres types de questions -->
          <div v-else class="grid gap-2">
            <div 
              v-for="answer in question.answers" 
              :key="answer.id"
              class="flex items-center gap-3 p-3 rounded-lg"
              :class="answer.is_correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50'"
            >
              <Icon 
                :name="answer.is_correct ? 'CheckCircle' : 'Circle'" 
                class="w-5 h-5"
                :class="answer.is_correct ? 'text-green-600' : 'text-gray-400'"
              />
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
import { useQuestionTypeStore } from '~/stores/questionTypeStore';
import type { Question } from '~/types/question/Question';
import type { QuestionType } from '~/types/questionType/QuestionType';

const quizStore = useQuizStore();
const questionStore = useQuestionStore();
const questionTypeStore = useQuestionTypeStore();

const showCreateForm = ref(false);
const isCreating = ref(false);
const editingQuestion = ref<number | null>(null);
const editingQuestionContent = ref('');

const newQuestion = ref({
  content: '',
  question_type_id: '',
  answers: [] as Array<{
    content: string;
    is_correct: boolean;
    order_position?: number;
  }>
});

const questions = computed(() => {
  return quizStore.state.quiz?.questions || [];
});

const questionTypes = computed(() => {
  return questionTypeStore.state.questionTypes || [];
});

const selectedQuestionType = computed(() => {
  if (!newQuestion.value.question_type_id) return null;
  return questionTypes.value.find(t => t.id === Number(newQuestion.value.question_type_id));
});

const isChoiceType = computed(() => {
  if (!selectedQuestionType.value) return false;
  const name = selectedQuestionType.value.name;
  return name === 'Choix multiples' || name === 'Choix unique' || name === 'Vrai/Faux';
});

const canCreateQuestion = computed(() => {
  return newQuestion.value.content.trim() !== '' && 
         newQuestion.value.question_type_id !== '' &&
         newQuestion.value.answers.length >= 2 &&
         newQuestion.value.answers.every(a => a.content.trim() !== '') &&
         (isChoiceType.value ? newQuestion.value.answers.some(a => a.is_correct) : true);
});

// Charger les types de questions au montage
onMounted(async () => {
  if (!questionTypes.value.length) {
    await questionTypeStore.getAll();
  }
});

const resetAnswers = () => {
  if (selectedQuestionType.value?.name === 'Remise dans l\'ordre') {
    newQuestion.value.answers = [
      { content: '', is_correct: true, order_position: 1 },
      { content: '', is_correct: true, order_position: 2 }
    ];
  } else if (selectedQuestionType.value?.name === 'Vrai/Faux') {
    newQuestion.value.answers = [
      { content: 'Vrai', is_correct: false },
      { content: 'Faux', is_correct: false }
    ];
  } else {
    newQuestion.value.answers = [
      { content: '', is_correct: false },
      { content: '', is_correct: false }
    ];
  }
};

const addAnswer = () => {
  if (newQuestion.value.answers.length >= 6) return;
  newQuestion.value.answers.push({
    content: '',
    is_correct: false
  });
};

const addOrderingAnswer = () => {
  if (newQuestion.value.answers.length >= 6) return;
  newQuestion.value.answers.push({
    content: '',
    is_correct: true,
    order_position: newQuestion.value.answers.length + 1
  });
};

const removeAnswer = (index: number) => {
  if (newQuestion.value.answers.length <= 2) return;
  newQuestion.value.answers.splice(index, 1);
  
  if (selectedQuestionType.value?.name === 'Remise dans l\'ordre') {
    updatePositions();
  }
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

const handleCorrectChange = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  
  if (selectedQuestionType.value?.name === 'Choix unique' || selectedQuestionType.value?.name === 'Vrai/Faux') {
    // Pour choix unique, décocher les autres
    newQuestion.value.answers.forEach((answer, i) => {
      answer.is_correct = i === index && target.checked;
    });
  } else {
    // Pour choix multiples
    newQuestion.value.answers[index].is_correct = target.checked;
  }
};

const createQuestion = async () => {
  if (!canCreateQuestion.value || !quizStore.state.quiz?.id) return;
  
  isCreating.value = true;
  
  try {
    if (selectedQuestionType.value?.name === 'Remise dans l\'ordre') {
      await questionStore.createOrdering({
        quiz_id: quizStore.state.quiz.id,
        content: newQuestion.value.content,
        answers: newQuestion.value.answers.map(a => ({
          content: a.content,
          order_position: a.order_position!
        }))
      });
    } else {
      // Créer la question d'abord
      const question = await questionStore.create({
        quiz_id: quizStore.state.quiz.id,
        content: newQuestion.value.content,
        question_type_id: Number(newQuestion.value.question_type_id)
      }) as any;
      
      if (question && question.id) {
        // Puis créer les réponses
        const { useAnswerStore } = await import('~/stores/answerStore');
        const answerStore = useAnswerStore();
        
        await answerStore.createBulk({
          question_id: question.id,
          answers: newQuestion.value.answers.map(a => ({
            content: a.content,
            is_correct: a.is_correct
          }))
        });
      }
    }
    
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
    question_type_id: '',
    answers: []
  };
};

// Fonctions d'édition pour les questions d'ordonnancement
const startQuestionEdit = (question: any) => {
  // Vérifier que c'est bien une question d'ordonnancement (type 4)
  if (question.question_type_id !== 4) {
    console.warn('Seules les questions d\'ordonnancement peuvent être éditées');
    return;
  }
  editingQuestion.value = question.id;
  editingQuestionContent.value = question.content;
};

const saveQuestionEdit = async (question: any) => {
  if (!editingQuestionContent.value.trim()) return;
  
  // Vérifier que c'est bien une question d'ordonnancement (type 4)
  if (question.question_type_id !== 4) {
    console.warn('Seules les questions d\'ordonnancement peuvent être éditées');
    return;
  }
  
  try {
    await questionStore.update({
      content: editingQuestionContent.value.trim(),
      question_type_id: question.question_type_id,
      quiz_id: question.quiz_id
    }, question.id);
    editingQuestion.value = null;
    editingQuestionContent.value = '';
    // Actualiser le quiz pour refléter les changements
    await quizStore.getOne(question.quiz_id);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la question:', error);
  }
};

const cancelQuestionEdit = () => {
  editingQuestion.value = null;
  editingQuestionContent.value = '';
};
</script>
