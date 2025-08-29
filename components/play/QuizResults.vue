<template>
  <div class="flex flex-col w-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center"
            :class="isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
            <svg v-if="isPassed" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-2" :class="isPassed ? 'text-green-700' : 'text-red-700'">
              {{ isPassed ? "Bravo ! Quiz réussi 🎉" : "Quiz non réussi 😢" }}
            </h3>
            <p class="text-gray-600 mb-3">
              {{
                isPassed
                  ? "Félicitations ! Tu as réussi ce quiz avec succès."
                  : "Tu n'as pas atteint le seuil de réussite. Tu peux réessayer ou consulter la correction."
              }}
            </p>
            <div class="flex items-center gap-4">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-bold" :class="isPassed ? 'text-green-600' : 'text-red-600'">{{ result?.score
                  ?? score }}</span>
                <span class="text-xl text-gray-400">/</span>
                <span class="text-xl text-gray-700">{{ result?.total ?? totalQuestions }}</span>
              </div>
            </div>
            <div v-if="result?.percentage !== undefined" class="mt-2 text-gray-500">
              Pourcentage : <span class="font-semibold">{{ Math.round(result.percentage) }}%</span>
            </div>
            <div v-if="result?.points" class="mt-2">
              <div class="text-gray-700 font-semibold">Points totaux : <span class="text-pink-600">{{
                result.points.total_points }}</span></div>
              <ul class="text-sm text-gray-600 mt-1">
                <li>Points de base : {{ result.points.base_points }}</li>
                <li>Multiplicateur de niveau : x{{ result.points.level_multiplier }}</li>
                <li>Points de niveau : {{ result.points.level_points }}</li>
                <li>Bonus performance : {{ result.points.performance_bonus }}</li>
                <li>Bonus rapidité : {{ result.points.speed_bonus }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Statistiques</h3>
        <ul class="space-y-3">
          <li class="flex justify-between items-center">
            <span class="text-gray-600">Bonnes réponses :</span>
            <span class="font-semibold text-green-600">{{ result?.score ?? score }}</span>
          </li>
          <li class="flex justify-between items-center">
            <span class="text-gray-600">Mauvaises réponses :</span>
            <span class="font-semibold text-red-600">{{ (result?.total ?? totalQuestions) - (result?.score ?? score)
            }}</span>
          </li>
          <li class="flex justify-between items-center">
            <span class="text-gray-600">Pourcentage :</span>
            <span class="font-semibold" :class="isPassed ? 'text-green-600' : 'text-red-600'">
              {{ Math.round(result?.percentage ?? (score / (totalQuestions || 1)) * 100) }}%
            </span>
          </li>
          <li class="flex justify-between items-center" v-if="result?.points?.breakdown">
            <span class="text-gray-600">Temps passé :</span>
            <span class="font-semibold">{{ result.points.breakdown.time_spent }}s</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mb-8">
      <slot name="actions"></slot>
    </div>

    <slot name="correction"></slot>
  </div>
</template>

<script setup lang="ts">
import type { QuizSubmitResult } from '~/types/quiz/QuizSubmitResult';

const { score, totalQuestions, passScore, result } = defineProps<{
  score: number;
  totalQuestions: number;
  passScore: number;
  result?: QuizSubmitResult;
}>();

const isPassed = computed(() => {
  const percent = result?.percentage ?? ((score / (totalQuestions || 1)) * 100);
  return percent >= passScore;
});
</script>
