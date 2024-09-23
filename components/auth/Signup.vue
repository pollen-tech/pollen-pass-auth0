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
            alt="Back"
            @click="redirect()"
          >
            <template #prepend>
              <v-icon color="#6B7280" />
            </template>
            Back to {{ channel == "CH_LMS" ? "LMS" : "Pollen Direct" }}
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <div
      class="d-flex flex-column align-center mx-12"
      :style="{
        'margin-top': $vuetify.display.mobile ? '20px' : '3%',
      }"
    >
      <div class="mb-6">
        <img
          src="~/assets/images/pollen-pass-original.svg"
          class="mx-4"
          style="width: 55px"
        />
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

          <div class="mt-2 mb-4 text-start flex-1-0">
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
              hint="Enter your last name, If no last name please enter NA"
              :persistent-hint="true"
            />
          </div>

          <div class="mt-4 mb-2 text-start flex-1-0">
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
              hint="You will be asked to verify your email address"
              :persistent-hint="true"
            />
          </div>
          <v-checkbox
            v-model="check_accept_terms"
            :rules="[(v) => !!v || 'Checkbox is required']"
            class="custom-text-field checkbox"
          >
            <template #label>
              <div style="font-size: 14px; color: #111827">
                Accept
                <a
                  :href="config.public.privacyPolicy"
                  target="_blank"
                  style="color: #6a27b9"
                  v-bind="props"
                  @click.stop
                >
                  Privacy Policy </a
                >&<a
                  :href="config.public.termCondition"
                  target="_blank"
                  style="color: #6a27b9"
                  v-bind="props"
                  @click.stop
                >
                  Terms and Conditions
                </a>
              </div>
            </template>
          </v-checkbox>
          <v-btn
            class="my-3 me-auto text-capitalize rounded-lg custom-button"
            color="#8431E7"
            block
            :loading="isLoading"
            @click="submit_signup()"
            >Continue</v-btn
          >

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
import { useAuth } from "@/composables/auth0";

const config = useRuntimeConfig();

const auth = useAuth();
const { cleanup_user_data } = auth;

const userStore = useUserStore();
const { validate_email_exist, verify_passwordless_email_login } = userStore;

const common_store = useCommonStore();

const error = ref(null);
const confirm = ref(null);
const form_valid = ref(false);

const channel = computed(() => get_channel());
const title = ref("Enter your information");
const submitted_message = ref();
const item = ref({ items: [] });

const formRef = ref(null);
const isLoading = ref(false);
const check_accept_terms = ref(false);

const required_email = [
  (v) =>
    /^[\w+.-]+@[\w.-]+\.\w{2,}$/.test(v) ||
    "Please enter a valid email address",
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
    if (valid && check_accept_terms.value == true) {
      const valid_email = await validate_email_add_exist();
      if (valid_email) {
        const user = {
          email: item.value.email,
          firstName: item.value.firstName,
          lastName: item.value.lastName,
          channelCode: get_channel(),
        };
        cleanup_user_data();
        userStore.setUser(user);
        const verify_passwordless = await verify_passwordless_email_login(
          item.value.email
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

onMounted(async () => {});
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
