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
    <CommonConfirm ref="confirm" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { lmsApi } from "~/services/api";
import { useUserStore } from "@/store/user";
import { useAuth } from "@/composables/auth0";

definePageMeta({
  middleware: "auth",
});
const userStore = useUserStore();
const { user, getUserLocalStorage } = userStore;

const auth = useAuth();
const { cleanup_user_data } = auth;

const is_email_sent = ref(false);
const email = ref("");
const confirm = ref(null);

onMounted(() => {
  const channel = auth.get_channel();
  if (!channel) {
    show_dialog();
  }

  const user_local = getUserLocalStorage();
  if (user == null && user_local != null) {
    userStore.setUser(user_local);
    let page = "/auth/verification";
    if (user_local?.user_id) {
      page = "/auth/otp";
    }
    // show_confirmation_dialog(page);
  }
});

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

const show_dialog = async () => {
  const options = {
    title: "User cannot Sign In without channel",
    message:
      "Please connect to the appropriate Pollen Channel before signing in or signing up.",
    icon: "mdi-lightbulb-on-20",
    color: "purple darken-2",
    actionText1: "Go To Pollen Direct (Buyer)",
    actionText2: "Go To LMS (Seller)",
    actionIcon2: "",
    hideClose: true,
    rejection: false,
  };
  if (await confirm.value.open(options)) {
    navigateTo(runtimeConfig.public.pollenLmsUrl, { external: true });
  } else {
    navigateTo(runtimeConfig.public.pollenDirectUrl.replace("/redirect", ""), {
      external: true,
    });
  }
};

const show_confirmation_dialog = async (param) => {
  const options = {
    title: "User devtestonboard11@yopmail.com is already login",
    message: "Do you want to signout from previous login?",
    icon: "mdi-lightbulb-on-20",
    color: "purple darken-2",
    actionText1: "Proceed to Login",
    actionText2: "Go to Verification",
    actionIcon2: "",
    hideClose: true,
    rejection: false,
  };
  if (await confirm.value.open(options)) {
    navigateTo(`${param}`);
  } else {
    cleanup_user_data();
  }
};
</script>

<style lang="scss" scoped></style>
