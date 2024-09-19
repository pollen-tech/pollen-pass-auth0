<template>
  <div>
    <v-sheet v-if="otp_valid" class="d-flex flex-column align-center">
      <h3 class="font-weight-bold my-8">{{ componentTitle }}</h3>

      <div class="d-flex flex-column align-center">
        <v-card elevation="0">
          <div class="bg-signup-container rounded-lg">
            <div class="d-flex align-end flex-column">
              <img
                src="~/assets/images/avatar_pollen_white.webp"
                alt="Pollen image"
                width="50px"
              />
            </div>
            <div class="text-white">
              <h3>{{ user.name }}</h3>
              <p class="py-1">{{ user.email }}</p>
              <p class="py-1">{{ user.phonenumber }}</p>
            </div>

            <v-row class="text-white mt-10">
              <v-col cols="12" md="6" class="font-weight-medium">
                <h4>Member ID: {{ user.memberid }}</h4>
              </v-col>
              <v-col cols="12" md="6" class="font-weight-medium text-truncate">
                <p class="text-truncate">Member since: {{ user.createdate }}</p>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <div class="d-flex justify-center mb-6">
          <v-sheet class="ma-2 pa-2 align-center text-center">
            <p class="py-4 px-10 grey--text" style="width: 500px">
              {{ componentDescription }}
            </p>
            <v-btn
              color="deep-purple-accent-4"
              class="my-4 px-10 text-capitalize rounded-lg"
              @click="redirect"
            >
              Proceed to
              {{ channel === "CH_LMS" ? "LMS" : "Pollen Direct" }}
              Onboarding
            </v-btn></v-sheet
          >
        </div>
      </div>
    </v-sheet>
    <CommonConfirm ref="confirm" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useAuth } from "@/composables/auth0";
import moment from "moment";

const componentTitle = ref("Welcome to Pollen Pass!");
const user = ref({
  name: "",
  email: "",
  phonenumber: "",
  memberid: "",
  createdate: "",
});
const config = ref(null);
const channel = ref(null);
const confirm = ref(null);
const otp_valid = ref(false);

const userStore = useUserStore();
const { get_user_profile } = userStore;
const auth = useAuth();

const componentDescription = computed(() => {
  return `We will redirect you to ${
    channel.value === "CH_LMS" ? "Pollen LMS" : "Pollen Direct"
  } onboarding page in 5 second(s). If you are not automatically redirected, please click the button below.`;
});

onMounted(async () => {
  config.value = useRuntimeConfig();
  channel.value = auth.get_channel();

  const userId = userStore.getUser()?.user_id || auth.get_user_id();
  await fetchUserInfo(userId);
});

const fetchUserInfo = async (userId) => {
  try {
    const response = await get_user_profile(userId);
    if (response.status_code == "OK") {
      const userData = response?.data || {};

      if (!userData.phone_no) {
        show_validate_phone();
        otp_valid.value = false;
      } else {
        const formattedDate = moment(userData.created_at).format("DD/MM/YYYY");
        otp_valid.value = true;

        console.log(userData);
        user.value = {
          name: `${userData.first_name || "-"} ${userData.last_name || "-"}`,
          email: userData.email,
          phonenumber: `+${userData.country_code} ${userData.phone_no}`,
          memberid: userData.pollen_pass_id,
          createdate: formattedDate,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};

const show_validate_phone = async () => {
  const options = {
    title: "User OTP phone validation is not complete",
    message:
      "Please complete the OTP phone validation before accessing this page.",
    icon: "mdi-lightbulb-on-20",
    color: "purple darken-2",
    actionText1: "Go to login",
    actionText2: "Go to OTP",
    actionIcon2: "",
    hideClose: true,
    rejection: false,
  };
  if (await confirm.value.open(options)) {
    navigateTo("/auth/otp");
  } else {
    navigateTo("/auth/login");
  }
};

const redirect = () => {
  const runtimeConfig = useRuntimeConfig();
  const channelValue = auth.get_channel();
  let redirect_url = "";

  if (channelValue === "CH_DIRECT") {
    redirect_url = runtimeConfig.public.pollenDirectUrl;
  } else {
    redirect_url = runtimeConfig.public.pollenLmsUrl;
  }

  const url = new URL(redirect_url);
  url.searchParams.append("user_id", auth.get_user_id());
  url.searchParams.append("access_token", auth.get_access_token());
  url.searchParams.append("expires_at", auth.get_expire_at());
  navigateTo(url.toString(), { external: true });
};
</script>

<style lang="scss" scoped></style>
