<template>
  <div v-if="currentStep === 1 && useQuiz.state.createQuizForm" class="px-2">
    <div class="mb-4 flex items-center gap-4">
      <label class="font-semibold">Public</label>
      <input type="checkbox" v-model="useQuiz.state.createQuizForm.is_public"
        class="h-5 w-5 text-pink-500 rounded focus:ring-pink-400" />
    </div>
    <div class="mb-4 flex gap-4">
      <div class="flex-1">
        <label class="block font-semibold mb-1">Statut</label>
        <select v-model="useQuiz.state.createQuizForm.status" required
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400">
          <option disabled value="">Sélectionner</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block font-semibold mb-1">Durée (minutes)</label>
        <input v-model.number="useQuiz.state.createQuizForm.max_attempts" type="number" min="1" required
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
      </div>
    </div>
    <div class="mb-4 flex gap-4">
      <div class="flex-1">
        <label class="block font-semibold mb-1">Tentatives max</label>
        <input v-model.number="useQuiz.state.createQuizForm.max_attempts" type="number" min="1" required
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
      </div>
      <div class="flex-1">
        <label class="block font-semibold mb-1">Score minimum (%)</label>
        <input v-model.number="useQuiz.state.createQuizForm.pass_score" type="number" min="0" max="100" required
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ currentStep: number }>()
const useQuiz = quizStore()
</script>
