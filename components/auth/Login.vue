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
      <p style="color: #111827; font-size: 14px">{{ desc }}</p>

      <v-card
        :width="$vuetify.display.mobile ? 300 : 450"
        elevation="0"
        class="align-center my-4"
      >
        <v-form ref="form">
          <div class="my-4 text-start flex-1-0">
            <label class="font-weight-medium" style="font-size: 14px"
              >Enter Email Address
              <!--<span class="red--text">*</span>-->
            </label>

            <v-text-field
              v-model="email"
              variant="outlined"
              placeholder="Enter valid email address"
              :rules="required"
              class="custom-text-field"
            />
          </div>
          <!--<v-checkbox
            v-model="checkAcceptTerms"
            hide-details
            @change="checkTerms()"
          >
            <template v-slot:label>
              <div>
                Accept Pollen
                <a
                  href="https://www.pollen.tech/privacy"
                  target="_blank"
                  style="color: #6a27b9"
                  v-bind="props"
                  @click.stop
                >
                  Terms and Conditions
                </a>
              </div>
            </template>
          </v-checkbox>-->
          <v-btn
            class="my-4 me-auto text-capitalize rounded-lg custom-button"
            color="#8431E7"
            block
            :loading="isLoading"
            @click="submit"
            >Sign in</v-btn
          >
          <p class="text-center" style="color: #111827; font-size: 14px">
            Want to access Pollen LMS?
            <a href="/auth/signup" class="link">Sign Up with Pollen Pass</a>
          </p>
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
            <v-spacer />
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
import { useAuth } from "@/composables/auth0";

//import { useSellerStore } from "@/store/seller";
//import { useCountryStore } from "@/store/country";

const emit = defineEmits(["submit"]);

//const countryStore = useCountryStore();
//const { countries } = storeToRefs(countryStore);

//const sellerStore = useSellerStore();

const auth = useAuth();
const channel = computed(() => auth.get_channel());

const title = ref("Login");
const desc = ref("Login to your Pollen Pass account");

const lms_notification = ref({
  title: "How to Start Selling with Pollen's Liquidation Management System",
  desc: "Sign up and get a free LMS account to start listing excess and obsolete inventory, and receive offers from Pollen's verified buyers around the world",
});
const direct_notification = ref({
  title:
    "Get exclusive access to the latest Pollen Direct liquidation inventory catalogs with Pollen Pass",
  desc: "Pollen Pass is Pollen’s free buyer membership program. By signing up as a Pollen Pass member on Pollen Save. Pollen Save delivers excess or discontinued products from global brands direct to your doorstep. Whether you're looking for shampoo, conditioner, face wash, make up, toys, shoes, or more - there's something for everyone at unbeatable prices on Pollen Save!",
});
const email = ref("");
//const rules = reactive({
//  required: (value) => !!value || "Required.",
//  min: (v) => v.length >= 8 || "Min 8 characters",
//  emailMatch: () => `The email and password you entered don't match`,
//});
const required = [(v) => !!v || "Field is required"];
const isLoading = ref(false);
const showDialog = ref(false);
//const validateCompanyName = ref(0);
//const selectedItem = ref(null);
//const checkAcceptTerms = ref(false);

//const fetchCity = async (val) => {
//  items.value.city = null;
//  if (val) {
//    cities.value = await countryStore.getCities(val);
//  }
//};

const submit = () => {
  isLoading.value = true;
  emit("submit", email.value);
  setTimeout(() => {
    isLoading.value = false;
  }, 7000);
};

//const onValidateCompanyName = () => {
//  console.log(item.value);
//  validateCompanyName.value = 2;
//};

//const checkTerms = () => {};

onMounted(async () => {
  //countryStore.getCountries();
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
.custom-text-field .v-input__control .v-field__field,
.custom-text-field .v-input__control .v-field__field input {
  max-height: 40px !important;
  min-height: 40px !important;
}
.custom-button {
  height: 40px !important;
  font-size: 16px !important;
  padding: 8px 20px;
  border-radius: 6px !important;

  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}
.link {
  color: #8431e7 !important;
  text-decoration: none;
}
</style>
