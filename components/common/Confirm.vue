<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="options.width"
    @keydown.esc="cancel"
  >
    <v-card class="mx-auto" :width="$vuetify.display.mobile ? 'auto' : '600'">
      <v-card-item>
        <div>
          <div class="pa-2">
            <div
              class="d-flex text-subtitle-1 mb-1 text-font-bold align-center"
            >
              <div
                v-if="options.icon"
                class="bg-purple-lighten-5 rounded-circle"
              >
                <v-icon color="#8431E7" class="ma-2" :icon="options.icon" />
              </div>
            </div>
            <div class="d-flex flex-column">
              {{ options.title }}
            </div>
            <div v-if="options.message" class="text-caption my-2">
              {{ options.message }}
            </div>
          </div>
        </div>
      </v-card-item>

      <v-card-text>
        <div class="d-flex justify-end">
          <v-btn
            v-if="options.actionText1"
            :text="options.actionText1"
            :prepend-icon="options.actionIcon1"
            variant="outlined"
            class="text-caption ma-1"
            @click="cancel"
          />

          <v-btn
            v-if="options.actionText2"
            :text="options.actionText2"
            :prepend-icon="options.actionIcon2"
            :full-width="$vuetify.display.mobile"
            color="#8431e7"
            class="text-caption ma-1"
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
  },
};
</script>
