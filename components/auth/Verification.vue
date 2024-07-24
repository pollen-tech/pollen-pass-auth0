<template>
  <div>
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
            @click="returnToSignup()"
            alt="Back"
          >
            <template v-slot:prepend>
              <v-icon color="#6B7280"></v-icon>
            </template>
            Previous
          </v-btn>
          <v-btn
            variant="text"
            prepend-icon="mdi-account-circle-outline"
            style="color: #6b7280; text-transform: none !important"
            class="text-capitalize"
            alt="Back"
          >
            <template v-slot:prepend>
              <v-icon color="#6B7280"></v-icon>
            </template>
            {{ emailLocal }}
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <div
      class="d-flex flex-column align-center mx-16"
      :style="{
        'margin-top': $vuetify.display.mobile ? '20px' : '10%',
      }"
    >
      <h3>{{ title }}</h3>
      <p class="text-center my-6" style="color: #6b7280">
        We have sent a 6-digit code to:
      </p>
      <div class="my-2">
        <p class="font-weight-bold text-center mb-4">
          {{ user?.email }}
        </p>
      </div>
      <v-card
        :width="$vuetify.display.mobile ? 300 : 450"
        elevation="0"
        class="align-center mb-4"
      >
        <v-form ref="form">
          <div class="my-4 text-start flex-1-0">
            <v-otp-input
              v-model="item.emailOTPCode"
              :length="otpLength"
              :rules="required"
            ></v-otp-input>
          </div>

          <div class="text-center my-4 grey--text">
            <p>
              Didn’t receive a code?
              <span v-if="timerRunning" class="black--text">
                Resend in <span class="font-weight-bold">{{ formatTime }}</span>
              </span>
              <v-btn
                v-else
                class="purple-text text-capitalize text-body-1 pa-0"
                variant="text"
                @click="resendEmailOtp"
                >Resend OTP</v-btn
              >
            </p>
            <p>
              Incorrect email address?
              <v-btn
                class="purple-text text-capitalize text-body-1 pa-0"
                variant="text"
                @click="returnToSignup"
                >Return to Sign Up form</v-btn
              >
            </p>
          </div>
          <v-btn
            class="my-4 me-auto text-capitalize rounded-lg custom-button"
            color="#8431E7"
            block
            :loading="isLoading"
            @click="submit"
            >Continue</v-btn
          >
        </v-form>
      </v-card>

      <v-dialog
        v-model="showDialog"
        persistent
        class="mx-auto pa-2"
        :width="$vuetify.display.mobile ? 'auto' : '550'"
      >
        <v-card :title="dialogTitle">
          <v-card-text>
            <p>
              Acknowledgment that the user has successfully filled out the
              onboarding form, indicating readiness to proceed with the next
              steps in the user journey.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              class="ma-2 text-capitalize"
              href="/profile"
              >Go to Profile</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRuntimeConfig } from "#app";
import { useUserStore } from "@/store/user";
import { useAuth } from "@/composables/auth0";

const auth = useAuth();
const userStore = useUserStore();
const user = userStore.getUser();

const data = ref(null);
const error = ref(null);
const loading = ref(true);
const config = useRuntimeConfig();

const otp = ref("");
const otpLength = ref(6);
const totalTime = ref(120);
const remainingTime = ref(120);
const timerRunning = ref(false);
const timerInterval = ref(null);
const channel = auth.get_channel();

const emit = defineEmits(["submit", "sendEmailOtpEvent"]);

const title = ref("Enter Verification Code");
const item = ref({ items: [] });
const required = [(v) => !!v || "Field is required"];
const isLoading = ref(false);
const showDialog = ref(false);

const emailLocal = user?.email || localStorage.getItem("email");

const submit = async () => {
  isLoading.value = true;
  console.log(user);
  let email = user.email;
  let firstName = user.firstName;
  let lastName = user.lastName;

  let otp = item.value.emailOTPCode;
  let channel_code = user.channelCode;

  try {
    console.log("params: ", email, otp, firstName, lastName );
    console.log(
      `${config.public.API_URL}/auth0/pollen-pass/password-less-email-otp-validate/${email}?code=${otp}&first_name=${firstName}&last_name=${lastName}`
    );
    console.log(
      JSON.stringify({
        email: email,
        code: otp,
        first_name: firstName,
        last_name: lastName,
      })
    );
    const response = await fetch(
      `${config.public.API_URL}/auth0/pollen-pass/password-less-email-otp-validate/${email}?code=${otp}&first_name=${firstName}&last_name=${lastName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    isLoading.value = false;
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data.value = await response.json();

    auth.handleAuth0Response(data.value);
    console.log("data.value.user_id: ", data.value.user_id);
    userStore.setUser({ user_id: data.value.user_id });
    console.log("userStore.getUser(): ", userStore.getUser());

    if (data.value?.phone_verified) {
      redirect();
    } else {
      navigateTo("/auth/otp");
    }
    emit("submit");
  } catch (err) {
    emit("submit");

    error.value = "Failed to fetch data";
  }
};

const redirect = () => {
  let redirect_url = "";

  if (channel === "CH_POLLEN_DIRECT") {
    redirect_url = config.public.pollenDirectUrl;
  } else {
    redirect_url = config.public.pollenLmsUrl;
  }
  const url = new URL(redirect_url);
  url.searchParams.append("user_id", auth.get_user_id());
  url.searchParams.append("access_token", auth.get_access_token());
  url.searchParams.append("expires_at", auth.get_expire_at());
  console.log(url.toString());
  navigateTo(url.toString(), { external: true });
};

const formatTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
});

const startTimer = () => {
  if (!timerRunning.value) {
    timerRunning.value = true;
    timerInterval.value = setInterval(updateTimer, 1000);
  }
};

const updateTimer = () => {
  if (remainingTime.value > 0) {
    remainingTime.value--;
  } else {
    timerRunning.value = false;
    clearInterval(timerInterval.value);
  }
};

const resendEmailOtp = async () => {
  console.log("resendEmailOtp");
  console.log(user);
  console.log(userStore.getUser());

  remainingTime.value = totalTime.value;
  await emit("sendEmailOtpEvent");
  startTimer();
  otp.value = "";

  let email = user.email;
  //Run API
  try {
    const response = await fetch(
      `${config.public.API_URL}/auth0/password-less-email-login/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data.value = await response.json();
  } catch (err) {
    error.value = "Failed to fetch data";
  }
};

const returnToLogin = () => {
  navigateTo("/auth/login");
};
const returnToSignup = () => {
  navigateTo("/auth/login");
};

const get_channel = () => {
  if (typeof window !== "undefined") {
    const channel = localStorage.getItem("channel");
    return channel;
  }
};
</script>
<style>
.custom-icon > .v-overlay__content {
  background: #6b7280 !important; /* Change this to your desired background color */
  color: #fff; /* Change this to your desired text color */
  border-radius: 8px !important;
  padding: 8px !important;
  font-size: 12px !important;
}

/* Optional: Customize the tooltip arrow */
.custom-icon .v-overlay__content::after {
  content: "◀"; /* Unicode arrow left character */
  font-family: "Material Icons"; /* Material Icons font family */
  color: #6b7280; /* Match this with your tooltip background color */
  position: absolute;
  top: 55%;
  left: -12px; /* Position arrow on the right side */
  transform: translateY(-50%);
  font-size: 16px; /* Adjust the size of the arrow icon */
}
</style>
