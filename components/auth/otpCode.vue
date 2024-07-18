<template>
  <div>
    <v-sheet class="d-flex flex-column align-center">
      <h3 class="font-weight-bold my-8">{{ notificationTitle }}</h3>
      <v-form ref="form" class="w-50 text-body-1">
        <p class="text-center mb-6">We have sent a 6-digit code to:</p>
        <div class="my-2">
          <p class="font-weight-bold text-center mb-4">
            {{ phonenumber }}
          </p>
        </div>
        <v-otp-input
          v-model="otp"
          :length="otpLength"
          :loading="isOtpLoading"
        ></v-otp-input>

        <p v-if="!isOtpValid" class="red--text text-caption mt-2 text-center">
          OTP is invalid
        </p>

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
              @click="resendOtp"
              >Resend OTP</v-btn
            >
          </p>

          <p>
            Incorrect phone number?
            <v-btn
              class="purple-text text-capitalize text-body-1 pa-0"
              variant="text"
              @click="$emit('previousPage')"
              >Return to Sign Up form</v-btn
            >
          </p>
        </div>
        <v-btn
          block
          class="my-4 me-auto"
          color="deep-purple-accent-4 text-capitalize"
          :disabled="otp.length < otpLength || isOtpLoading"
          @click="sendPhoneNumber"
          >Continue</v-btn
        >
        <v-btn
          block
          variant="outlined"
          class="my-4 me-auto"
          color="deep-purple-accent-4 text-capitalize"
          @click="goToPhoneNumberPage"
          >Verify OTP another way</v-btn
        >
      </v-form>
    </v-sheet>
  </div>
</template>
<script>
//import { useUserStore } from '@/store/user';

//const userStore = useUserStore();
//const user = userStore.getUser();

export default {
  props: {
    phonenumber: { type: String, default: "" },
    referenceId: { type: String, default: "" },
    isOtpValid: { type: Boolean, default: true },
    isOtpLoading: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    otpType: { type: String, default: "sms" },
  },
  emits: ["verifyOtpEvent", "previousPage", "setOtpLoading", "sendOtpEvent"],
  data() {
    return {
      notificationTitle: "Enter Verification Code",
      otp: "",
      otpLength: 6,
      totalTime: 120, // 2 minutes in seconds
      remainingTime: 120,
      timerRunning: false,
      timerInterval: null,
      config: null,
    };
  },
  computed: {
    formatTime() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    },
  },
  async mounted() {
    this.startTimer();
    this.config = useRuntimeConfig();
  },
  methods: {
    sendPhoneNumber() {
      console.log('sendPhoneNumber: ', this.otp);
      this.$emit("setOtpLoading", true);

      this.$emit("verifyOtpEvent", this.otp);
    },
    startTimer() {
      if (!this.timerRunning) {
        this.timerRunning = true;
        this.timerInterval = setInterval(this.updateTimer, 1000);
      }
    },
    updateTimer() {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.timerRunning = false;
        clearInterval(this.timerInterval);
      }
    },
    async resendOtp() {
      this.remainingTime = this.totalTime;
      await this.$emit("sendOtpEvent");
      this.startTimer();
      this.otp = "";
    },
    goToPhoneNumberPage() {
      this.$emit("previousPage");
    },
  },
};
</script>

<style lang="scss" scoped></style>
