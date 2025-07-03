<template>
  <div class="max-w-2xl mx-auto py-8">
    <div>
      <h1 class="text-[2rem] font-[600] mb-6">{{ useQuiz.state.quiz?.title }}</h1>
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col gap-6">
        <div>
          <div class="mb-4">
            <span class="font-bold">
              Question {{ activeQuestion }} / {{ useQuiz.state.quiz?.questions?.length }}
            </span>
          </div>
          <div class="mb-4">
            <label class="block font-semibold text-lg mb-2">
              {{ useQuiz.state.quiz?.questions?.[activeQuestion]?.content }}
            </label>
          </div>
          <ul>
            <li
              v-for="(answer, idx) in useQuiz.state.quiz?.questions?.[activeQuestion]?.answers"
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
            <DefaultButton
              v-if="activeQuestion > 1"
              :ctaButton="false"
              @click="previousQuestion()"
            >
              Précédent
            </DefaultButton>
            <DefaultButton
              v-if="activeQuestion < useQuiz.state.quiz.questions?.length"
              :ctaButton="true"
              @click="nextQuestion()"
            >
              Suivant
            </DefaultButton>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center py-10 text-red-500"></div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from '~/components/interaction/buttons/DefaultButton.vue';

const useQuiz = useQuizStore();
const useQuestion = useQuestionStore();
const useAnswer = useAnswerStore();

const route = useRoute();

onMounted(async () => {
  await useQuiz.getOne(Number(route.params.id));
});

const activeQuestion = ref(1);
const selectedAnswer = ref(null);

const nextQuestion = () => {
  if (
    useQuiz.state.quiz &&
    Array.isArray(useQuiz.state.quiz.questions) &&
    activeQuestion.value < useQuiz.state.quiz.questions.length
  ) {
    activeQuestion.value++;
    selectedAnswer.value = null;
  }
};

const previousQuestion = () => {
  if (activeQuestion.value > 1) {
    activeQuestion.value--;
    selectedAnswer.value = null;
  }
};
</script>
