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
                  @click="goToPrevious()"
                >
                  <template #prepend>
                    <v-icon color="#6B7280" />
                  </template>
                  Previous
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
            :phone="user.phone"
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
            :phonenumber="user.phone"
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
  </div>
</template>

<script>
import { useCommonStore } from "~/store/common";
import { useUserStore } from "~/store/user";

export default {
  middleware: ["keycloak"],
  setup(_props) {
    const commonStore = useCommonStore();
    const userStore = useUserStore();
    const config = useRuntimeConfig();
    const data = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const user = userStore.getUser();
    const emailLocal = user?.email || localStorage.getItem("email");

    return { commonStore, userStore, config, data, error, loading, emailLocal };
  },
  data: () => ({
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
      emailMatch: () => "The email and password you entered don't match",
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
    async savePhone(_param) {},
    //async verifyOtp(param) {
    //  this.otp = param;
    //  this.isOtpValid = true;
    //  const url = `${this.config.public.backendUrl}/otp/verify`;
    //  const body = {
    //    referenceId: this.user.referenceId,
    //    otp: this.otp,
    //  };
    //  try {
    //    const sendOtpCode = await api(url, "PATCH", body);
    //    console.log(sendOtpCode);
    //    if (
    //      sendOtpCode === undefined ||
    //      !sendOtpCode.statusCode ||
    //      sendOtpCode.statusCode === 204 ||
    //      sendOtpCode.statusCode === 200
    //    ) {
    //      setTimeout(() => {
    //        navigateTo("/auth/success");
    //      }, 2000);
    //      this.isOtpValid = false;
    //      this.isOtpLoading = false;
    //    } else {
    //      this.isOtpLoading = false;
    //      this.getErrorMessage(sendOtpCode);
    //    }
    //  } catch (error) {
    //    this.isOtpLoading = false;
    //  }
    //},
    verifyOtpLoading() {
      //this.isOtpLoading = true;
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
      console.log("sendSMS");
      this.otpType = type;
      const user = this.userStore.getUser();

      const payload = {
        country_code: parseInt(user.countryCode, 10),
        phone_no: parseInt(user.phoneNumber, 10),
        method: type,
      };

      try {
        const response = await fetch(`${this.config.public.API_URL}/otp/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          mode: "cors",
        });

        if (!response.ok) {
          response.message = "Something went wrong while sending OTP";
          this.getErrorMessage(response);
          throw new Error("Network response was not ok");
        }
        this.isOtpPage = true;
      } catch (error) {
        console.log(error);
      }
    },
    async sendWelcomeEmail(user_id) {
      try {
        const response = await fetch(
          `${this.config.public.API_URL}/users/${user_id}/welcome-email`,
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
        console.log("sent email");
        console.log(response);
        console.log(user_id);
      } catch (error) {
        console.log(error);
      }
    },
    async verifyOtpEvent(otp) {
      //console.log('verifyOtpEvent: ', otp, this.userStore.getUser().user_id);
      const user_id =
        typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
      const user = this.userStore.getUser();
      const payload = {
        user_id: user.user_id || user_id,
        country_code: parseInt(user.countryCode, 10),
        phone_no: parseInt(user.phoneNumber, 10),
        otp: otp,
      };
      try {
        const response = await fetch(
          `${this.config.public.API_URL}/otp/validate-user-otp`,
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
          this.getErrorMessage(response);
          throw new Error("Network response was not ok");
        }
        //this.data.value = await response.json();
        this.isOtpPage = true;
        this.sendWelcomeEmail(user_id);
        //console.log('auth/success');
        //console.log(response);
        //console.log(user_id);

        navigateTo("/auth/success");
      } catch (error) {
        console.log(error);
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
    updateIsPhoneSave(value) {
      this.isPhoneSave = value;
    },
    goToPrevious() {
      navigateTo("/auth/login");
    },
  },
};
</script>

<style scoped></style>
