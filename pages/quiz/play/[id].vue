<template>
  <AlertDialog :open="showExitConfirmation" @update:open="showExitConfirmation = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Quitter le quiz ?</AlertDialogTitle>
        <AlertDialogDescription>
          Votre progression sera perdue. Êtes-vous sûr de vouloir quitter ce quiz ?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="cancelNavigation">Annuler</AlertDialogCancel>
        <AlertDialogAction @click="confirmNavigation">Quitter</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <div class="max-w-4xl mx-auto py-8 px-4">
    <button @click="router.back()"
      class="flex items-center hover:underline gap-2 text-pink-500 hover:text-pink-700 font-medium mb-6 transition"
      type="button">
      <Icon name="ArrowLeft" :size="20" :stroke-width="2.5" />
      Revenir en arrière
    </button>
    <div class="relative">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-xl"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-xl"></div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col gap-6 relative z-10">
        <QuizHeader :quiz="useQuiz.state.quiz" :timer="timer" :quizFinished="quizFinished" />

        <template v-if="!quizFinished">
          <QuizQuestions :questions="useQuiz.state.quiz?.questions ?? []" :active-question="activeQuestion"
            :pass-score="useQuiz.state.quiz?.pass_score ?? 0" v-model="selectedAnswer">
            <template #prev-button>
              <DefaultButton v-if="activeQuestion > 1" :ctaButton="false" @click="previousQuestion()"
                class="px-6 py-2.5 font-medium flex items-center gap-2">
                <Icon name="ChevronLeft" :stroke-width="2.5" :size="16" />
                Précédent
              </DefaultButton>
            </template>
            <template #next-button>
              <DefaultButton v-if="activeQuestion < (useQuiz.state.quiz?.questions?.length ?? 0)" :ctaButton="true"
                @click="nextQuestion()" class="px-6 py-2.5 font-medium flex items-center gap-2">
                Suivant
                <Icon name="ChevronRight" :stroke-width="2.5" :size="16" />
              </DefaultButton>
              <DefaultButton v-else :ctaButton="true" @click="finishQuiz()"
                class="px-6 py-2.5 font-medium flex items-center gap-2">
                Terminer
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </DefaultButton>
            </template>
          </QuizQuestions>
        </template>

        <template v-else>
          <QuizResults :result="quizResult" :score="score" :total-questions="useQuiz.state.quiz?.questions?.length || 0"
            :pass-score="useQuiz.state.quiz?.pass_score || 0">
            <template #actions>
              <DefaultButton :ctaButton="true" @click="restartQuiz" class="py-3 px-6 max-md:w-full font-medium">
                <Icon name="RefreshCcw" :stroke-width="2.5" :size="16" />
                Recommencer
              </DefaultButton>
              <DefaultButton :ctaButton="false" @click="showCorrection = !showCorrection"
                class="py-3 max-md:w-full px-6 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {{ showCorrection ? "Masquer la correction" : "Afficher la correction" }}
              </DefaultButton>
              <DefaultButton :ctaButton="false" @click="directExit" class="py-3 max-md:w-full px-6 font-medium">
                <Icon name="LogOut" :stroke-width="2.5" :size="16" />
                Quitter
              </DefaultButton>
            </template>
            <template #correction>
              <QuizCorrection :show="showCorrection" :questions="useQuiz.state.quiz?.questions ?? []"
                :user-answers="selectedAnswers" />
            </template>
          </QuizResults />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "~/components/interaction/buttons/DefaultButton.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QuizHeader from "~/components/play/QuizHeader.vue";
import QuizQuestions from "~/components/play/QuizQuestions.vue";
import QuizResults from "~/components/play/QuizResults.vue";
import QuizCorrection from "~/components/play/QuizCorrection.vue";

const config = useRuntimeConfig();
const useQuiz = useQuizStore();

const route = useRoute();
const router = useRouter();

const quizResult = ref<QuizSubmitResult>();

onMounted(async () => {
  await useQuiz.getOne(Number(route.params.id));
});

const quizId = Number(route.params.id);
const storageKey = `quiz-progress-${quizId}`;

const activeQuestion = ref(1);
const selectedAnswers = ref<{ [questionIndex: number]: number | number[] | null }>({});
const quizFinished = ref(false);
const score = ref(0);
const showCorrection = ref(false);

const timer = ref(0);
const intervalId = ref<number | null>(null);
const showExitConfirmation = ref(false);
const pendingNavigation = ref<string | null>(null);

const startTimer = () => {
  if (intervalId.value) clearInterval(intervalId.value);
  if (timer.value > 0 && !quizFinished.value) {
    intervalId.value = setInterval(() => {
      if (timer.value > 0) {
        timer.value--;
      }
      if (timer.value === 0 && !quizFinished.value) {
        clearInterval(intervalId.value!);
        quizFinished.value = true;
        finishQuiz();
      }
    }, 1000);
  }
};

onMounted(async () => {
  await useQuiz.getOne(quizId);

  timer.value = (useQuiz.state.quiz?.duration || 0) * 60;

  window.addEventListener("beforeunload", handleBeforeUnload);
  if (!quizFinished.value) {
    startTimer();
  }
});

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value);
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

watch(quizFinished, (finished) => {
  if (finished && intervalId.value) {
    clearInterval(intervalId.value);
  }
});

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
import type { QuizSubmitResult } from "~/types/quiz/QuizSubmitResult";
import { onMounted } from "vue";

const finishQuiz = async () => {
  let correct = 0;
  const questions = useQuiz.state.quiz?.questions || [];
  let responses: any[] = [];

  questions.forEach((question: any, idx: number) => {
    const userAnswer = selectedAnswers.value[idx + 1];

    if (question.question_type_id === 4) {
      const orderArray = Array.isArray(userAnswer) ? userAnswer : [];
      if (orderArray.length > 0) {
        responses.push({
          question_id: question.id,
          user_answer: JSON.stringify(orderArray),
        });
      }
    } else {
      if (userAnswer !== null && userAnswer !== undefined) {
        responses.push({
          question_id: question.id,
          answer_id: userAnswer,
        });
      }
    }
  });

  questions.forEach((question: any, idx: number) => {
    const userAnswer = selectedAnswers.value[idx + 1];

    if (question.question_type_id === 4) {
      if (Array.isArray(userAnswer) && userAnswer.length > 0) {
        const correctOrder = question.answers
          .sort((a: any, b: any) => (a.order_position || 0) - (b.order_position || 0))
          .map((a: any) => a.id);

        if (JSON.stringify(userAnswer) === JSON.stringify(correctOrder)) {
          correct++;
        }
      }
    } else {
      const correctAnswer = question.answers.find((a: any) => a.is_correct);
      if (correctAnswer && userAnswer == correctAnswer.id) {
        correct++;
      }
    }
  });
  score.value = correct;
  quizFinished.value = true;

  const duration = (useQuiz.state.quiz?.duration || 0) * 60;
  const time_spent = duration - timer.value;

  const quizId = useQuiz.state.quiz?.id;
  if (quizId && useAuth.state.token) {
    try {
      const { data } = await useFetch<QuizSubmitResult>(`/api/quizzes/${quizId}/submit`, {
        baseURL: config.public.apiBase,
        method: "POST",
        headers: {
          Authorization: `Bearer ${useAuth.state.token}`,
          "Content-Type": "application/json",
        },
        body: {
          responses,
          time_spent,
        },
      });

      if (data.value) quizResult.value = data.value;
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
  timer.value = (useQuiz.state.quiz?.duration || 0) * 60;
  startTimer();
};

const directExit = () => {
  isNavigationConfirmed.value = true;
  router.push("/");
};

const confirmNavigation = () => {
  const destination = pendingNavigation.value;
  showExitConfirmation.value = false;
  pendingNavigation.value = null;
  isNavigationConfirmed.value = true;
  setTimeout(() => {
    if (destination) {
      router.push(destination);
    }
  }, 0);
};

const cancelNavigation = () => {
  showExitConfirmation.value = false;
  pendingNavigation.value = null;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!quizFinished.value) {
    event.preventDefault();
    event.returnValue = "";
    return "";
  }
};

const isNavigationConfirmed = ref(false);

router.beforeEach((to, from, next) => {
  if (isNavigationConfirmed.value) {
    isNavigationConfirmed.value = false;
    next();
    return;
  }
  if (
    showExitConfirmation.value ||
    quizFinished.value ||
    to.path.includes(`/quiz/play/${quizId}`)
  ) {
    next();
    return;
  }

  showExitConfirmation.value = true;
  pendingNavigation.value = to.fullPath;

  next(false);
});
</script>
