<template>
  <div>
    <CommonLoading v-if="show_login" :loading="true" />
    <!-- <div v-if="!show_login" class="landing-bg h-100">
      <v-container>
        <v-card elevation="0" class="px-1">
          <v-breadcrumbs
            class="text-caption text-purple text-capitalize mb-2"
            :items="['home']"
          >
            <template #prepend>
              <v-icon size="small">mdi-home</v-icon>
            </template>
          </v-breadcrumbs>
          <v-row
            v-if="!userProfile?.id"
            style="background-color: #faf5ff"
            class="rounded-lg align-center pa-4 pb-6 mx-2"
          >
            <v-col cols="1">
              <img
                src="~/assets/images/pollen-pass-original.svg"
                class="mx-4"
              />
            </v-col>
            <v-col cols="11" md="8">
              <p class="font-weight-bold text-body-2 mb-1">
                Log in/Sign Up to your Pollen Pass account and start Selling
                with Pollen's Liquidation Management System
              </p>
              <p class="text-body-2">
                Sign up and get a free LMS account to start listing excess and
                obsolete inventory, and receive offers from Pollen's verified
                buyers around the world. Not a member?
                <a href="#" class="text-purple"> Sign Up now</a>
              </p>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                variant="outlined"
                elevation="0"
                size="small"
                class="text-capitalize"
                @click="onSignUp"
              >
                Sign Up with Pollen Pass</v-btn
              >
            </v-col>
          </v-row>
        </v-card>

        <CommonEmpty />
      </v-container>

    </div> -->

    <CommonConfirm ref="confirm" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/auth0";

const auth = useAuth();
const confirm = ref(null);

const runtimeConfig = useRuntimeConfig();

const isAuthenticated = ref(false);
const show_login = ref(true);

const showDialog = async () => {
  if (!isAuthenticated.value) {
    const options = {
      title: "User cannot Sign Up without channel",
      message:
        "Please connect to the appropriate Pollen Channel before signing in or signing up.",
      icon: "mdi-lightbulb-on-20",
      color: "purple darken-2",
      actionText1: "Go To Pollen Direct (Buyer)",
      actionText2: "Go To LMS (Seller)",
      actionIcon2: "",
      rejection: false,
    };
    if (await confirm.value.open(options)) {
      navigateTo(runtimeConfig.public.pollenLmsUrl, { external: true });
    } else {
      navigateTo(
        runtimeConfig.public.pollenDirectUrl.replace("/redirect", ""),
        { external: true }
      );
    }
  }
};

onMounted(() => {
  show_login.value = false;
  const router = useRouter();
  const searchParams = new URLSearchParams(
    router.currentRoute.value.fullPath.split("?")[1]
  );

  const channel = searchParams.get("channel");
  const action = searchParams.get("action");

  auth.clear_localStorage();
  if (!channel) {
    localStorage.removeItem("channel");
    showDialog();
    return;
  }
  if (channel) {
    localStorage.setItem("channel", channel);

    if (action === "signup") {
      navigateTo("/auth/signup");
    } else {
      navigateTo("/auth/login");
    }
  }
});
</script>

<style lang="scss" scoped></style>
