<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="options.width"
    @keydown.esc="cancel"
  >
    <v-card
      class="py-2 px-4 rounded-lg"
      :width="$vuetify.display.mobile ? 'auto' : '600'"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="dialog-title">{{ options.title }}</span>
        <v-btn
          variant="plain"
          icon="mdi-close"
          class="floating-close-btn"
          @click="cancel"
        />
      </v-card-title>

      <v-card-item class="px-4 mb-4">
        <div v-if="options.message" style="color: #6b7280">
          {{ options.message }}
        </div>
      </v-card-item>

      <v-card-text>
        <div class="d-flex justify-end">
          <v-btn
            v-if="options.actionText1"
            :text="options.actionText1"
            :prepend-icon="options.actionIcon1"
            variant="outlined"
            class="ma-1 text-capitalize"
            @click="cancel"
          />

          <v-btn
            v-if="options.actionText2"
            :text="options.actionText2"
            :prepend-icon="options.actionIcon2"
            :full-width="$vuetify.display.mobile"
            color="#8431e7"
            class="ma-1 text-capitalize"
            @click="agree"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      options: {
        message: null,
        title: null,
        icon: "",
        color: "grey lighten-3",
        width: 420,
        zIndex: 200,
        noconfirm: false,
        rejection: false,
        actionText1: "",
        actionText2: "",
        actionIcon1: "",
        actionIcon2: "",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    hideDialog() {
      this.dialog = false;
    },
  },
};
</script>
