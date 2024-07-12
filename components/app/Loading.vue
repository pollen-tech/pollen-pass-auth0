<template>
  <div>
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
