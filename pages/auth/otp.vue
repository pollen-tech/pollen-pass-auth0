<template>
  <div class="h-100vh">
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
          <v-row no-gutters>
            <v-col cols="12" md="12" class="text-left">
              <v-sheet
                style="
                  display: flex !important;
                  width: 100%;
                  justify-content: space-between;
                "
              >
                <v-btn
                  variant="text"
                  prepend-icon="mdi-chevron-left"
                  style="color: #6b7280"
                  class="text-capitalize"
                  alt="Back"
                  @click="show_validate_signup()"
                >
                  <template #prepend>
                    <v-icon color="#6B7280" />
                  </template>
                  Go back to Login
                </v-btn>
                <v-btn
                  variant="text"
                  prepend-icon="mdi-account-circle-outline"
                  style="color: #6b7280; text-transform: none !important"
                  class="text-capitalize"
                  alt="Account"
                >
                  <template #prepend>
                    <v-icon color="#6B7280" />
                  </template>
                  {{ emailLocal }}
                </v-btn>
              </v-sheet>
            </v-col>
          </v-row>
          <AuthOtpPhoneNumber
            v-if="!isOtpPage"
            :phone="''"
            :is-phone-exist="isPhoneExist"
            :is-phone-save="isPhoneSave"
            @otp-event="getPhone"
            @send-otp="sendOtp"
            @update:is-phone-save="updateIsPhoneSave"
          />
          <!-- TODO add if user exist -->
          <AuthOtpCode
            v-if="isOtpPage"
            :reference-id="user.referenceId"
            :phonenumber="user.phone || user.phoneNumber"
            :phone-verified="user.phoneVerified"
            :is-otp-loading="isOtpLoading"
            :is-otp-valid="isOtpValid"
            @previous-page="goToPhoneNumberPage"
            @verify-otp-event="verifyOtpEvent"
            @send-otp-event="resendOtp"
            @set-otp-loading="verifyOtpLoading"
            @send-welcome-email-event="sendWelcomeEmail"
          />
        </div>
      </v-col>
    </v-row>
    <NotificationStatus />
    <CommonConfirm ref="confirm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCommonStore } from "~/store/common";
import { useUserStore } from "~/store/user";
import { useAuth } from "@/composables/auth0";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: "auth",
});
const router = useRouter();
const auth = useAuth();
const { cleanup_user_data } = auth;
const commonStore = useCommonStore();
const userStore = useUserStore();

const config = useRuntimeConfig();

const user = ref(null);
const emailLocal = computed(
  () => user.value?.email || localStorage.getItem("email")
);

const otp = ref(null);
const isOtpValid = ref(true);
const isOtpLoading = ref(false);
const isPhoneSave = ref(false);
const otpType = ref("");
const isOtpPage = ref(false);
const isPhoneExist = ref(false);
const confirm = ref(null);

onMounted(async () => {
  isPhoneExist.value = false;
  const user_id = auth.get_user_id();
  if (auth.id || user_id) {
    const { data: userProfile } = await userStore.get_user_profile(
      auth.id || user_id
    );
    user.value = userProfile;
    userStore.set_user_email(userProfile.email);
  }
  if (user.value?.phone_verified) {
    router.push("/auth/success");
  }
});

const getPhone = (param) => {
  user.value.phone = param;
  savePhone(param);
};

const savePhone = async (_param) => {
  // Logic to save phone
};

const verifyOtpLoading = () => {
  isOtpLoading.value = true;
};

const goToPhoneNumberPage = () => {
  otp.value = null;
  isPhoneExist.value = false;
  isOtpPage.value = false;
};

const resendOtp = async () => {
  await sendOtp(otpType.value);
};

const sendOtp = async (type = "sms") => {
  otpType.value = type;
  const user = userStore.getUser();

  const payload = {
    country_code: parseInt(user.value?.countryCode, 10),
    phone_no: parseInt(user.value?.phoneNumber, 10),
    method: type,
  };

  try {
    const response = await fetch(`${config.public.API_URL}/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!response.ok) {
      response.message = "Something went wrong while sending OTP";
      getErrorMessage(response);
      throw new Error("Network response was not ok");
    }
    isOtpPage.value = true;
  } catch (error) {
    console.log(error);
  }
};

const sendWelcomeEmail = async (user_id) => {
  const channel_code = get_channel();
  const body = {
    incoming_channel: channel_code,
  };

  try {
    const response = await fetch(
      `${config.public.API_URL}/users/${user_id}/welcome-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log("sent email", response, user_id);
  } catch (error) {
    console.log(error);
  }
};

const verifyOtpEvent = async (otp) => {
  const user_id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const user = userStore.getUser();
  const payload = {
    user_id: user.value?.user_id || user_id,
    country_code: parseInt(user.value?.countryCode, 10),
    phone_no: parseInt(user.value?.phoneNumber, 10),
    otp: otp,
  };

  try {
    const response = await fetch(
      `${config.public.API_URL}/otp/validate-user-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      response.message = "OTP is not valid";
      getErrorMessage(response);
      throw new Error("Network response was not ok");
    }

    isOtpPage.value = true;
    await sendWelcomeEmail(user_id);
    router.push("/auth/success");
  } catch (error) {
    console.log(error);
  }
};

const getErrorMessage = (req) => {
  isPhoneExist.value = false;
  let errorMsg = req.message;
  if (typeof req.message !== "string") {
    const formattedMessages = req.message.map((message) => {
      const words = message.split(" ");
      words[0] = "• " + words[0];
      return words.join(" ");
    });

    errorMsg = formattedMessages.join(",<br/>");
  }
  if (errorMsg === "Phone number exist") {
    isPhoneExist.value = true;
  }
  commonStore.setShowNotification({
    display: true,
    status: "error",
    msg: errorMsg,
  });
};

const updateIsPhoneSave = (value) => {
  isPhoneSave.value = value;
};

const get_channel = () => {
  return typeof window !== "undefined" ? localStorage.getItem("channel") : null;
};
const show_validate_signup = async () => {
  const options = {
    title: "Sign-up is incomplete",
    message:
      "You haven’t completed your phone number verification, are you sure you want to exit this page.",
    icon: "mdi-lightbulb-on-20",
    color: "purple darken-2",
    actionText1: "No, Cancel",
    actionText2: "Yes, Proceed",
    actionIcon2: "",
    hideClose: true,
    rejection: false,
  };
  if (await confirm.value.open(options)) {
    cleanup_user_data();
    navigateTo("/auth/login");
  }
};
</script>

<style scoped></style>
