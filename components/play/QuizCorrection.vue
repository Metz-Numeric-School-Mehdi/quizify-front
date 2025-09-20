<template>
  <div v-if="show" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="bg-gray-50 px-6 py-4 border-b border-gray-100">
      <h3 class="text-xl font-bold text-gray-800 flex gap-2 items-center">
        <Icon name="Clipboard" :stroke-width="2.5" :size="16" />
        Correction du quiz
      </h3>
    </div>

    <div class="p-6">
      <div
        v-for="(question, qIndex) in questions"
        :key="question.id"
        class="mb-8 last:mb-0 bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="rounded-full bg-pink-100 text-pink-700 w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0"
          >
            {{ qIndex + 1 }}
          </div>
          <h4 class="text-lg font-semibold text-gray-800">{{ question.content }}</h4>
        </div>

        <div class="ml-11">
          <div v-if="!userAnswers[qIndex + 1]" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 text-red-700">
              <Icon name="AlertTriangle" :stroke-width="2.5" :size="16" class="text-red-500" />
              <span class="font-medium">Aucune réponse fournie pour cette question</span>
            </div>
          </div>
          
          <!-- Pour les questions d'ordonnancement -->
          <div v-if="question.question_type_id === 4">
            <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center gap-2 text-blue-700 mb-2">
                <Icon name="List" :stroke-width="2.5" :size="16" class="text-blue-500" />
                <span class="font-medium">Question d'ordonnancement</span>
              </div>
              <div v-if="Array.isArray(userAnswers[qIndex + 1]) && userAnswers[qIndex + 1].length > 0">
                <p class="text-sm text-blue-600 mb-2"><strong>Votre ordre :</strong></p>
                <ol class="text-sm text-blue-700 space-y-1">
                  <li v-for="(answerId, index) in userAnswers[qIndex + 1]" :key="answerId">
                    {{ index + 1 }}. {{ question.answers.find(a => a.id === answerId)?.content }}
                  </li>
                </ol>
              </div>
            </div>
            
            <div class="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-2 text-green-700 mb-2">
                <Icon name="Check" :stroke-width="2.5" :size="16" class="text-green-500" />
                <span class="font-medium">Ordre correct :</span>
              </div>
              <ol class="text-sm text-green-700 space-y-1">
                <li v-for="answer in question.answers.sort((a, b) => (a.order_position || 0) - (b.order_position || 0))" :key="answer.id">
                  {{ answer.order_position }}. {{ answer.content }}
                </li>
              </ol>
            </div>
            
            <div class="p-3 rounded-lg" 
                 :class="isOrderingCorrect(question, userAnswers[qIndex + 1]) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <div class="flex items-center gap-2" 
                   :class="isOrderingCorrect(question, userAnswers[qIndex + 1]) ? 'text-green-700' : 'text-red-700'">
                <Icon :name="isOrderingCorrect(question, userAnswers[qIndex + 1]) ? 'Check' : 'X'" 
                      :stroke-width="2.5" :size="16" />
                <span class="font-medium">
                  {{ isOrderingCorrect(question, userAnswers[qIndex + 1]) ? 'Réponse correcte !' : 'Réponse incorrecte' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Pour les autres types de questions -->
          <ul v-else class="space-y-3 mb-2">
            <li
              v-for="answer in question.answers"
              :key="answer.id"
              class="p-4 rounded-lg flex items-center transition-all"
              :class="{
                'bg-green-50 border border-green-200': answer.is_correct,
                'bg-red-50 border border-red-200':
                  !answer.is_correct && userAnswers[qIndex + 1] === answer.id,
                'bg-white border border-gray-200':
                  !answer.is_correct && userAnswers[qIndex + 1] !== answer.id,
              }"
            >
              <div class="mr-3 flex-shrink-0">
                <div
                  v-if="answer.is_correct"
                  class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Icon class="text-green-600" name="Check" :stroke-width="2.5" :size="16" />
                </div>
                <div
                  v-else-if="userAnswers[qIndex + 1] === answer.id"
                  class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <Icon class="text-red-600" name="X" :stroke-width="2.5" :size="16" />
                </div>
                <div v-else class="w-6 h-6 rounded-full border border-gray-200"></div>
              </div>

              <div class="flex-1">
                <div
                  :class="{
                    'font-medium text-green-700': answer.is_correct,
                    'font-medium text-red-700':
                      !answer.is_correct && userAnswers[qIndex + 1] === answer.id,
                    'text-gray-700': !answer.is_correct && userAnswers[qIndex + 1] !== answer.id,
                  }"
                >
                  {{ answer.content }}
                </div>

                <div class="mt-1 text-sm">
                  <span
                    v-if="answer.is_correct"
                    class="text-green-600 font-medium flex gap-1 items-center"
                  >
                    <Icon class="text-green-600" name="Info" :stroke-width="2.5" :size="16" />
                    Bonne réponse
                  </span>
                  <span
                    v-if="userAnswers[qIndex + 1] === answer.id && !answer.is_correct"
                    class="text-red-600 font-medium flex gap-1 items-center"
                  >
                    <Icon class="text-red-600" name="Info" :stroke-width="2.5" :size="16" />
                    Ta réponse (incorrecte)
                  </span>
                  <span
                    v-if="userAnswers[qIndex + 1] === answer.id && answer.is_correct"
                    class="text-green-600 font-medium flex gap-1 items-center"
                  >
                    <Icon class="text-green-600" name="Info" :stroke-width="2.5" :size="16" />
                    Ta réponse (correcte)
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from "~/types/question/Question";

const { show, questions, userAnswers } = defineProps<{
  show: boolean;
  questions: Question[];
  userAnswers: Record<number, any>;
}>();

const isOrderingCorrect = (question: Question, userOrder: number[]) => {
  if (!Array.isArray(userOrder) || userOrder.length === 0) return false;
  
  const correctOrder = question.answers
    .sort((a, b) => (a.order_position || 0) - (b.order_position || 0))
    .map(a => a.id);
  
  return JSON.stringify(userOrder) === JSON.stringify(correctOrder);
};
</script>
