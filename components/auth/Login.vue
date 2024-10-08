<template>
  <div>
    <div
      class="d-flex flex-column align-center mx-12"
      :style="{
        'margin-top': $vuetify.display.mobile ? '75px' : '10%',
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
      <p style="color: #111827; font-size: 14px">{{ desc }}</p>

      <v-card
        :width="$vuetify.display.mobile ? 300 : 450"
        elevation="0"
        class="align-center my-4"
      >
        <v-form ref="formRef">
          <div class="my-4 text-start flex-1-0">
            <label class="font-weight-medium" style="font-size: 14px"
              >Enter Email Address
            </label>

            <v-text-field
              v-model="email"
              variant="outlined"
              placeholder="Enter valid email address"
              :rules="required"
              class="custom-text-field"
            />
          </div>

          <v-btn
            class="my-4 me-auto text-capitalize rounded-lg custom-button"
            color="#8431E7"
            block
            :loading="isLoading"
            @click="submit"
            >Sign in</v-btn
          >
          <p class="text-center" style="color: #111827; font-size: 14px">
            Want to access Pollen Pass?
            <br v-if="xs" />
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
import { useDisplay } from "vuetify";

const { xs } = useDisplay();

const emit = defineEmits(["submit"]);

const title = ref("Login");
const desc = ref("Login to your Pollen Pass account");

const email = ref("");
const required = [(v) => !!v || "Field is required"];
const isLoading = ref(false);
const showDialog = ref(false);
const formRef = ref(null);

const submit = async () => {
  try {
    isLoading.value = true;
    const { valid } = await formRef.value.validate();
    if (valid) {
      emit("submit", email.value);
      setTimeout(() => {
        isLoading.value = false;
      }, 7000);
    } else {
      isLoading.value = false;
    }
  } catch (err) {
    isLoading.value = false;
    console.log(err);
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
