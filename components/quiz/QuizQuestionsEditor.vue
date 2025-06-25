<template>
  <template v-if="useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length < 1">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="font-semibold">Titre de la question</label>
        <Input v-model="questionsForm.content" placeholder="Titre de la question" />
      </div>
    </div>
    <Button
      class="bg-pink-500 w-fit text-white font-bold p-2 mt-4 rounded-xl hover:bg-pink-600 transition"
      type="button"
      @click="create"
    >
      Créer une question
    </Button>
  </template>
  <template v-else>
    <ul class="space-y-4">
      <li
        class="space-y-2"
        v-for="(question, index) in useQuiz.state.quiz?.questions"
        :key="question.id"
      >
        <Label> Question {{ index + 1 }} : </Label>
        <div class="flex items-center gap-2">
          <Input v-model="question.content" />
          <Icon
            @click="remove(question.id)"
            name="Trash"
            :stroke-width="2"
            class="text-red-500 cursor-pointer"
          />
        </div>
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <Button
        class="bg-pink-500 w-fit text-white font-bold p-2 mt-4 rounded-xl hover:bg-pink-600 transition"
        type="button"
        @click="create"
      >
        Ajouter une question
      </Button>
      <Button
        class="bg-pink-500 w-fit text-white font-bold p-2 mt-4 rounded-xl hover:bg-pink-600 transition"
        type="button"
        @click="update"
      >
        Enregistrer les modifications
      </Button>
    </div>
  </template>
</template>

<script lang="ts" setup>
import type { CreateQuestion } from "~/types/question/Question";
import { toast } from "../ui/toast";

const useQuestion = useQuestionStore();
const useQuiz = useQuizStore();

const questionsForm = ref<CreateQuestion>({
  quiz_id: useQuiz.state && useQuiz.state.quiz?.id !== undefined ? useQuiz.state.quiz.id : 0,
  content:
    useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0
      ? useQuiz.state.quiz.questions[0].content
      : "",
  question_type_id: 3,
});

const create = async () => {
  await useQuestion.create({
    quiz_id: useQuiz.state.quiz?.id || 0,
    content:
      useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0
        ? useQuiz.state.quiz.questions[0].content
        : questionsForm.value.content.trim() + " ?",
    question_type_id: 3,
  });
};

const update = async () => {
  if (useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0) {
    for (const question of useQuiz.state.quiz.questions) {
      const update = await useQuestion.update(
        {
          content: question.content,
          quiz_id: useQuiz.state.quiz.id,
          question_type_id: 3,
        },
        question.id,
      );
      if (update) {
        toast({
          description: "Question mise à jour avec succès",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Erreur lors de la mise à jour de la question",
        });
      }
    }
  }
};

const remove = async (question: number) => {
  if (useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0) {
    const remove = await useQuestion.remove(question);
    if (remove) {
      toast({
        description: "Question supprimée avec succès",
      });
    } else {
      toast({
        description: "Erreur lors de la suppression de la question",
        variant: "destructive",
      });
    }
  }
};
</script>
