<template>
  <div
    v-if="useQuiz.state.openModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 md:px-0"
    @click.self="closeModal"
  >
    <div class="relative p-8 bg-white max-w-[45rem] rounded-xl overflow-y-auto max-h-[900px]">
      <button
        type="button"
        @click="closeModal"
        class="absolute top-4 right-4 p-2 rounded hover:bg-pink-100"
      >
        <Icon name="X" :stroke-width="2" class="w-6 h-6 text-purple-700" />
      </button>
      <h2 class="text-title font-[500]">{{ quizModalConfig.title }}</h2>
      <p class="text-gray-500 mb-4">{{ quizModalConfig.description }}</p>
      <form class="flex flex-wrap gap-4 pt-4 items-center" @submit="onSubmit">
        <div
          v-for="(field, index) in quizModalConfig.form"
          :key="field.vModel"
          class="space-y-1 w-full"
          :class="{
            'md:w-[calc(50%-0.5rem)]': quizModalConfig.form.length > 3 && index > 2,
          }"
        >
          <FormField v-slot="{ componentField }" :name="field.vModel">
            <FormItem v-auto-animate>
              <FormLabel :for="field.vModel" v-if="field.type !== 'switch'">
                {{ field.title }}
              </FormLabel>
              <FormControl>
                <!-- Text input -->
                <template v-if="field.type === 'text'">
                  <Input
                    v-bind="componentField"
                    :type="field.type"
                    :id="field.vModel"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="w-full"
                  />
                </template>
                <template v-else-if="field.type === 'textarea'">
                  <Textarea
                    v-bind="componentField"
                    :id="field.vModel"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="w-full resize-none h-[120px]"
                  />
                </template>
                <!-- Number input -->
                <template v-else-if="field.type === 'number'">
                  <Input
                    v-bind="componentField"
                    type="number"
                    :id="field.vModel"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="w-full"
                    min="0"
                    :max="field.vModel === 'pass_score' ? 100 : undefined"
                  />
                </template>
                <!-- Select input -->
                <template v-else-if="field.type === 'select'">
                  <SelectComponent
                    v-bind="componentField"
                    :options="
                      Array.isArray(field.options)
                        ? field.options
                        : (useQuiz.state as any)[field.options] || []
                    "
                    :placeholder="field.placeholder"
                    @open="
                      field.fetch ? fetchers[field.fetch] && fetchers[field.fetch]() : undefined
                    "
                  />
                </template>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DefaultButton :ctaButton="true" type="submit" class="w-full justify-center">
          Créer
        </DefaultButton>
      </form>
      <!-- <button class="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl" @click="closeModal"
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
            <SelectItem v-for="(val, index) in useQuiz.state.levels" :key="index" :value="val.id">
              {{ val.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select @update:open="fetchCategories" v-model="form.category_id">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(val, index) in useQuiz.state.categories" :key="index" :value="val.id">
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
        <DefaultButton :ctaButton="true" class="flex justify-center" type="submit">
          Créer
        </DefaultButton>
      </form>
      <EditQuizModal v-if="useQuiz.state.quiz" />
      <div v-if="error" class="text-red-500 text-center">{{ error }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import DragAndDropImage from "@/components/common/DragAndDropImage.vue";
import type { CreateQuizModal } from "~/types/quiz/CreateQuizModal";
import DefaultButton from "@/components/interaction/buttons/DefaultButton.vue";
import { useQuizStore } from "~/stores/quizStore";
import NumberFieldTimer from "~/components/common/NumberFieldTimer.vue";
import { quizModalConfig } from "~/constants/quizConfig";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import SelectComponent from "~/components/common/interaction/SelectComponent.vue";
import SwitchComponent from "~/components/common/interaction/SwitchComponent.vue";
import { ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import type { QuizCreatePayloadType } from "~/types/config/QuizConfigType";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { quizFormSchema } from "~/validation/quizFormSchema";

const useQuiz = useQuizStore();
const error = ref<string | null>(null);

const router = useRouter();

watch(
  () => useQuiz.state.openModal,
  (open) => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  },
);

onUnmounted(() => {
  document.body.classList.remove("overflow-hidden");
});

const fetchLevels = () => {
  if (useQuiz.state.levels !== null) return;
  useQuiz.getLevels();
};

const fetchCategories = () => {
  if (useQuiz.state.categories !== null) return;
  useQuiz.getCategories();
};

const fetchers: Record<string, () => void> = {
  fetchLevels,
  fetchCategories,
};

const closeModal = () => {
  useQuiz.state.openModal = false;
  useQuiz.resetPayload();
};

const formSchema = toTypedSchema(quizFormSchema);

const { handleSubmit, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    description: "",
    duration: 0,
    pass_score: 0,
    level_id: "",
    category_id: "",
    is_public: "true",
    status: "draft",
    max_attempts: 1,
    thumbnail: null,
  },
});

const onSubmit = handleSubmit(async (formValues: any) => {
  console.log(formValues);
  error.value = null;
  try {
    const result = await useQuiz.create(formValues);

    if (result) {
      closeModal();
      await useQuiz.getAll();
      router.push(`/quiz/edit/${useQuiz.state.quiz?.id}`);
    } else {
      error.value = "Erreur lors de la création du quiz.";
    }
  } catch (e: any) {
    console.error("Error creating quiz:", e);
  }
});
</script>
