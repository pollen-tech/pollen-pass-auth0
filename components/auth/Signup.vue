<template>
  <div>
    <div
      class="d-flex flex-column align-center mx-16"
      :style="{
        'margin-top': $vuetify.display.mobile ? '20px' : '10%',
      }"
    >
      <div class="text-caption justify-center mb-12 d-flex">
        <img
          v-if="channel === 'CH_LMS'"
          src="~/assets/images/pollen.svg"
          class="mx-4"
          style="width: 50px"
        />
        <img
          v-else
          src="~/assets/images/pollen-direct.svg"
          class="mx-4"
          style="width: 50px"
        />

        <div v-if="channel === 'CH_LMS'">
          <p class="font-weight-bold" style="font-size: 14px">
            {{ lms_notification.title }}
          </p>
          <p>
            {{ lms_notification.desc }}
          </p>
        </div>
        <div v-else>
          <p class="font-weight-bold" style="font-size: 14px">
            {{ direct_notification.title }}
          </p>
          <p>
            {{ direct_notification.desc }}
          </p>
        </div>
      </div>
      <h3 style="color: #111827; font-size: 20px">{{ title }}</h3>
      <v-card
        :width="$vuetify.display.mobile ? 300 : 450"
        elevation="0"
        class="align-center my-4"
      >
        <v-form ref="formRef" v-model="form_valid" lazy-validation>
          <div class="my-2 text-start flex-1-0">
            <label class="font-weight-medium" style="font-size: 14px"
              >First Name
              <span class="red--text">*</span>
            </label>

            <v-text-field
              v-model="item.firstName"
              variant="outlined"
              placeholder="Eg. Kevin"
              :rules="required"
              class="custom-text-field"
              autocomplete="given-name"
            />
          </div>

          <div class="my-2 text-start flex-1-0">
            <label class="font-weight-medium" style="font-size: 14px"
              >Last Name
              <span class="red--text">*</span>
            </label>

            <v-text-field
              v-model="item.lastName"
              variant="outlined"
              placeholder="Eg. King"
              :rules="required"
              class="custom-text-field"
              autocomplete="family-name"
            />
          </div>

          <div class="my-2 text-start flex-1-0">
            <label class="font-weight-medium" style="font-size: 14px"
              >Email
              <span class="red--text">*</span>
            </label>

            <v-text-field
              v-model="item.email"
              variant="outlined"
              placeholder="Enter Email"
              :rules="required_email"
              class="custom-text-field"
              autocomplete="email"
            />
          </div>
          <v-btn
            class="my-4 me-auto text-capitalize rounded-lg custom-button"
            color="#8431E7"
            block
            :loading="isLoading"
            @click="submit_signup()"
            >Continue</v-btn
          >
          <p class="text-center" style="color: #111827; font-size: 14px">
            Already have Pollen Pass account ?
            <a href="/auth/login" class="link">Sign In with Pollen Pass</a>
          </p>
          <p class="red--text text-caption text-center">{{ error }}</p>
          <p class="text-green-lighten-1 text-caption text-center">
            {{ submitted_message }}
          </p>
        </v-form>
      </v-card>

      <NotificationStatus />
      <SmallDialog ref="confirm" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import SmallDialog from "@/components/common/SmallDialog.vue";
import { useCommonStore } from "@/store/common";

const userStore = useUserStore();
const { validate_email_exist, verify_passwordless_email_login, cleanupUser } =
  userStore;

const common_store = useCommonStore();

const error = ref(null);
const confirm = ref(null);
const form_valid = ref(false);

const channel = computed(() => get_channel());
const title = ref("Enter your information");
const lms_notification = ref({
  title: "How to Start Selling with Pollen's Liquidation Management System",
  desc: "Sign up and get a free LMS account to start listing excess and obsolete inventory, and receive offers from Pollen's verified buyers around the world",
  message: "",
});
const direct_notification = ref({
  title:
    "Get exclusive access to the latest Pollen Direct liquidation inventory catalogs with Pollen Pass",
  desc: "Pollen Pass is Pollen’s free buyer membership program. By signing up as a Pollen Pass member on Pollen Save. Pollen Save delivers excess or discontinued products from global brands direct to your doorstep. Whether you're looking for shampoo, conditioner, face wash, make up, toys, shoes, or more - there's something for everyone at unbeatable prices on Pollen Save!",
  message: "",
});
const submitted_message = ref();
const item = ref({ items: [] });

const formRef = ref(null);
const isLoading = ref(false);

const required_email = [
  (v) => /^[\w+.-]+@[\w.-]+\.\w{2,}$/.test(v) || "Valid E-mail is required",
];
const required = [(v) => !!v || "Field is required"];

const validate_email_add_exist = async () => {
  try {
    const req = await validate_email_exist(item.value.email);
    if (req.status_code == "OK") {
      const options = {
        title: "Email address already exist?",
        message:
          "Looks like the email address you are about to register already exist. For assistance please send us a message at contact@pollen.tech",
        icon: "",
        color: "purple darken-2",
        actionText1: "Login",
        actionText2: "Contact CS",
        actionIcon2: "",
        rejection: false,
      };
      if (await confirm.value.open(options)) {
        window.location.href = "mailto:contact@pollen.tech";
      } else {
        navigateTo("/auth/login");
      }
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

const submit_signup = async () => {
  try {
    isLoading.value = true;
    const { valid } = await formRef.value.validate();
    if (valid) {
      const valid_email = await validate_email_add_exist();
      if (valid_email) {
        const user = {
          email: item.value.email,
          firstName: item.value.firstName,
          lastName: item.value.lastName,
          channelCode: get_channel(),
        };
        userStore.setUser(user);
        const verify_passwordless = await verify_passwordless_email_login(
          item.value.email,
        );
        if (verify_passwordless.status_code != "LOGIN_ERROR") {
          navigateTo("/auth/verification");
        } else {
          common_store.setShowNotification({
            display: true,
            status: "error",
            msg: verify_passwordless,
          });
        }
      }
      isLoading.value = false;
    } else {
      isLoading.value = false;
    }
  } catch (err) {
    isLoading.value = false;
    console.log(err);
  }
};

const get_channel = () => {
  if (typeof window !== "undefined") {
    const channel = localStorage.getItem("channel")
      ? localStorage.getItem("channel")
      : "POLLEN_PASS";
    return channel;
  }
};

onMounted(async () => {
  cleanupUser();
});
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
