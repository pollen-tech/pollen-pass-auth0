<!--<template>
  <div>
    <AppLoading :loading="loading" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const loading = ref(true);
</script>

<style lang="scss" scoped></style>-->

<template>
  <div class="landing-bg h-100">
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
            <img src="~/assets/images/pollen-pass-original.svg" class="mx-4" />
          </v-col>
          <v-col cols="11" md="8">
            <p class="font-weight-bold text-body-2 mb-1">
              Log in/Sign Up to your Pollen Pass account and start Selling with
              Pollen's Liquidation Management System
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

    <CommonConfirm ref="confirm" />
  </div>
</template>

<script setup>
const confirm = ref(null);
import { useNuxtApp } from "#app";

const nuxtApp = useNuxtApp();
const runtimeConfig = useRuntimeConfig();

const isAuthenticated = ref(false);
const userProfile = ref({ firstName: "" });

const showDialog = async () => {
  if (isAuthenticated) {
    const options = {
      title: `Congratulations ${userProfile.value.firstName}!`,
      message: `You are now a member of Pollen Pass with access to Pollen LMS (Liquidation Management System). <br/><br/> Start listing excess and obsolete inventory, and receive offers from Pollen's verified buyers around the world.`,
      icon: "mdi-lightbulb-on-20",
      color: "purple darken-2",
      actionText1: "Explore",
      actionText2: "",
      actionIcon2: "",
      rejection: false,
    };
    //if (await confirm.value.open(options)) {
    //}
  }
};

const onSignUp = () => {};

onMounted(() => {
  showDialog();
});
</script>

<style lang="scss" scoped></style>