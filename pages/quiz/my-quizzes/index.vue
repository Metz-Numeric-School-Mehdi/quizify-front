<template>
  <div class="flex flex-col gap-4 relative">
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute w-32 h-32 bg-pink-200 opacity-30 rounded-full top-10 left-10 animate-pulse"
      ></div>
      <div
        class="absolute w-24 h-24 bg-blue-200 opacity-20 rounded-full bottom-20 right-20 animate-ping"
      ></div>
      <div
        class="absolute w-16 h-16 bg-yellow-200 opacity-20 rounded-full top-1/2 left-1/2 animate-bounce"
      ></div>
      <div
        class="absolute w-20 h-20 bg-purple-200 opacity-10 rounded-full bottom-10 left-1/3 animate-spin-slow"
      ></div>
    </div>
    <div class="flex justify-between items-center mb-4 z-10">
      <h1 class="text-[2rem] font-bold text-pink-600">
        Mes quiz
      </h1>
      <DefaultButton :ctaButton="true" @click="useQuiz.state.openModal = true">
        <span class="text-xl sm:text-2xl">
          <Icon name="Plus" :stroke-width="2.5" :size="20" />
        </span>
        <span class="hidden sm:inline">Créer un quiz</span>
        <span class="inline sm:hidden">Créer</span>
      </DefaultButton>
    </div>
    <div v-if="useQuiz.state.quizzes?.length === 0" class="text-center text-gray-500 mt-10">
      <div>Tu n’as pas encore créé de quiz.<br />Clique sur "Créer un quiz" pour commencer !</div>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-xl shadow divide-y divide-gray-200">
        <thead class="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Miniature</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Titre</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Durée</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Statut</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="quiz in useQuiz.state.quizzes"
            :key="quiz.id"
            class="hover:bg-pink-50 transition"
          >
            <td class="px-4 py-2">
              <img
                v-if="quiz.thumbnail_url"
                :src="quiz.thumbnail_url"
                alt="Miniature"
                class="w-14 h-14 object-cover rounded-lg border"
              />
              <div
                v-else
                class="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
              >
                <Icon name="Image" :size="24" />
              </div>
            </td>
            <td class="px-4 py-2 font-semibold text-pink-700">{{ quiz.title }}</td>
            <td class="px-4 py-2 text-gray-600">
              {{ quiz.description?.slice(0, 60)
              }}<span v-if="quiz.description && quiz.description.length > 60">…</span>
            </td>
            <td class="px-4 py-2 text-gray-600">{{ quiz.duration }}s</td>
            <td class="px-4 py-2">
              <span
                class="inline-block px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-700': quiz.status === 'published',
                  'bg-yellow-100 text-yellow-700': quiz.status === 'draft',
                  'bg-gray-200 text-gray-600': quiz.status === 'archived',
                }"
              >
                {{
                  quiz.status === "published"
                    ? "Publié"
                    : quiz.status === "draft"
                      ? "Brouillon"
                      : "Archivé"
                }}
              </span>
            </td>
            <td class="px-4 py-2">
              <DefaultButton size="icon" @click="editQuiz(quiz.id)">
                <Icon name="Pencil" :size="18" />
              </DefaultButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CreateQuizModal @close="useQuiz.state.openModal = false" />
  </div>
</template>

<script setup lang="ts">
import CreateQuizModal from "@/components/modals/quiz/CreateQuizModal.vue";
import { onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "~/stores/quizStore";
import DefaultButton from "@/components/interaction/buttons/DefaultButton.vue";

const useQuiz = useQuizStore();
const router = useRouter();

onMounted(async () => {
  useQuiz.state.isOwner = true;
  await nextTick();
  useQuiz.getAll();
});

onUnmounted(() => {
  useQuiz.state.isOwner = false;
});

function editQuiz(quizId: number) {
  router.push(`/quiz/edit/${quizId}`);
}
</script>
