<template>
  <template v-if="useQuiz.state.quiz?.questions && useQuiz.state.quiz?.questions.length < 1">
    <div class="flex items-center justify-center flex-col gap-4">
      <Label class="text-center text-gray-500 mt-10"
        >Aucune question n'a été créée pour ce quiz.</Label
      >
    </div>
  </template>
  <template v-else>
    <ul class="space-y-4" v-if="useQuiz.state.quiz?.questions">
      <li class="space-y-2" v-for="question in useQuiz.state.quiz.questions" :key="question.id">
        <div class="flex items-center gap-2">
          <Label>
            {{ question.content }}
          </Label>
          <Button
            class="bg-pink-100 text-pink-600 font-bold px-3 py-1 rounded-lg hover:bg-pink-200 transition text-sm shadow-sm"
            type="button"
            @click="create(question.id)"
            :disabled="question.answers.length >= 4"
          >
            + Ajouter une réponse
          </Button>
        </div>
        <ul class="space-y-2">
          <li
            v-for="(answer, aIndex) in question.answers"
            :key="answer.id"
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
              class="text-red-500 cursor-pointer transition-all duration-200 hover:bg-red-100 hover:scale-105 rounded-full p-1"
            />
          </li>
        </ul>
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <DefaultButton :ctaButton="true" type="button" class="w-fit p-2 mt-4" @click="save()">
        Enregistrer les modifications
      </DefaultButton>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { toast } from "../ui/toast";
import DefaultButton from "../interaction/buttons/DefaultButton.vue";

const useAnswer = useAnswerStore();
const useQuiz = useQuizStore();

const create = async (id: number) => {
  const question = useQuiz.state.quiz?.questions.find((q) => q.id === id);
  if (question && question.answers.length < 4) {
    question.answers = [
      ...question.answers,
      {
        content: "Nouvelle réponse",
        is_correct: false,
      },
    ];
  }
};

const save = async () => {
  if (useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0) {
    for (const question of useQuiz.state.quiz.questions) {
      // Sépare les réponses à créer et à mettre à jour
      const answersToCreate = question.answers.filter((a) => !a.id);
      const answersToUpdate = question.answers.filter((a) => a.id);

      let resultCreate = null;
      let resultUpdate = null;

      // CREATE : payload sans id
      if (answersToCreate.length > 0) {
        const payload = {
          question_id: question.id,
          answers: answersToCreate.map((a) => ({
            content: a.content,
            is_correct: a.is_correct,
          })),
        };
        resultCreate = await useAnswer.create(payload);
        if (resultCreate) {
          toast({
            description: "Réponse(s) créée(s) avec succès",
          });
        } else {
          toast({
            description: "Erreur lors de la création de la/les réponse(s)",
            variant: "destructive",
          });
        }
      }

      if (answersToUpdate.length > 0) {
        const payload = {
          question_id: question.id,
          answers: answersToUpdate.map((a) => ({
            id: a.id,
            content: a.content,
            is_correct: a.is_correct,
          })),
        };
        resultUpdate = await useAnswer.update(payload, question.id);
        if (resultUpdate) {
          toast({
            description: "Réponse(s) mise(s) à jour avec succès",
          });
        } else {
          toast({
            description: "Erreur lors de la mise à jour de la/les réponse(s)",
            variant: "destructive",
          });
        }
      }
    }
  }
};

const remove = async (answer_id: number | undefined) => {
  if (!answer_id) {
    useQuiz.state.quiz?.questions.forEach((question) => {
      question.answers = question.answers.filter((ans) => ans.id !== answer_id);
    });
    return;
  }
  if (useQuiz.state.quiz?.questions && useQuiz.state.quiz.questions.length > 0) {
    const remove = await useAnswer.remove(answer_id);
    if (remove) {
      toast({
        description: "Réponse supprimée avec succès",
        duration: 3000,
      });
    } else {
      toast({
        description: "Erreur lors de la suppression de la réponse",
        variant: "destructive",
        duration: 3000,
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
