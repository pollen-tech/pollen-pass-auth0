<template>
  <div class="h-screen">
    <v-row no-gutters>
      <v-col
        v-if="!$vuetify.display.mobile"
        cols="12"
        md="4"
        lg="4"
        class="pa-12 side-container-pollen-pass h-screen"
      >
        <AuthSideBar />
      </v-col>
      <v-col cols="12" md="8">
        <div class="ma-8">
          <AuthLogin v-if="!is_email_sent" @submit="send_otp" />
          <AuthVerification v-else />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { lmsApi } from "~/services/api";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const is_email_sent = ref(false);
const email = ref("");
const otp = ref("");

const send_otp = async (param) => {
  try {
    email.value = param;
    const req = await lmsApi(
      `/auth0/password-less-email-login/${email.value}`,
      "POST"
    );
    if (req) {
      const user = {
        email: email.value,
        channelCode: get_channel() || "POLLEN_PASS",
      };
      userStore.setUser(user);
      is_email_sent.value = true;
    }
  } catch (err) {
    console.log(err);
  }
};

const get_channel = () => {
  if (typeof window !== "undefined") {
    const channel = localStorage.getItem("channel");
    return channel;
  }
};
const go_to_login = () => {
  is_email_sent.value = false;
};
</script>

<style lang="scss" scoped></style>
