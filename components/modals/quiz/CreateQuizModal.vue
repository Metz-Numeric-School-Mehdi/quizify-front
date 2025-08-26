<template>
  <div v-if="useQuiz.state.openModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 md:px-0" @click.self="closeModal">
    <div class="p-8 bg-white max-w-[45rem] rounded-xl overflow-y-auto max-h-[90vh]">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-title font-[500]">{{ quizModalConfig.title }}</h2>
        <button type="button" @click="closeModal" class="p-2 rounded hover:bg-pink-100">
          <Icon name="X" :stroke-width="2" class="w-6 h-6 text-purple-700" />
        </button>
      </div>
      <p class="text-gray-500 mb-4">{{ quizModalConfig.description }}</p>
      <form class="flex flex-wrap gap-4 pt-4 items-center" @submit="onSubmit">
        <div v-for="(field, index) in quizModalConfig.form" :key="field.vModel" class="space-y-1 w-full" :class="{
          'md:w-[calc(50%-0.5rem)]': quizModalConfig.form.length > 3 && index > 2,
        }">
          <FormField v-slot="{ componentField }" :name="field.vModel">
            <FormItem v-auto-animate>
              <FormLabel :for="field.vModel" v-if="field.type !== 'switch'">
                {{ field.title }}
              </FormLabel>
              <FormControl>
                <template v-if="field.type === 'text'">
                  <Input v-bind="componentField" :type="field.type" :id="field.vModel" :placeholder="field.placeholder"
                    :required="field.required" class="w-full" />
                </template>
                <template v-else-if="field.type === 'textarea'">
                  <Textarea v-bind="componentField" :id="field.vModel" :placeholder="field.placeholder"
                    :required="field.required" class="w-full resize-none h-[120px]" />
                </template>
                <template v-else-if="field.type === 'number'">
                  <template v-if="field.vModel === 'duration'">
                    <div class="flex gap-2 flex-wrap">
                      <button v-for="min in [1, 2, 3, 5, 10, 15, 20, 30, 45, 60]" :key="min" type="button"
                        :tabindex="Number(values.duration) === min ? 0 : -1" :class="[
                          'px-4 py-2 rounded-full font-semibold border transition',
                          Number(values.duration) === min
                            ? 'bg-pink-500 text-white border-pink-500 ring-2 ring-pink-400'
                            : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50',
                        ]" @click="componentField.onChange(min)">
                        {{ min }} min
                      </button>
                    </div>
                  </template>
                  <template v-else-if="field.vModel === 'pass_score'">
                    <div class="flex gap-2 flex-wrap">
                      <button v-for="score in [50, 60, 70, 80, 90, 100]" :key="score" type="button"
                        :tabindex="Number(values.pass_score) === score ? 0 : -1" :class="[
                          'px-4 py-2 rounded-full font-semibold border transition',
                          Number(values.pass_score) === score
                            ? 'bg-pink-500 text-white border-pink-500 ring-2 ring-pink-400'
                            : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50',
                        ]" @click="componentField.onChange(score)">
                        {{ score }} %
                      </button>
                    </div>
                  </template>
                  <template v-else>
                    <Input v-bind="componentField" type="number" :id="field.vModel" :placeholder="field.placeholder"
                      :required="field.required" class="w-full" min="0"
                      :max="field.vModel === 'pass_score' ? 100 : undefined" />
                  </template>
                </template>
                <template v-else-if="field.type === 'select'">
                  <SelectComponent v-bind="componentField" :options="Array.isArray(field.options)
                    ? field.options
                    : (useQuiz.state as any)[field.options] || []
                    " :placeholder="field.placeholder" @open="
                      field.fetch ? fetchers[field.fetch] && fetchers[field.fetch]() : undefined
                      " />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from "@/components/interaction/buttons/DefaultButton.vue";
import { useQuizStore } from "~/stores/quizStore";
import { quizModalConfig } from "~/constants/quizConfig";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import SelectComponent from "~/components/common/interaction/SelectComponent.vue";
import { ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
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
  error.value = null;
  try {
    const createdQuiz = await useQuiz.create(formValues);
    if (createdQuiz && createdQuiz.id) {
      closeModal();
      router.push(`/quiz/edit/${createdQuiz.id}`);
      await useQuiz.getAll();
    } else {
      error.value = "Erreur lors de la création du quiz.";
    }
  } catch (e: any) {
    console.error("Error creating quiz:", e);
  }
});
</script>
