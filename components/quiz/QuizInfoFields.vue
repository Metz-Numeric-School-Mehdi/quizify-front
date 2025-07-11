<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="(field, index) in quizModalConfig.form"
      :key="field.vModel"
      class="space-y-1 w-full"
    >
      <FormField v-slot="{ componentField }" :name="field.vModel">
        <FormItem v-auto-animate>
          <FormLabel :for="field.vModel" v-if="field.type !== 'switch'">
            {{ field.title }}
          </FormLabel>
          <FormControl>
            <template v-if="field.type === 'text'">
              <Input
                v-bind="componentField"
                v-model="values[field.vModel]"
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
                v-model="values[field.vModel]"
                :id="field.vModel"
                :placeholder="field.placeholder"
                :required="field.required"
                class="w-full"
                maxlength="250"
              />
              <div class="text-right text-xs text-gray-400 mt-1">
                {{ values[field.vModel]?.length || 0 }}/250 caractères
              </div>
            </template>
            <template v-else-if="field.type === 'number'">
              <template v-if="field.vModel === 'duration'">
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="min in [1, 2, 3, 5, 10, 15, 20, 30, 45, 60]"
                    :key="min"
                    type="button"
                    :tabindex="values.duration === min ? 0 : -1"
                    :class="[
                      'px-4 py-2 rounded-full font-semibold border transition',
                      values.duration === min
                        ? 'bg-pink-500 text-white border-pink-500 ring-2 ring-pink-400'
                        : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'
                    ]"
                    @click="values.duration = min"
                  >
                    {{ min }} min
                  </button>
                </div>
              </template>
              <template v-else-if="field.vModel === 'pass_score'">
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="score in [50, 60, 70, 80, 90, 100]"
                    :key="score"
                    type="button"
                    :tabindex="values.pass_score === score ? 0 : -1"
                    :class="[
                      'px-4 py-2 rounded-full font-semibold border transition',
                      values.pass_score === score
                        ? 'bg-pink-500 text-white border-pink-500 ring-2 ring-pink-400'
                        : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'
                    ]"
                    @click="values.pass_score = score"
                  >
                    {{ score }} %
                  </button>
                </div>
              </template>
              <template v-else>
                <Input
                  v-bind="componentField"
                  v-model="values[field.vModel]"
                  type="number"
                  :id="field.vModel"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  class="w-full"
                  min="0"
                  :max="field.vModel === 'pass_score' ? 100 : undefined"
                />
              </template>
            </template>
            <template v-else-if="field.type === 'select'">
              <SelectComponent
                class="w-full"
                v-bind="componentField"
                v-model="values[field.vModel]"
                :options="
                  Array.isArray(field.options)
                    ? field.options
                    : field.options !== undefined
                      ? (useQuiz.state as any)[field.options as keyof typeof useQuiz.state] || []
                      : []
                "
                :placeholder="field.placeholder"
                @open="field.fetch ? fetchers[field.fetch] && fetchers[field.fetch]() : undefined"
              />
            </template>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuizStore } from "~/stores/quizStore";
import { quizModalConfig } from "~/constants/quizConfig";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import Input from "@/components/ui/input/Input.vue";
import SelectComponent from "~/components/common/interaction/SelectComponent.vue";

const useQuiz = useQuizStore();

const fetchLevels = () => {
  if (useQuiz.state.levels !== null) return;
  useQuiz.getLevels();
};
const fetchCategories = () => {
  if (useQuiz.state.categories !== null) return;
  useQuiz.getCategories();
};
const fetchers: { [key: string]: any } = {
  fetchLevels,
  fetchCategories,
};

const values = reactive<{ [key: string]: any }>({});
quizModalConfig.form.forEach((field) => {
  values[field.vModel] = "";
});



const formLocal = computed(() => ({ ...values }));
defineExpose({ formLocal });

watch(
  () => useQuiz.state.quiz,
  (newQuiz: { [key: string]: any }) => {
    if (newQuiz) {
      quizModalConfig.form.forEach((field) => {
        if (
          field.vModel in newQuiz &&
          newQuiz[field.vModel] !== undefined &&
          newQuiz[field.vModel] !== null
        ) {
          if (field.vModel === "is_public") {
            values.is_public = newQuiz.is_public == 1 ? "true" : "false";
          } else if (field.vModel === "duration") {
            values.duration = newQuiz.duration ? Math.round(newQuiz.duration / 60) : 0;
          } else {
            values[field.vModel] = newQuiz[field.vModel];
          }
        } else if (field.vModel === "level_id" && newQuiz.level) {
          values.level_id = newQuiz.level.id;
        } else if (field.vModel === "category_id" && newQuiz.category) {
          values.category_id = newQuiz.category.id;
        } else if (field.type === "select" && !values[field.vModel]) {
          values[field.vModel] = values[field.vModel] || "";
        }
      });
    }
  },
  { immediate: true },
);
</script>
