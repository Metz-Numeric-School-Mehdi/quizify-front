<template>
  <div v-if="useQuiz.state.openModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 md:px-0"
    @click.self="useQuiz.state.openModal = false">
    <div
      class="relative w-full max-w-[95vw] sm:max-w-lg md:max-w-3xl h-full max-h-[95vh] flex items-center justify-center">
      <div
        class="bg-white rounded-xl shadow-2xl w-full flex flex-col md:flex-row relative h-full max-h-[95vh] md:h-[600px] md:max-h-[600px] overflow-hidden">
        <button class="absolute z-20 top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-pink-500 text-2xl"
          @click="useQuiz.state.openModal = false" aria-label="Fermer">
          ×
        </button>
        <div
          class="flex flex-row md:flex-col w-full md:w-40 bg-pink-50 rounded-t-xl md:rounded-l-xl md:rounded-tr-none py-2 md:py-8 px-2 border-b md:border-b-0 md:border-r border-pink-100 overflow-x-auto md:overflow-x-visible md:overflow-y-auto max-h-16 md:max-h-full">
          <button v-for="(step, idx) in steps" :key="step" @click="currentStep = idx" :class="[
            'mb-0 md:mb-2 mr-2 md:mr-0 px-3 py-2 rounded font-semibold text-left transition whitespace-nowrap',
            currentStep === idx
              ? 'bg-pink-500 text-white shadow'
              : 'hover:bg-pink-100 text-pink-600',
          ]">
            {{ step }}
          </button>
        </div>
        <div class="flex-1 p-2 sm:p-4 md:p-6 flex flex-col h-full min-w-0">
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-4 text-center">Créer un quiz</h2>
          <form @submit.prevent="submit()" class="flex flex-col h-full">
            <div class="overflow-y-auto flex-1 min-h-0">
              <CreateQuizInformations :current-step="currentStep" />
              <CreateQuizSettings :current-step="currentStep" />
              <CreateQuizImage :current-step="currentStep" />
              <CreateQuizQuestionsModal :current-step="currentStep" />
            </div>
            <div class="flex justify-between mt-4 md:mt-6">
              <button v-if="currentStep > 0" type="button" class="font-bold px-4 sm:px-6 py-2 rounded-full transition"
                style="background: hsl(var(--muted)); color: hsl(var(--muted-foreground));" @click="currentStep--">
                Précédent
              </button>
              <div class="flex-1"></div>
              <button v-if="currentStep < steps.length - 1" type="button"
                class="font-bold px-4 sm:px-6 py-2 rounded-full transition"
                style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground));" @click="currentStep++">
                Suivant
              </button>
              <button v-else type="submit" class="font-bold px-4 sm:px-6 py-2 rounded-full transition"
                style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground));">
                Créer
              </button>
            </div>
          </form>
        </div>
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

const defaultAnswers = () => [
  { content: '', is_correct: false },
  { content: '', is_correct: false },
  { content: '', is_correct: false },
  { content: '', is_correct: false },
];

const defaultQuestions = () => [
  { content: '', question_type_id: '', answers: defaultAnswers() },
  { content: '', question_type_id: '', answers: defaultAnswers() },
];

const submit = async () => {
  await useQuiz.createQuiz(useQuiz.state.createQuizForm);
  useQuiz.state.openModal = false;
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
    questions: defaultQuestions(),
  };
  currentStep.value = 0;
  await useQuiz.getAllQuiz();
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
      questions: defaultQuestions(),
    };
  }
});

watch(() => useQuiz.state.openModal, (open) => {
  if (open) {
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
      questions: defaultQuestions(),
    };
    currentStep.value = 0;
  }
});
</script>
