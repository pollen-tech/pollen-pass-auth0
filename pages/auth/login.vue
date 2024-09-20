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
    <NotificationStatus />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { lmsApi } from "~/services/api";
import { useUserStore } from "@/store/user";
import { useAuth } from "@/composables/auth0";
import { useCommonStore } from "@/store/common";

definePageMeta({
  middleware: "auth",
});
const userStore = useUserStore();
const { user, getUserLocalStorage } = userStore;

const common_store = useCommonStore();

const auth = useAuth();

const is_email_sent = ref(false);
const email = ref("");

onMounted(() => {
  const channel = auth.get_channel();
  if (!channel) {
    show_dialog();
  }

  const user_local = getUserLocalStorage();
  if (user == null && user_local != null) {
    userStore.setUser(user_local);
  }
});

const send_otp = async (param) => {
  try {
    email.value = param;
    const req = await lmsApi(
      `/auth0/password-less-email-login/${email.value}`,
      "POST",
    );
    if (!req.error) {
      const user = {
        email: email.value,
        channelCode: get_channel() || "POLLEN_PASS",
      };
      userStore.setUser(user);
      is_email_sent.value = true;
    } else {
      show_error(req);
    }
  } catch (err) {
    console.log(err);
    show_error(err);
  }
};

const get_channel = () => {
  if (typeof window !== "undefined") {
    const channel = localStorage.getItem("channel");
    return channel;
  }
};

const show_error = (req) => {
  let errorMsg = req.message;
  if (typeof req.message !== "string") {
    const formattedMessages = req.message.map((message) => {
      const words = message.split(" ");
      words[0] = "• " + words[0];
      return words.join(" ");
    });

    errorMsg = formattedMessages.join(",<br/>");
  }
  common_store.setShowNotification({
    display: true,
    status: "error",
    msg: errorMsg,
  });
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
</script>

<style lang="scss" scoped></style>
