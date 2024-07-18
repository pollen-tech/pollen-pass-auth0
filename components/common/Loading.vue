<template>
  <div>
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  loading: { type: Boolean, default: true },
});

const isLoading = computed(() => props.loading);
</script>

<style lang="scss" scoped></style>
