<template>
  <template v-if="useQuiz.state.quiz?.questions && useQuiz.state.quiz?.questions.length < 1">
    <div class="flex items-center justify-center flex-col gap-4">
      <Label class="text-lg font-semibold">Aucune question n'a été créée pour ce quiz.</Label>
    </div>
  </template>
  <template v-else>
    <ul class="space-y-4" v-if="useQuiz.state.quiz?.questions">
      <li
        class="space-y-2"
        v-for="(question, qIndex) in useQuiz.state.quiz.questions"
        :key="question.id"
      >
        <div class="flex items-center gap-2">
          <Label>
            {{ question.content
            }}<span v-if="question.content && !question.content.trim().endsWith('?')">?</span>
          </Label>
          <Button
            class="bg-pink-100 text-pink-600 font-bold px-3 py-1 rounded-lg hover:bg-pink-200 transition text-sm shadow-sm"
            type="button"
            @click="create(question.id)"
          >
            + Ajouter une réponse
          </Button>
        </div>
        <ul class="space-y-2">
          <li
            v-for="(answer, aIndex) in question.answers"
            :key="answer.id || aIndex"
            class="flex items-center gap-2"
          >
            <Input v-model="answer.content" />
            <input
              type="checkbox"
              :checked="answer.is_correct"
              @change="
                (e) =>
                  e.target &&
                  (e.target as HTMLInputElement).checked &&
                  setCorrectAnswer(question, aIndex)
              "
              class="accent-pink-500 w-5 h-5 border-pink-400"
            />
            <Icon
              @click="remove(answer.id)"
              name="Trash"
              :stroke-width="2"
              class="text-red-500 cursor-pointer"
            />
          </li>
        </ul>
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <DefaultButton :ctaButton="true" type="button" class="w-fit p-2 mt-4" @click="update">
        Enregistrer les modifications
      </DefaultButton>
    </div>
  </template>
</template>

<script lang="ts" setup>
import type { CreateAnswer } from "~/types/answer/Answer";
import { toast } from "../ui/toast";
import DefaultButton from "../interaction/buttons/DefaultButton.vue";

const useQuestion = useQuestionStore();
const useAnswer = useAnswerStore();
const useQuiz = useQuizStore();

const create = async (id: number) => {
  await useAnswer.create({
    question_id: id,
    content: "Nouvelle réponse",
    is_correct: false,
  });
};

const update = async () => {
  if (useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0) {
    for (const question of useQuiz.state.quiz.questions) {
      for (const answer of question.answers) {
        const update = await useAnswer.update(
          {
            content: answer.content,
            question_id: question.id,
            is_correct: answer.is_correct,
          },
          answer.id,
        );

        if (update) {
          toast({
            description: "Réponses mise à jour avec succès",
          });
        } else {
          toast({
            description: "Erreur lors de la mise à jour des réponses",
            variant: "destructive",
          });
        }
      }
    }
  }
};

const remove = async (answer_id: number) => {
  if (useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0) {
    const remove = await useAnswer.remove(answer_id);
    if (remove) {
      toast({
        description: "Réponse supprimée avec succès",
      });
    } else {
      toast({
        description: "Erreur lors de la suppression de la réponse",
        variant: "destructive",
      });
    }
  }
};

const setCorrectAnswer = (question: any, correctIndex: number) => {
  question.answers.forEach((ans: any, idx: number) => {
    ans.is_correct = idx === correctIndex;
  });
};
</script>
