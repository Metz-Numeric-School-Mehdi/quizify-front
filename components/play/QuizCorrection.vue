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
          <ul class="space-y-3 mb-2">
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
</script>
