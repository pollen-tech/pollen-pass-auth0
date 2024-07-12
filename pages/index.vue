<template>
  <div>
    <AppLoading :loading="loading" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(true);
</script>

<style lang="scss" scoped></style>
