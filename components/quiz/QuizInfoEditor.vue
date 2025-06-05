<template>
    <QuizInfoFields ref="fieldsRef" />
    <div class="flex justify-end">
        <Button class="bg-pink-500 text-white font-bold p-2 mt-4 rounded-xl hover:bg-pink-600 transition" type="button"
            @click="update">
            Enregistrer les modifications
        </Button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuizInfoFields from './QuizInfoFields.vue'
import { useQuizStore } from '~/stores/quizStore'
import { toast } from '../ui/toast'
const useQuiz = useQuizStore()

const fieldsRef = ref<any>(null)

const update = async () => {
    if (useQuiz.state.quiz && fieldsRef.value) {
        Object.assign(useQuiz.state.quizForm, fieldsRef.value.formLocal)
        const updateInfo = await useQuiz.update(useQuiz.state.quiz.id, useQuiz.state.quizForm)
        if (updateInfo) {
            toast({
                description: 'Informations du quiz mises à jour avec succès',
            })
        } else {
            toast({
                description: useQuiz.state.error,
                variant: 'destructive',
            })
        }
    }
}
</script>
