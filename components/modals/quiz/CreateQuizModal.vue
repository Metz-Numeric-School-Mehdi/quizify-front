<template>
  <div v-if="useQuiz.state.openModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 md:px-0" @click.self="closeModal">
    <div
      class="relative w-full max-w-lg max-h-[95vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-4">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl" @click="closeModal"
        aria-label="Fermer">×</button>
      <h2 class="text-xl font-bold mb-2 text-center">Créer un quiz</h2>
      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <input v-model="form.title" type="text" placeholder="Titre du quiz" class="input" required />
        <textarea v-model="form.description" placeholder="Description" class="input" required />
        <Select @update:open="fetchLevels()" v-model="form.level_id">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(val, index) in useQuiz.state.quizLevels" :key="index" :value="val.id">
              {{ val.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select @update:open="fetchCategories" v-model="form.category_id">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(val, index) in useQuiz.state.quizCategories" :key="index" :value="val.id">
              {{ val.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="form.is_public">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Public</SelectItem>
            <SelectItem value="false">Privé</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="form.status">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le statut du quiz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="published">Publié</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
        <NumberFieldTimer label="Durée" v-model="form.duration" />
        <DragAndDropImage v-model="form.thumbnail" accept="image/*" :preview="true"
          label="Glissez-déposez une image ici ou cliquez pour sélectionner une miniature (optionnel)" />
        <button type="submit"
          class="bg-pink-500 text-white font-bold py-2 rounded hover:bg-pink-600 transition">Créer</button>
      </form>
      <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragAndDropImage from '@/components/common/DragAndDropImage.vue'
import { ref } from 'vue'
import { useQuizStore } from '~/stores/quizStore'
import { useRouter } from 'vue-router'
import NumberFieldTimer from '~/components/common/NumberFieldTimer.vue'
import type { CreateQuizModal } from '~/types/quiz/CreateQuizModal'

const useQuiz = useQuizStore()
const error = ref<string | null>(null)
const router = useRouter()

const fetchLevels = () => {
  if (useQuiz.state.quizLevels !== null) return
  useQuiz.getQuizLevels()
}

const fetchCategories = () => {
  if (useQuiz.state.quizCategories !== null) return
  useQuiz.getQuizCategories()
}

const form = ref<CreateQuizModal>({
  title: '',
  description: '',
  level_id: '',
  category_id: '',
  is_public: 'true',
  status: 'draft',
  duration: 0,
  max_attempts: 1,
  pass_score: 0,
  thumbnail: null,
})

const closeModal = () => {
  useQuiz.state.openModal = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    level_id: '',
    category_id: '',
    is_public: 'true',
    status: 'draft',
    duration: 0,
    max_attempts: 1,
    pass_score: 0,
    thumbnail: null,
  }
  error.value = null
}

const submit = async () => {
  error.value = null
  try {
    const created = await useQuiz.create(form.value);
    if (created) {
      closeModal()
      await useQuiz.getAll()

    } else {
      error.value = 'Erreur lors de la création du quiz.'
    }
  } catch (e: any) {
    error.value = (typeof e === 'object' && e && 'message' in e) ? (e as any).message : 'Erreur lors de la création du quiz.'
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  outline: none;
  transition: box-shadow 0.2s;
}

.input:focus {
  box-shadow: 0 0 0 2px #ec4899;
  border-color: #ec4899;
}
</style>
