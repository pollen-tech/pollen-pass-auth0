import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
  state: () => ({
    dialog: false,
    title: "",
    description: "",
  }),
  actions: {
    showDialog(title: string, description: string) {
      this.dialog = true;
      this.title = title;
      this.description = description;
    },
    hideDialog() {
      this.dialog = false;
      this.title = "";
      this.description = "";
    },
  },
});
