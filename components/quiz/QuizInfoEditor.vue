<template>
  <QuizInfoFields ref="fieldsRef" />
  <div class="flex justify-end">
    <DefaultButton :ctaButton="true" type="button" class="p-2 mt-4" @click="update">
      Enregistrer les modifications
    </DefaultButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QuizInfoFields from "./QuizInfoFields.vue";
import { useQuizStore } from "~/stores/quizStore";
import { toast } from "../ui/toast";
import DefaultButton from "../interaction/buttons/DefaultButton.vue";
const useQuiz = useQuizStore();

const fieldsRef = ref<any>(null);

const update = async () => {
  if (useQuiz.state.quiz && fieldsRef.value) {
    Object.assign(useQuiz.state.quizForm, fieldsRef.value.formLocal);
    const updateInfo = await useQuiz.update(useQuiz.state.quiz.id, useQuiz.state.quizForm);
    if (updateInfo) {
      toast({
        description: "Informations du quiz mises à jour avec succès",
      });
    } else {
      toast({
        title: useQuiz.state.apiError?.message,
        description: useQuiz.state.apiError?.errors
          ? Object.values(useQuiz.state.apiError.errors).flat().join(" ")
          : "",
        variant: "destructive",
      });
    }
  }
};
</script>
