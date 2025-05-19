<template>
  <div v-if="currentStep === 0" class="px-2">
    <div class="mb-4">
      <label class="block font-semibold mb-1">Titre</label>
      <input v-model="useQuiz.state.createQuizForm.title" type="text" required
        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
    </div>
    <div class="mb-4">
      <label class="block font-semibold mb-1">Description</label>
      <textarea v-model="useQuiz.state.createQuizForm.description" required
        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"></textarea>
    </div>
    <div class="mb-4 flex gap-4 flex-col sm:flex-row">
      <div class="flex-1">
        <label class="block font-semibold mb-1">Niveau</label>
        <Select v-model="useQuiz.state.createQuizForm.level_id">
          <SelectTrigger class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400">
            <span>{{levels.find(l => l.id === Number(useQuiz.state.createQuizForm.level_id))?.name || 'Sélectionner'}}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="level in levels" :key="level.id" :value="level.id">
              {{ level.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex-1">
        <label class="block font-semibold mb-1">Catégorie</label>
        <Select v-model="useQuiz.state.createQuizForm.category_id">
          <SelectTrigger class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400">
            <span>{{categories.find(c => c.id === Number(useQuiz.state.createQuizForm.category_id))?.name || 'Sélectionner'
                          }}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ currentStep: number }>()
const useQuiz = quizStore()

const categories = ref<{ id: number, name: string }[]>([
  { id: 1, name: "Mathématiques" },
  { id: 2, name: "Sciences" },
  { id: 3, name: "Histoire" },
])

const levels = ref<{ id: number, name: string }[]>([
  { id: 1, name: "Débutant" },
  { id: 2, name: "Intermédiaire" },
  { id: 3, name: "Avancé" },
])
</script>