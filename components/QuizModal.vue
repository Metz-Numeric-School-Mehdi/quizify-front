<template>
  <div class="w-full">
    <Button @click="showModal = true" class="rounded-default w-full">Commencer le quiz</Button>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showModal = false">
      <div class="bg-white p-8 rounded-lg w-1/2 min-w-[350px] shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button @click="showModal = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold">&times;</button>
        <h2 class="text-3xl text-primary-linear font-bold mb-2">{{ quiz.title }}</h2>
        <p class="text-secondary-linear mb-4">{{ quiz.description }}</p>
        <img :src="quiz.thumbnail" alt="Image du quiz" class="w-full h-52 object-cover rounded-lg mb-4" />
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-1">
            <Icon class="text-primary-linear" name="Timer" :stroke-width="2" />
            <span class="text-sm">{{ quiz.duration }} min</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon class="text-primary-linear" name="Swords" :stroke-width="2" />
            <span class="text-sm capitalize">{{ quiz.level.name }}</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button @click="startQuiz"
            class="w-1/2 bg-primary-linear rounded-xl text-white font-semibold py-2 transition mb-2">
            Débuter le quiz
          </button>
          <button @click="showModal = false"
            class="w-1/2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-semibold py-2 transition mb-2">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Quiz } from '~/types/quiz/Quiz'

const props = defineProps<{ quiz: Quiz }>()

const showModal = ref(false)

const quizTitle = 'Titre du Quiz'
const quizDescription = 'Voici une description captivante de votre quiz. Préparez-vous à tester vos connaissances !'
const quizTime = 10
const quizDifficulty = 'moyen'

function startQuiz() {
  showModal.value = false
}
</script>
