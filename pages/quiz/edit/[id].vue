<template>
  <div class="max-w-3xl mx-auto py-8">
    <button
      @click="router.back()"
      class="flex items-center hover:underline gap-2 text-pink-500 hover:text-pink-700 font-medium mb-6 transition"
      type="button"
    >
      <Icon name="ArrowLeft" :size="20" :stroke-width="2.5" />
      Revenir en arrière
    </button>
    <div class="flex flex-row gap-4 mb-6">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value as 'info' | 'questions'"
        class="cursor-pointer py-2 px-6 rounded-lg font-semibold transition-all duration-150"
        :class="{
          'bg-pink-500 text-white shadow scale-105': activeTab === tab.value,
          'bg-white text-pink-500 border border-pink-200 hover:bg-pink-50': activeTab !== tab.value,
        }"
      >
        {{ tab.label }}
      </div>
    </div>
    <form v-if="!store.state.loading && store.state.quiz" class="flex flex-col gap-6">
      <div v-if="activeTab === 'info'">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h1 class="text-[2rem] font-bold text-pink-600 mb-6">
            {{ store.state.quiz?.title }}
          </h1>
          <QuizInfoEditor ref="infoEditorRef" />
        </div>
      </div>
      <div v-else-if="activeTab === 'questions'">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h1 class="text-[2rem] font-bold text-pink-600 mb-6">
            {{ store.state.quiz?.title }}
          </h1>
          <QuizQuestionsEditor />
        </div>
      </div>
      <div v-else-if="activeTab === 'answers'">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h1 class="text-[2rem] font-bold text-pink-600 mb-6">
            {{ store.state.quiz?.title }}
          </h1>
          <QuizAnswersEditor />
        </div>
      </div>
    </form>
    <div v-else class="text-center py-10">
      <Loading />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuizStore } from "~/stores/quizStore";
import QuizInfoEditor from "~/components/quiz/QuizInfoEditor.vue";
import Loading from "~/components/common/Loading.vue";

const route = useRoute();
const router = useRouter();
const store = useQuizStore();

const activeTab = ref<string>("info");

const tabs = [
  { value: "info", label: "Informations" },
  { value: "questions", label: "Questions" },
  { value: "answers", label: "Réponses" },
];

const infoEditorRef = ref<any>(null);

onMounted(async () => {
  await store.getOne(Number(route.params.id));
});
</script>
