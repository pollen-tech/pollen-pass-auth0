<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="text-left">
        <v-sheet>
          <v-btn
            variant="text"
            prepend-icon="mdi-chevron-left"
            style="color: #6b7280"
            class="text-capitalize"
            @click="$emit('previousPage')"
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
    <div
      class="d-flex flex-column align-center mx-16"
      :style="{
        'margin-top': $vuetify.display.mobile ? '20px' : '10%',
      }"
    >
      <h3>{{ title }}</h3>

      <v-card
        :width="$vuetify.display.mobile ? 300 : 450"
        elevation="0"
        class="align-center my-4"
      >
        <v-form ref="form">
          <div class="my-4 text-start flex-1-0">
            <v-text-field
              v-model="item.emailOTPCode"
              variant="outlined"
              placeholder="Enter Verification Code"
              :rules="required"
            ></v-text-field>
          </div>

          <div class="text-center my-4 grey--text">
            <p>
              Didn’t receive a code?

              <v-btn
                class="purple-text text-capitalize text-body-1 pa-0"
                variant="text"
                @click="returnToLogin"
                >Return to Login</v-btn
              >
            </p>
          </div>
          <v-btn
            class="my-4 me-auto text-capitalize rounded-lg"
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
import { useRuntimeConfig } from '#app';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const user = userStore.getUser();

const data = ref(null);
const error = ref(null);
const loading = ref(true);
const config = useRuntimeConfig();

const emit = defineEmits(["submit"]);

const title = ref("Enter the verification code sent to your email");
const item = ref({ items: [] });
const required = [(v) => !!v || "Field is required"];
const isLoading = ref(false);
const showDialog = ref(false);

const submit = async () => {
  emit("submit");
  console.log(user);
  let email = user.email;
  let otp = item.value.emailOTPCode;
  let channel_code = 'CH_POLLEN_PASS';

  try {
    console.log('params: ',email, otp, channel_code);
    console.log(`${config.public.API_URL}/auth0/password-less-email-otp-validate/${email}`);
    console.log(JSON.stringify({
        "email": email,
        "code": otp,
        "channel_code": channel_code
      }));
    const response = await fetch(`${config.public.API_URL}/auth0/password-less-email-otp-validate/${email}?code=${otp}&channel_code=${channel_code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    data.value = await response.json();
    console.log(data.value);
    console.log('data.value.user_id: ', data.value.user_id);
    userStore.setUser({user_id: data.value.user_id});
    console.log('userStore.getUser(): ', userStore.getUser());
    navigateTo("/auth/otp");

  } catch (err) {
    error.value = 'Failed to fetch data';
  }
};

const returnToLogin = () => {
  navigateTo("/auth/login");
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
