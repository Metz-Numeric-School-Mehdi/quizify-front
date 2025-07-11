<template>
  <div class="max-w-2xl mx-auto py-8">
    <div>
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col gap-6">
        <div class="flex items-start justify-between mb-2 gap-4">
          <div class="text-start flex-1">
            <h2 class="text-[2rem] font-bold mb-2 text-pink-600">
              {{ useQuiz.state.quiz?.title }}
            </h2>
            <div class="text-gray-600 mb-4">
              {{ useQuiz.state.quiz?.description }}
            </div>
          </div>
          <div v-if="useQuiz.state.quiz?.duration && !quizFinished" class="flex-shrink-0">
            <div class="relative w-14 h-14">
              <svg class="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#f3c6d4" stroke-width="6" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  :stroke="timer <= 10 ? '#ef4444' : '#ec4899'"
                  stroke-width="6"
                  :stroke-dasharray="2 * Math.PI * 24"
                  :stroke-dashoffset="
                    (1 - timer / (useQuiz.state.quiz?.duration || 1)) * 2 * Math.PI * 24
                  "
                  stroke-linecap="round"
                  class="transition-all duration-300"
                />
              </svg>
              <span
                class="absolute inset-0 flex items-center justify-center text-lg font-bold text-pink-700 select-none"
              >
                {{ formattedTime }}
              </span>
            </div>
          </div>
        </div>
        <template v-if="!quizFinished">
          <div>
            <div class="mb-4">
              <span class="font-bold">
                Question {{ activeQuestion }} / {{ useQuiz.state.quiz?.questions?.length }}
              </span>
            </div>
            <div class="mb-4">
              <label class="block font-semibold text-lg mb-2">
                {{ useQuiz.state.quiz?.questions?.[activeQuestion - 1]?.content }}
              </label>
            </div>
            <ul>
              <li
                v-for="(answer, idx) in useQuiz.state.quiz?.questions?.[activeQuestion - 1]
                  ?.answers"
                :key="idx"
              >
                <input
                  type="radio"
                  :id="`answer-${activeQuestion}-${idx}`"
                  :name="`question-${activeQuestion}`"
                  class="mr-2 accent-pink-500"
                  :value="answer.id"
                  v-model="selectedAnswer"
                />
                <label :for="`answer-${activeQuestion}-${idx}`" class="inline-block align-middle">
                  {{ answer.content }}
                </label>
              </li>
            </ul>
            <div class="flex justify-between mt-6">
              <div>
                <DefaultButton
                  v-if="activeQuestion > 1"
                  :ctaButton="false"
                  @click="previousQuestion()"
                >
                  Précédent
                </DefaultButton>
              </div>
              <div>
                <DefaultButton
                  v-if="activeQuestion < useQuiz.state.quiz.questions?.length"
                  :ctaButton="true"
                  @click="nextQuestion()"
                >
                  Suivant
                </DefaultButton>
                <DefaultButton v-else :ctaButton="true" @click="finishQuiz()">
                  Terminer
                </DefaultButton>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-start">
            <h3 class="text-xl font-bold mb-4 text-pink-600">
              {{ isPassed ? "Victoire 🎉" : "Échec 😢" }}
            </h3>
            <div class="text-lg mb-2">
              Score :
              <span class="font-bold"
                >{{ score }} / {{ useQuiz.state.quiz?.questions?.length }}</span
              >
              <br />
              Seuil de réussite : {{ useQuiz.state.quiz?.pass_score }}%
            </div>
            <div class="flex flex-col sm:flex-row gap-4 justify-start mt-6">
              <DefaultButton :ctaButton="true" @click="restartQuiz"> Recommencer </DefaultButton>
              <DefaultButton :ctaButton="false" @click="quitQuiz"> Quitter </DefaultButton>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="text-center py-10 text-red-500"></div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "~/components/interaction/buttons/DefaultButton.vue";

const config = useRuntimeConfig();
const useQuiz = useQuizStore();

const route = useRoute();

onMounted(async () => {
  await useQuiz.getOne(Number(route.params.id));
});

const quizId = Number(route.params.id);
const storageKey = `quiz-progress-${quizId}`;

const activeQuestion = ref(1);
const selectedAnswers = ref<{ [questionIndex: number]: number | null }>({});
const quizFinished = ref(false);
const score = ref(0);

const timer = ref(0);
const intervalId = ref<number | null>(null);

const formattedTime = computed(() => {
  const min = Math.floor(timer.value / 60);
  const sec = timer.value % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
});

function startTimer() {
  if (intervalId.value) clearInterval(intervalId.value);
  if (timer.value > 0 && !quizFinished.value) {
    intervalId.value = setInterval(() => {
      if (timer.value > 0) {
        timer.value--;
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            activeQuestion: activeQuestion.value,
            selectedAnswers: selectedAnswers.value,
          }),
        );
      }
      if (timer.value === 0 && !quizFinished.value) {
        clearInterval(intervalId.value!);
        quizFinished.value = true;
        finishQuiz();
      }
    }, 1000);
  }
}

onMounted(async () => {
  await useQuiz.getOne(quizId);

  timer.value = useQuiz.state.quiz?.duration || 0;

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const progress = JSON.parse(saved);
    activeQuestion.value = progress.activeQuestion || 1;
    selectedAnswers.value = progress.selectedAnswers || {};
  }

  if (!quizFinished.value) {
    startTimer();
  }
});

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});

watch(quizFinished, (finished) => {
  if (finished && intervalId.value) {
    clearInterval(intervalId.value);
  }
});

watch(
  [activeQuestion, selectedAnswers],
  () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeQuestion: activeQuestion.value,
        selectedAnswers: selectedAnswers.value,
      }),
    );
  },
  { deep: true },
);

const selectedAnswer = computed({
  get() {
    return selectedAnswers.value[activeQuestion.value] ?? null;
  },
  set(val) {
    selectedAnswers.value[activeQuestion.value] = val;
  },
});

const nextQuestion = () => {
  if (
    useQuiz.state.quiz &&
    Array.isArray(useQuiz.state.quiz.questions) &&
    activeQuestion.value < useQuiz.state.quiz.questions.length
  ) {
    activeQuestion.value++;
  }
};

const previousQuestion = () => {
  if (activeQuestion.value > 1) {
    activeQuestion.value--;
  }
};

const useAuth = authStore();
import { useRuntimeConfig } from "#app";

const finishQuiz = async () => {
  let correct = 0;
  const questions = useQuiz.state.quiz?.questions || [];
  questions.forEach((question, idx) => {
    const userAnswerId = selectedAnswers.value[idx + 1]; // activeQuestion commence à 1
    const correctAnswer = question.answers.find((a) => a.is_correct);
    if (correctAnswer && userAnswerId == correctAnswer.id) {
      correct++;
    }
  });
  score.value = correct;
  quizFinished.value = true;

  const quizId = useQuiz.state.quiz?.id;
  if (quizId && useAuth.state.token) {
    try {
      await useFetch(`/api/quizzes/${quizId}/attempt`, {
        baseURL: config.public.apiBase,
        method: "POST",
        headers: {
          Authorization: `Bearer ${useAuth.state.token}`,
          "Content-Type": "application/json",
        },
        body: {
          score: score.value,
          max_score: questions.length,
        },
      });
    } catch (e) {
      console.error("Erreur lors de l'enregistrement du score", e);
    }
  }
};

const restartQuiz = () => {
  quizFinished.value = false;
  score.value = 0;
  activeQuestion.value = 1;
  selectedAnswers.value = {};
  timer.value = useQuiz.state.quiz?.duration || 0;
  localStorage.removeItem(storageKey);
  startTimer();
};

const isPassed = computed(() => {
  const total = useQuiz.state.quiz?.questions?.length || 0;
  if (!total) return false;
  const percent = (score.value / total) * 100;
  return percent >= (useQuiz.state.quiz?.pass_score || 0);
});
import { useRouter } from "vue-router";
const router = useRouter();

const quitQuiz = () => {
  localStorage.removeItem(storageKey);
  quizFinished.value = false;
  score.value = 0;
  activeQuestion.value = 1;
  selectedAnswers.value = {};
  timer.value = useQuiz.state.quiz?.duration || 0;
  router.push("/");
};
</script>
