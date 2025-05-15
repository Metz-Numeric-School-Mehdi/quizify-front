<template>
  <div v-if="useQuiz.state.openModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click.self="useQuiz.state.openModal = false">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-0 flex relative">
      <div class="flex flex-col w-40 bg-pink-50 rounded-l-xl py-8 px-2 border-r border-pink-100">
        <button v-for="(step, idx) in steps" :key="step" @click="currentStep = idx" :class="[
          'mb-2 px-3 py-2 rounded font-semibold text-left transition',
          currentStep === idx
            ? 'bg-pink-500 text-white shadow'
            : 'hover:bg-pink-100 text-pink-600',
        ]">
          {{ step }}
        </button>
      </div>
      <div class="flex-1 p-6">
        <button class="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl"
          @click="useQuiz.state.openModal = false" aria-label="Fermer">
          ×
        </button>
        <h2 class="text-2xl font-bold mb-4 text-center">Créer un quiz</h2>
        <form @submit.prevent="submit()">
          <div class="overflow-y-scroll max-h-[70vh]">
            <CreateQuizInformations :current-step="currentStep" />
            <CreateQuizSettings :current-step="currentStep" />
            <CreateQuizImage :current-step="currentStep" />
            <CreateQuizQuestionsModal :current-step="currentStep" />
          </div>
          <div class="flex justify-between mt-6">
            <button v-if="currentStep > 0" type="button" class="font-bold px-6 py-2 rounded-full transition"
              style="background: hsl(var(--muted)); color: hsl(var(--muted-foreground));" @click="currentStep--">
              Précédent
            </button>
            <div class="flex-1"></div>
            <button v-if="currentStep < steps.length - 1" type="button"
              class="font-bold px-6 py-2 rounded-full transition"
              style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground));" @click="currentStep++">
              Suivant
            </button>
            <button v-else type="submit" class="font-bold px-6 py-2 rounded-full transition"
              style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground));">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateQuizImage from './CreateQuizImage.vue';
import CreateQuizInformations from './CreateQuizInformations.vue';
import CreateQuizQuestionsModal from './CreateQuizQuestionsModal.vue';
import CreateQuizSettings from './CreateQuizSettings.vue';

const steps = ["Informations", "Paramètres", "Image", "Questions"];
const currentStep = ref<number>(0);

const useQuiz = quizStore();

const submit = async () => {
  await useQuiz.createQuiz(useQuiz.state.createQuizForm);
}

onMounted(() => {
  if (!useQuiz.state.createQuizForm) {
    console.log("Initialisation du formulaire...");
    useQuiz.state.createQuizForm = {
      title: "",
      description: "",
      level_id: "",
      category_id: "",
      is_public: false,
      status: "",
      duration: 0,
      max_attempts: 0,
      pass_score: 0,
      thumbnail: null,
      questions: [],
    };
  }
});
</script>
