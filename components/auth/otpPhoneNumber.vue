<template>
  <div>
    <v-sheet class="d-flex flex-column align-center">
      <h3 class="font-weight-bold my-8">
        {{ isPhoneSave ? notificationTitle2 : notificationTitle1 }}
      </h3>
      <v-form ref="form" class="w-50">
        <!--<p class="font-weight-bold text-body-1 text-center mb-6">
          Enter your Information
        </p>-->
        <div class="my-2">
          <div class="d-flex">
            <label class="font-weight-medium text-body-2"
              >Enter your phone number for verification<span class="red--text">*</span>
            </label>
            <v-spacer />
            <v-chip
              v-if="isPhoneExist"
              variant="tonal"
              density="comfortable"
              size="x-small"
              text="number already exist"
              class="pa-2"
              :style="{ backgroundColor: '#FFFBEB', color: '#B45309' }"
            />
          </div>

          <VueTelInput
            v-model="phoneLocal"
            mode="international"
            :required="true"
            :maxLen="20"
            :value="phone"
            :disabledFormatting="true"
            :validCharactersOnly="true"
            :class="phoneValid ? 'phoneStyle pa-2' : 'hasError pa-2'"
            :dropdownOptions="{
              showDialCodeInSelection: true,
              showSearchBox: true,
              showFlags: true,
            }"
            :inputOptions="{
              showFlags: true,
              autocomplete: false,
            }"
            @validate="phoneObject"
            @input="onPhoneInput"
            @country-changed="onCountryChange"
            style="border-radius: 6px !important;"
          />

          <p v-if="!phoneValid" class="red--text text-caption mt-2">
            Field is required
          </p>
        </div>

        <v-btn
          v-if="!isPhoneSave"
          color="#8431E7"
          block
          class="my-4 text-capitalize custom-button"
          :disabled="!phoneValid"
          @click="savePhone"
          >Confirm
        </v-btn>
        <div v-else>
          <p class="font-weight-bold text-center my-4 text-body-2">
            Choose where you want to send the OTP?
          </p>
          <v-radio-group
            v-model="otpType"
            class="align-center justify-center d-flex"
          >
            <v-radio value="1" color="#8431E7" :disabled="!phoneValid">
              <template v-slot:label>
                <div class="text-body-2 my-6">Send OTP via SMS</div>
              </template></v-radio
            >
            <v-divider />
            <v-radio value="2" color="#8431E7" :disabled="!phoneValid">
              <template v-slot:label>
                <div class="text-body-2 my-6">Send OTP via Whatsapp</div>
              </template>
            </v-radio>
            <v-divider />
            <p class="font-weight-bold text-center my-4 text-body-2">OR</p>
            <v-radio value="3" color="#8431E7" :disabled="!phoneValid">
              <template v-slot:label>
                <div class="text-body-2 my-6">Send OTP via Voice Call</div>
              </template>
            </v-radio>
          </v-radio-group>
          <v-btn
            color="#8431E7"
            block
            class="my-4 text-capitalize custom-button"
            :disabled="otpType === null"
            @click="sendOtpRequest"
            >Send OTP
          </v-btn>
        </div>
        <!-- <v-btn
          color="deep-purple-accent-4"
          block
          class="my-4 text-capitalize"
          :disabled="!phoneValid"
          @click="sendOtpViaSms"
          >Send OTP via SMS</v-btn
        >
        <v-btn
          variant="outlined"
          block
          class="my-4 text-capitalize"
          :disabled="!phoneValid"
          @click="sendOtpViaWhatsApp"
          >Send OTP via Whatsapp</v-btn
        > -->
        <p class="text-center grey--text">
          <v-icon class="mx-1">mdi-phone-outline</v-icon>Need Assistance?
          <a
            class="purple-text"
            :href="`https://wa.me/${salesTeamNumber}?text=Hello+Pollen,+I+need+your+assistance+in+signing-up.`"
            target="_blank"
            rel="noopener noreferrer"
            >cs@pollen.tech</a
          >
        </p>
      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import { useUserStore } from '~/store/user';

export default {
  components: { VueTelInput },
  emits: ["otpEvent", "someEvent", "sendOtp"],
  props: {
    phone: {
      type: String,
      readonly: false,
      default: "",
    },
    isPhoneSave: {
      type: Boolean,
      default: false,
    },
    isPhoneExist: {
      type: Boolean,
      default: false,
    },

  },
  //setup(props) {
  //  const userStore = useUserStore();
  //  return { userStore };
  //},
  data() {
    return {
      notificationTitle1: "Phone number Verification",
      notificationTitle2: "Send OTP",
      otp: "",
      phoneValid: true,
      phoneLocal: "",
      salesTeamNumber: "",
      config: null,
      otpType: null,
    };
  },
  methods: {
    phoneObject(object) {
      this.phoneValid = object.valid;
      this.phoneLocal = object?.number;
    },
    sendOtpViaSms() {
      // this.$emit("otpEvent", this.phoneLocal);
      this.$emit("sendOtp", "sms");
    },
    sendOtpViaWhatsApp() {
      // this.$emit("otpEvent", this.phoneLocal);
      this.$emit("sendOtp", "whatsapp");
    },
    sendOtpViaCall() {
      // this.$emit("otpEvent", this.phoneLocal);
      this.$emit("sendOtp", "call");
    },
    sendOtpRequest() {
      if (this.otpType === "1") {
        this.sendOtpViaSms();
      } else if (this.otpType === "2") {
        this.sendOtpViaWhatsApp();
      } else if (this.otpType === "3") {
        this.sendOtpViaCall();
      }
    },
    savePhone() {
    const userStore = useUserStore();
    const user = userStore.getUser();

      //console.log(this.isPhoneSave);
      this.$emit("otpEvent", this.phoneLocal);
      this.$emit('update:isPhoneSave', true);
      console.log(this.phoneLocal)
      const cleanedPhoneNumber = this.phoneLocal.replace(/\s+/g, '');
      console.log(cleanedPhoneNumber)


      console.log(userStore.getUser());
      userStore.setUser({phoneNumber: cleanedPhoneNumber, countryCode: this.countryCode});
      console.log(userStore.getUser());


      //user.countryCode = this.phoneLocal;
      //console.log(this.isPhoneSave);
    },
    onPhoneInput(phone, country) {
      console.log('Phone countryCode:', this.countryCode);
      console.log('Phone number:', this.phoneLocal);
    },
    onCountryChange(country) {
      this.countryCode = country.dialCode;
      console.log(this.countryCode);
    },

  },
  mounted() {
    this.phoneLocal = this.phone || "";
    this.config = useRuntimeConfig();
    this.salesTeamNumber = this.config.public.salesTeamNumber;
  },
};
</script>

<style lang="scss" scoped></style>
