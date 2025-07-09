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
              />
            </template>
            <template v-else-if="field.type === 'number'">
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
            <template v-else-if="field.type === 'select'">
              <SelectComponent
                class="w-full"
                v-bind="componentField"
                v-model="values[field.vModel]"
                :options="
                  Array.isArray(field.options)
                    ? field.options
                    : (useQuiz.state as any)[field.options] || []
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
const fetchers = {
  fetchLevels,
  fetchCategories,
};

import { watch, reactive } from "vue";
import { computed } from "vue";
const values = reactive({});
quizModalConfig.form.forEach((field) => {
  values[field.vModel] = "";
});

const formLocal = computed(() => ({ ...values }));
defineExpose({ formLocal });

watch(
  () => useQuiz.state.quiz,
  (newQuiz) => {
    if (newQuiz) {
      quizModalConfig.form.forEach((field) => {
        if (
          field.vModel in newQuiz &&
          newQuiz[field.vModel] !== undefined &&
          newQuiz[field.vModel] !== null
        ) {
          values[field.vModel] = newQuiz[field.vModel];
        } else if (field.vModel === "level_id" && newQuiz.level) {
          values.level_id = newQuiz.level.id;
        } else if (field.vModel === "category_id" && newQuiz.category) {
          values.category_id = newQuiz.category.id;
        } else if (field.type === "select" && !values[field.vModel]) {
          // Si la valeur n'est pas définie, on garde l'ancienne valeur (évite null)
          values[field.vModel] = values[field.vModel] || "";
        }
      });
    }
  },
  { immediate: true },
);
</script>
