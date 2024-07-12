<template>
  <v-snackbar
    v-model="showNotification"
    color="white"
    location="top right"
    width="250"
    multi-line
  >
    <div class="d-flex justify-space-between mb-2">
      <div
        v-if="statusNotification === 'error'"
        class="bg-red-lighten-5 rounded-circle"
      >
        <v-icon size="large" color="red-darken-2" class="ma-2"
          >mdi-alert-circle</v-icon
        >
      </div>

      <div v-else class="bg-purple-lighten-5 rounded-circle">
        <v-icon size="large" color="purple-darken-2" class="ma-2"
          >mdi-check</v-icon
        >
      </div>
      <v-icon size="small" class="mt-2" @click="hideNotification()"
        >mdi-close</v-icon
      >
    </div>
    <div class="pa-2">
      {{ textNotification }}
    </div>
  </v-snackbar>
</template>

<script>
import { mapState, storeToRefs, mapActions } from "pinia";
import { useCommonStore } from "~/store/common";

export default {
  setup() {
    const commonStore = useCommonStore();
    const {
      showNotification,
      colorNotification,
      textNotification,
      statusNotification,
    } = storeToRefs(commonStore);
    return {
      showNotification,
      colorNotification,
      textNotification,
      statusNotification,
    };
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    ...mapState(useCommonStore, ["textNotification"]),
  },
  methods: {
    ...mapActions(useCommonStore, ["setShowNotification"]),
    hideNotification() {
      this.setShowNotification(false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
