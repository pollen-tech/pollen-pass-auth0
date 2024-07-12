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
            <v-col cols="12" md="6" class="text-left">
              <v-sheet>
                <v-btn
                  variant="text"
                  prepend-icon="mdi-chevron-left"
                  style="color: #6b7280"
                  class="text-capitalize"
                  @click="goToPhoneNumberPage()"
                  alt="Back"
                >
                  <template v-slot:prepend>
                    <v-icon color="#6B7280"></v-icon>
                  </template>
                  Previous
                </v-btn>
              </v-sheet>
            </v-col>
          </v-row>
          <AuthOtpPhoneNumber
            v-if="!isOtpPage"
            :phone="user.phone"
            :is-phone-exist="isPhoneExist"
            :is-phone-save="isPhoneSave"
            @otp-event="getPhone"
            @send-otp="sendOtp"
          />
          <!-- TODO add if user exist -->
          <AuthFormOtpCode
            v-if="isOtpPage"
            :referenceId="user.referenceId"
            :phonenumber="user.phone"
            :phoneVerified="user.phoneVerified"
            :isOtpLoading="isOtpLoading"
            :isOtpValid="isOtpValid"
            @previous-page="goToPhoneNumberPage"
            @verify-otp-event="verifyOtp"
            @send-otp-event="resendOtp"
            @set-otp-loading="verifyOtpLoading"
          />
        </div>
      </v-col>
    </v-row>
  </div>
  <NotificationStatus />
</template>

<script>
import { mapState } from "pinia";
import { useCommonStore } from "~/store/common";
import { ppApi } from "~/services/api";
export default {
  setup(props) {
    const commonStore = useCommonStore();

    return { commonStore };
  },
  data: () => ({
    config: null,
    leftText: "Back to Pollen Direct",
    rightText: "Sign Up",
    notificationTitle: "Verify your email address",
    notificationText:
      "Pollen Pass is Pollen’s free buyer membership program. By signing up as a Pollen Pass member on Pollen Direct, buyers gain access to hundreds of catalogs across categories, and can make offers on overstock or near-expiry goods directly to global manufacturers.",
    user: {},
    show1: false,
    show2: true,
    password: "Password",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => `The email and password you entered don't match`,
    },
    confirmText: "Confirm phone number & send OTP",
    enterOtp: "Enter Verification Code",
    otp: null,
    isOtpValid: true,
    isOtpLoading: false,
    isPhoneSave: false,
    otpType: "",
    isOtpPage: false,
    isPhoneExist: false,
  }),
  middleware: ["keycloak"],
  computed: {},
  async mounted() {
    this.config = useRuntimeConfig();
    console.log("runtime", this.config.public);
    console.log(this.id);
    this.isPhoneExist = false;

    if (this.id) {
      const userData = await this.getUserInfo(this.id);
      this.user = userData;
    }

    if (this.user.phoneVerified) {
      navigateTo("/auth/success");
    }
  },
  methods: {
    getPhone(param) {
      this.user.phone = param;
      this.savePhone(param);
    },
    async savePhone(param) {
      const url = `${this.config.public.backendUrl}/otp/${this.id}/phone-number`;
      const body = {
        phoneNumber: param,
      };
      try {
        const req = await api(url, "PATCH", body);
        if (!req.statusCode) {
          if (req.isVerified) {
            this.isOtpValid = false;
            this.isOtpLoading = false;
            setTimeout(() => {
              navigateTo("/auth/success");
            }, 2000);
          } else {
            this.isPhoneSave = true;
            this.isOtpLoading = false;
            return;
          }
        } else {
          this.getErrorMessage(req);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
        this.isOtpLoading = false;
      }
    },
    async verifyOtp(param) {
      this.otp = param;
      this.isOtpValid = true;
      const url = `${this.config.public.backendUrl}/otp/verify`;
      const body = {
        referenceId: this.user.referenceId,
        otp: this.otp,
      };
      try {
        const sendOtpCode = await api(url, "PATCH", body);
        console.log(sendOtpCode);
        if (
          sendOtpCode === undefined ||
          !sendOtpCode.statusCode ||
          sendOtpCode.statusCode === 204 ||
          sendOtpCode.statusCode === 200
        ) {
          setTimeout(() => {
            navigateTo("/auth/success");
          }, 2000);
          this.isOtpValid = false;
          this.isOtpLoading = false;
        } else {
          this.isOtpLoading = false;
          this.getErrorMessage(sendOtpCode);
        }
      } catch (error) {
        this.isOtpLoading = false;
      }
    },
    verifyOtpLoading() {
      this.isOtpLoading = true;
    },
    goToPhoneNumberPage() {
      this.otp = null;
      this.isPhoneExist = false;
      console.log(this.user);
      this.isOtpPage = false;
    },
    async getUserInfo(referenceId) {
      const url = `${this.config.public.ppBackendUrl}/user/reference/${referenceId}`;
      const keyCloakData = await api(url);

      return keyCloakData;
    },
    async resendOtp() {
      this.sendOtp(this.otpType);
    },
    async sendOtp(type = "sms") {
      // type = 'whatsapp'
      const referenceId = this.user.referenceId || this.id;
      this.otpType = type;
      const url = `${this.config.public.backendUrl}/otp/${referenceId}/${type}`;
      const body = {
        referenceId: this.user.referenceId,
        phoneNumber: this.user.phone,
        phoneCountryCode: "PH",
      };

      const otpMessage = await api(url, "POST", body);
      if (!otpMessage.statusCode) {
        this.isOtpPage = true;
        return otpMessage;
      } else {
        this.getErrorMessage(otpMessage);
      }
    },

    getErrorMessage(req) {
      this.isPhoneExist = false;
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
        this.isPhoneExist = true;
      }
      this.commonStore.setShowNotification({
        display: true,
        status: "error",
        msg: errorMsg,
      });
    },
  },
};
</script>

<style scoped></style>
