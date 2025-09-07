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
      <h1 class="text-[2rem] font-bold text-pink-600">Mes quiz</h1>
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
    <div v-else class="overflow-x-auto hidden md:block">
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
            <td class="px-4 py-2 text-gray-600">{{ quiz.duration }} min</td>
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
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" size="icon">
                    <Icon name="MoreHorizontal" :size="18" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-48">
                  <DropdownMenuItem @click="editQuiz(quiz.id)">
                    <Icon name="Pencil" class="mr-2 h-4 w-4" />
                    <span>Modifier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="confirmDeleteQuiz(quiz)" class="text-red-600 hover:text-red-700">
                    <Icon name="Trash2" class="mr-2 h-4 w-4" />
                    <span>Supprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Cards mobile -->
  <div v-if="Array.isArray(useQuiz.state.quizzes) && useQuiz.state.quizzes.length > 0" class="block md:hidden">
      <div class="flex flex-col gap-4">
        <div v-for="quiz in useQuiz.state.quizzes" :key="quiz.id" class="bg-white rounded-xl shadow p-4 border border-gray-100 flex gap-3 items-center">
          <div>
            <img v-if="quiz.thumbnail_url" :src="quiz.thumbnail_url" alt="Miniature" class="w-16 h-16 object-cover rounded-lg border" />
            <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <Icon name="Image" :size="24" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-pink-700 text-base truncate">{{ quiz.title }}</div>
            <div class="text-gray-600 text-sm truncate">{{ quiz.description?.slice(0, 40) }}<span v-if="quiz.description && quiz.description.length > 40">…</span></div>
            <div class="text-xs text-gray-500 mt-1">{{ quiz.duration }} min</div>
            <span class="inline-block px-2 py-1 rounded text-xs font-semibold mt-1"
              :class="{
                'bg-green-100 text-green-700': quiz.status === 'published',
                'bg-yellow-100 text-yellow-700': quiz.status === 'draft',
                'bg-gray-200 text-gray-600': quiz.status === 'archived',
              }"
            >
              {{ quiz.status === "published" ? "Publié" : quiz.status === "draft" ? "Brouillon" : "Archivé" }}
            </span>
          </div>
          <div class="flex flex-col gap-2">
            <Button variant="outline" size="icon" @click="editQuiz(quiz.id)">
              <Icon name="Pencil" :size="18" />
            </Button>
            <Button variant="outline" size="icon" @click="confirmDeleteQuiz(quiz)">
              <Icon name="Trash2" :size="18" class="text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    <CreateQuizModalAdvanced @close="useQuiz.state.openModal = false" />
    
    <AlertDialog :open="showDeleteConfirmation" @update:open="showDeleteConfirmation = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le quiz ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le quiz "{{ quizToDelete?.title }}" ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelDelete">Annuler</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete" class="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "~/stores/quizStore";
import DefaultButton from "@/components/interaction/buttons/DefaultButton.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import type { Quiz } from "~/types/quiz/Quiz";
import CreateQuizModalAdvanced from "~/components/modals/quiz/CreateQuizModalAdvanced.vue";

const useQuiz = useQuizStore();
const router = useRouter();

const showDeleteConfirmation = ref(false);
const quizToDelete = ref<Quiz | null>(null);

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

function confirmDeleteQuiz(quiz: Quiz) {
  quizToDelete.value = quiz;
  showDeleteConfirmation.value = true;
}

function cancelDelete() {
  showDeleteConfirmation.value = false;
  quizToDelete.value = null;
}

async function confirmDelete() {
  if (quizToDelete.value) {
    try {
      const success = await useQuiz.deleteQuiz(quizToDelete.value.id);
      
      if (success) {
        showDeleteConfirmation.value = false;
        quizToDelete.value = null;
      } else {
        console.error('Erreur lors de la suppression du quiz:', useQuiz.state.apiError);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du quiz:', error);
    }
  }
}
</script>
