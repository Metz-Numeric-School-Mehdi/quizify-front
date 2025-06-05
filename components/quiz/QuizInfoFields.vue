<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label class="font-semibold">Titre</label>
            <Input v-model="formLocal.title" placeholder="Titre du quiz" />
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-semibold">Description</label>
            <Input v-model="formLocal.description" placeholder="Description du quiz" />
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-semibold">Niveau</label>
            <Select @update:open="fetchLevels()" v-model="formLocal.level_id">
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="(val, index) in useQuiz.state.levels" :key="index" :value="val.id">
                        {{ val.name }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-semibold">Catégorie</label>
            <Select @update:open="fetchCategories()" v-model="formLocal.category_id">
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="(cat, index) in useQuiz.state.categories" :key="index" :value="cat.id">
                        {{ cat.name }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-semibold">Public</label>
            <Select v-model="formLocal.is_public">
                <SelectTrigger>
                    <SelectValue placeholder="Le quiz est-il public ?" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem :value="'1'">Oui</SelectItem>
                    <SelectItem :value="'0'">Non</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-semibold">Statut</label>
            <Select v-model="formLocal.status">
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut du quiz" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useQuizStore } from '~/stores/quizStore'
import Select from '~/components/ui/select/Select.vue'
import SelectTrigger from '~/components/ui/select/SelectTrigger.vue'
import SelectValue from '~/components/ui/select/SelectValue.vue'
import SelectContent from '~/components/ui/select/SelectContent.vue'
import SelectItem from '~/components/ui/select/SelectItem.vue'

const useQuiz = useQuizStore()

const formLocal = reactive({
    title: '',
    description: '',
    level_id: 0,
    category_id: 0,
    is_public: '0',
    status: 'draft',
})

onMounted(() => {
    if (useQuiz.state.quizForm) {
        formLocal.title = useQuiz.state.quizForm.title || ''
        formLocal.description = useQuiz.state.quizForm.description || ''
        formLocal.level_id = useQuiz.state.quizForm.level_id || 0
        formLocal.category_id = useQuiz.state.quizForm.category_id || 0
        formLocal.is_public = useQuiz.state.quizForm.is_public || '0'
        formLocal.status = useQuiz.state.quizForm.status || 'draft'
    }
})

const fetchLevels = async () => {
    if (!useQuiz.state.levels || useQuiz.state.levels.length === 0) {
        await useQuiz.getLevels()
    }
}
const fetchCategories = async () => {
    if (!useQuiz.state.categories || useQuiz.state.categories.length === 0) {
        await useQuiz.getCategories()
    }
}

defineExpose({ formLocal })
</script>
