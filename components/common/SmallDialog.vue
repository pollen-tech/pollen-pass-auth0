<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      persistent
      class="mx-auto pa-2"
      :width="$vuetify.display.mobile ? 'auto' : '550'"
      style="z-index: 99999"
    >
      <v-card>
        <v-card-title
          class="d-flex justify-space-between align-center"
          style="padding: 16px 24px 24px"
        >
          <span class="text-h5 dialog-title">{{ title }}</span>
          <v-icon class="close-icon" @click="hideDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="dialog-description">{{ description }}</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="outlined"
            color="#374151"
            style="border-color: #d1d5db"
            @click="login"
            >Login</v-btn
          >
          <v-btn variant="flat" color="primary" @click="contactCS"
            >Contact CS</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDialogStore } from "@/store/dialog";

const dialogStore = useDialogStore();
const { dialog, title, description } = storeToRefs(dialogStore);

const login = () => {
  console.log("Login button clicked");
  dialogStore.hideDialog();
  navigateTo("/auth/login");
};

const contactCS = () => {
  console.log("Contact CS button clicked");
  dialogStore.hideDialog();
  window.location.href = "mailto:cs@pollen.tech";
};

const hideDialog = () => {
  dialogStore.hideDialog();
};
</script>

<style scoped>
.justify-end {
  justify-content: flex-end;
}
.dialog-title {
  color: var(--Neutral-900, #111827);
  font-feature-settings: "salt" on;

  /* Paragraph/Large/Medium */
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 155.556% */
}
.dialog-description {
  color: var(--Neutral-500, #6b7280);
  font-feature-settings: "salt" on;

  /* Paragraph/Small/Regular */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
}
.dialog-description a {
  color: #782cd1;
}
</style>
