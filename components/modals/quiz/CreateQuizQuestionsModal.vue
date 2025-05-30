<template>
    <div v-if="currentStep === 3" class="px-2 h-10">
        <div class="mb-4 flex flex-col gap-6">
            <div v-for="(question, qIdx) in useQuiz.state.createQuizForm.questions" :key="qIdx"
                class="border border-pink-200 rounded-lg p-4 bg-pink-50 relative">
                <button type="button" class="absolute top-2 right-2 text-xs text-pink-400 hover:text-pink-600"
                    @click="removeQuestion(qIdx)" v-if="useQuiz.state.createQuizForm.questions.length > 1">
                    Supprimer la question
                </button>
                <div class="mb-2">
                    <label class="block font-semibold mb-1">Question</label>
                    <input v-model="question.content" type="text" required
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Question" />
                </div>
                <div class="mb-2">
                    <label class="block font-semibold mb-1">Type</label>
                    <Select v-model="question.question_type_id">
                        <SelectTrigger class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400">
                            <span>{{ questionTypes.find(t => t.id === Number(question.question_type_id))?.name || 'Sélectionner' }}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="type in questionTypes" :key="type.id" :value="type.id">
                                {{ type.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label class="block font-semibold mb-1">Réponses</label>
                    <div class="flex flex-col gap-2">
                        <div v-for="(answer, aIdx) in question.answers" :key="aIdx" class="flex items-center gap-2">
                            <input v-model="answer.content" type="text" required
                                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Réponse" />
                            <label class="flex items-center gap-1 text-xs">
                                <input type="checkbox" v-model="answer.is_correct" class="rounded"
                                    style="accent-color: hsl(var(--primary)); border-color: hsl(var(--primary));" />
                                Bonne
                            </label>
                            <button type="button" class="text-xs text-primary-linear" @click="removeAnswer(qIdx, aIdx)"
                                v-if="question.answers.length > 1">
                                ✕
                            </button>
                        </div>
                        <button v-if="useQuiz.state.createQuizForm.questions[qIdx].answers.length <= 4 - 1"
                            type="button" class="mt-2 text-xs hover:underline text-primary-linear"
                            @click="addAnswer(qIdx)">
                            + Ajouter une réponse
                        </button>
                    </div>
                </div>
            </div>
            <button v-if="useQuiz.state.createQuizForm.questions.length <= 5 - 1" type="button"
                class="mt-2 text-sm text-primary-linear hover:underline" @click="addQuestion">
                + Ajouter une question
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const props = defineProps<{ currentStep: number }>()

const useQuiz = quizStore()

const questionTypes = [
    { id: 1, name: "Choix unique" },
    { id: 2, name: "Choix multiple" },
];

const removeQuestion = (index: number) => {
    if (useQuiz.state.createQuizForm) {
        useQuiz.state.createQuizForm.questions.splice(index, 1);
    }
};

const removeAnswer = (qIdx: number, aIdx: number) => {
    if (useQuiz.state.createQuizForm) {
        useQuiz.state.createQuizForm.questions[qIdx].answers.splice(aIdx, 1);
    }
};

const addQuestion = () => {
    if (useQuiz.state.createQuizForm) {
        if (!useQuiz.state.createQuizForm.questions) {
            useQuiz.state.createQuizForm.questions = [];
        }
        useQuiz.state.createQuizForm.questions.push({
            content: "",
            question_type_id: "",
            answers: [{ content: "", is_correct: false }],
        });
    }
};

const addAnswer = (qIdx: number) => {
    if (useQuiz.state.createQuizForm) {
        useQuiz.state.createQuizForm.questions[qIdx].answers.push({
            content: "",
            is_correct: false,
        });
    }
};
</script>
