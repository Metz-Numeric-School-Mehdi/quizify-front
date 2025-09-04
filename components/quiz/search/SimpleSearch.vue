<template>
    <div class="w-full">
        <div class="relative flex items-center">
            <Input v-model="searchQuery" placeholder="Rechercher un quiz..."
                class="pr-10 rounded-full border-border/50 focus-visible:ring-primary-linear/40"
                @input="debounceSearch" />
            <Button variant="ghost" size="icon" :disabled="searchQuery.length === 0"
                class="absolute hover:bg-transparent right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                @click="performSearch">
                <Icon name="Search" :size="18" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const props = defineProps({
    initialQuery: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['search-result']);

const { items, meta, loading, error, search } = useQuizSearch();
const searchQuery = ref(props.initialQuery || '');
const searchTimeout = ref<NodeJS.Timeout | null>(null);

const searchResults = computed(() => {
    return {
        items: items.value,
        meta: meta.value,
        loading: loading.value,
        error: error.value
    };
});

watch(searchResults, (newResults) => {
    emit('search-result', newResults);
}, { deep: true });

onMounted(() => {
    if (props.initialQuery) {
        performSearch();
    }
});

const debounceSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    searchTimeout.value = setTimeout(() => {
        performSearch();
    }, 500);
};

const performSearch = () => {
    search({ q: searchQuery.value });
};
</script>
