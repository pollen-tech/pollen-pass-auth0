<template>
  <div>
    <CommonLoading v-if="isLoading" :loading="true" />
    <div
      class="d-flex flex-column align-center mx-16"
      :style="{
        'margin-top': $vuetify.display.mobile ? '20px' : '10%',
      }"
    >
      <div class="text-caption justify-center mb-12 d-flex">
        <img
          src="~/assets/images/pollen.svg"
          class="mx-4"
          style="width: 50px"
        />
        <div>
          <p class="font-weight-bold" style="font-size: 14px">
            {{ notification.title }}
          </p>
          <p>
            {{ notification.desc }}
          </p>
        </div>
      </div>
      <h3 style="font-size: 20px">{{ title }}</h3>

      <v-card
        :width="$vuetify.display.mobile ? 300 : 450"
        elevation="0"
        class="align-center my-4"
      >
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <div class="my-4 text-start flex-1-0">
            <label class="font-weight-medium"
              >First Name<span class="red--text">*</span>
            </label>

            <v-text-field
              v-model="item.firstName"
              variant="outlined"
              placeholder="Eg. Kevin"
              :rules="rules.required"
              class="custom-text-field"
              autocomplete="given-name"
            ></v-text-field>
          </div>

          <div class="my-4 text-start flex-1-0">
            <label class="font-weight-medium"
              >Last Name<span class="red--text">*</span>
            </label>

            <v-text-field
              v-model="item.lastName"
              variant="outlined"
              placeholder="Eg. King"
              :rules="rules.required"
              class="custom-text-field"
              autocomplete="family-name"
            ></v-text-field>
          </div>

          <div class="my-4 text-start flex-1-0">
            <label class="font-weight-medium"
              >Email<span class="red--text">*</span>
            </label>

            <v-text-field
              v-model="item.email"
              variant="outlined"
              :rules="[...rules.required, rules.email]"
              class="custom-text-field"
              autocomplete="email"
            ></v-text-field>
          </div>

          <v-btn
            class="my-4 me-auto text-capitalize rounded-lg custom-button"
            color="#8431E7"
            block
            :loading="isLoading"
            @click="onValidateExistEmail()"
            >Continue</v-btn
          >
          <p class="red--text text-caption text-center">{{ error }}</p>
          <p class="text-green-lighten-1 text-caption text-center">
            {{ notification.message }}
          </p>
        </v-form>
      </v-card>
      <SmallDialog />

      <!--<v-dialog
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
      </v-dialog>-->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useSellerStore } from "@/store/seller";
import { useCountryStore } from "@/store/country";
import { useUserStore } from "@/store/user";
import { useRuntimeConfig } from "#app";
import SmallDialog from "@/components/common/SmallDialog.vue";
import { useDialogStore } from "@/store/dialog";

const dialogStore = useDialogStore();
const userStore = useUserStore();

let email = "";
let firstName = "";
let lastName = "";

const data = ref(null);
const error = ref(null);
const loading = ref(true);
const config = useRuntimeConfig();

const emit = defineEmits(["submit"]);

const countryStore = useCountryStore();
const { countries } = storeToRefs(countryStore);

const sellerStore = useSellerStore();

const title = ref("Enter your information");
const notification = ref({
  title: "How to Start Selling with Pollen's Liquidation Management System",
  desc: "Sign up and get a free LMS account to start listing excess and obsolete inventory, and receive offers from Pollen's verified buyers around the world",
  message: "",
});
const item = ref({ items: [] });
const valid = ref(false);
const rules = reactive({
  required: [(v) => !!v || "Field is required"],
  //min: (v) => v.length >= 8 || "Min 8 characters",
  email: [
    (v) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "E-mail must be valid",
  ],
});
const formRef = ref(null);
const isLoading = ref(false);
//const showDialog = ref(false);
const validateCompanyName = ref(0);
const selectedItem = ref(null);
const smallDialog = ref(false);

const showDialog = () => {
  console.log("showDialog");
  dialogStore.showDialog(
    "Email address already exist",
    'Looks like the email address you are about to register already exist. for assistance please send us a message at <a href="mailto:cs@pollen.tech">cs@pollen.tech.</a>'
  );
};

const onValidateExistEmail = async () => {
  isLoading.value = true;

  const { valid } = await formRef.value.validate();

  if (!valid) {
    console.log("Form is invalid");
    error.value = "Form is invalid";
    isLoading.value = false;
    return;
  } else {
    error.value = "";
    notification.value.message = "Form was submitted successfully";
    isLoading.value = false;
  }

  let email = item.value.email;

  try {
    const response = await fetch(
      `${config.public.API_URL}/users/pollen-pass-by-email/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    data.value = await response.json();

    console.log(data.value.status_code);

    if (data.value.status_code === "OK") {
      console.log("showDialog");
      showDialog();
    } else {
      console.log("submit");
      submit();
    }
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    error.value = "Failed to fetch data";
    console.log(err);
  }
};

const submit = async () => {
  emit("submit", item.value);
  const user = {
    email: item.value.email,
    firstName: item.value.firstName,
    lastName: item.value.lastName,
    channelCode: get_channel(),
  };
  userStore.setUser(user);
  console.log(get_channel());
  console.log(user);
  let email = item.value.email;

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

    if (data.value.status_code === "LOGIN_ERROR") {
      throw new Error("LOGIN ERROR");
    }
    isLoading.value = false;
    navigateTo("/auth/verification");
  } catch (err) {
    isLoading.value = false;
    error.value = "Failed to fetch data";
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
