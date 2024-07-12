import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => {
    return {
      showNotification: false,
      colorNotification: "white",
      textNotification: "",
      statusNotification: "success",
    };
  },
  actions: {
    setShowNotification(param: any) {
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
      this.statusNotification = param?.status;
      this.textNotification = param?.msg;
      this.showNotification = param?.display;
    },
    hideNotification() {
      this.showNotification = false;
    },
  },
});
