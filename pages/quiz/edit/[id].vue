<template>
    <div class="max-w-3xl mx-auto py-8">
        <div class="flex flex-row gap-4 mb-6">
            <div v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value as 'info' | 'questions'"
                class="cursor-pointer py-2 px-6 rounded-lg font-semibold transition-all duration-150" :class="{
                    'bg-pink-500 text-white shadow scale-105': activeTab === tab.value,
                    'bg-white text-pink-500 border border-pink-200 hover:bg-pink-50': activeTab !== tab.value
                }">
                {{ tab.label }}
            </div>
        </div>
        <h1 class="text-[2rem] font-[600] mb-6">{{ store.state.quiz?.title }}</h1>
        <form v-if="!store.state.loading && store.state.quiz" class="flex flex-col gap-6">
            <div v-if="activeTab === 'info'">
                <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <QuizInfoEditor ref="infoEditorRef" />
                </div>
            </div>
            <div v-else-if="activeTab === 'questions'">
                <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <QuizQuestionsEditor />
                </div>
            </div>
            <div v-else-if="activeTab === 'answers'">
                <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuizStore } from '~/stores/quizStore'
import QuizInfoEditor from '~/components/quiz/QuizInfoEditor.vue'
import Loading from '~/components/common/Loading.vue'

const route = useRoute()
const store = useQuizStore()

const activeTab = ref<string>('info')

const tabs = [
    { value: 'info', label: 'Informations' },
    { value: 'questions', label: 'Questions' },
    { value: 'answers', label: 'Réponses' }
]


const infoEditorRef = ref<any>(null)

onMounted(async () => {
    await store.getOne(Number(route.params.id))
})
</script>