<template>
  <div>
    <v-sheet class="d-flex flex-column align-center">
      <h3 class="font-weight-bold my-8">{{ componentTitle }}</h3>

      <div class="d-flex flex-column align-center">
        <v-card elevation="0">
          <div class="bg-signup-container rounded-lg">
            <div class="d-flex align-end flex-column">
              <img
                src="~/assets/images/avatar_pollen_white.webp"
                alt="Pollen image"
                width="50px"
              />
            </div>
            <div class="text-white">
              <h3>{{ user.name }}</h3>
              <p class="py-1">{{ user.email }}</p>
              <p class="py-1">{{ user.phonenumber }}</p>
            </div>

            <v-row class="text-white mt-10">
              <v-col cols="12" md="6" class="font-weight-medium">
                <h4>Member ID:{{ user.memberid }}</h4>
              </v-col>
              <v-col cols="12" md="6" class="font-weight-medium text-truncate">
                <p class="text-truncate">Member since: {{ user.createdate }}</p>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <div class="d-flex justify-center mb-6">
          <v-sheet class="ma-2 pa-2 align-center text-center">
            <p class="py-4 px-10 grey--text" style="width: 500px">
              {{ componentDescription }}
            </p>
            <v-btn
              color="deep-purple-accent-4"
              class="my-4 px-10 text-capitalize rounded-lg"
              @click="redirect"
            >
              Go to Channel Onboarding
            </v-btn></v-sheet
          >
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";
import { useAuth } from "@/composables/auth0";
import moment from "moment";

export default {
  data: () => ({
    componentTitle: "Welcome to Pollen Pass!",
    user: {
      name: "",
      email: "",
      phonenumber: "",
      memberid: "",
      createdate: "",
    },
    config: null,
    clientId: null,
  }),
  computed: {
    componentDescription() {
      return `We will redirect you to ${
        this.clientId === "lms" ? "Pollen LMS" : "Pollen Direct"
      } onboarding page in 5 second(s). If you are not automatically redirected, please click the button below.`;
    },
  },
  async mounted() {
    this.config = useRuntimeConfig();
    const auth = useAuth();
    const userStore = useUserStore();
    console.log(userStore);
    console.log(userStore.getUser());
    const userId = userStore.getUser()?.user_id || auth.get_user_id();
    await this.fetchUserInfo(userId);

    //const userData = await this.getUserInfo();
    //const originalDate = new Date(userData.createdAt);

    //const formattedDate = `${(originalDate.getMonth() + 1)
    //  .toString()
    //  .padStart(2, "0")}/
    //    ${originalDate
    //      .getDate()
    //      .toString()
    //      .padStart(2, "0")}/
    //    ${originalDate.getFullYear()}`;
    //this.user = {
    //  name: `${userData.firstName} ${userData.lastName}`,
    //  email: userData.email,
    //  phonenumber: userData.phone,
    //  memberid: userData.id,
    //  createdate: formattedDate,
    //};

    //const savedKeycloak = localStorage.getItem("keycloak") || this.keycloak;
    //const clientId =
    //  JSON.parse(savedKeycloak)?.clientId || savedKeycloak?.clientId;
    //this.clientId = clientId;
  },
  methods: {
    //async getUserInfo() {
    //  const url = `${this.config.public.backendUrl}/user/reference/${this.id}`;
    //  const keyCloakData = await api(url);

    //  return keyCloakData;
    //},
    async fetchUserInfo(userId) {
      try {
        const response = await fetch(
          `${this.config.public.API_URL}/users/${userId}`,
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
        const userDataJson = await response.json();
        const userData = userDataJson;
        console.log(userData);
        //const originalDate = new Date(userData.createdAt);
        const formattedDate = moment(userData.created_at).format("DD/MM/YYYY");
        this.user = {
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          phonenumber: `+${userData.country_code} ${userData.phone_no}`,
          memberid: userData.id,
          createdate: formattedDate,
        };
        console.log("user: ", this.user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    redirect() {
      const runtimeConfig = useRuntimeConfig();
      const auth = useAuth();
      const channel = auth.get_channel();
      let redirect_url = "";

      if (channel === "CH_POLLEN_DIRECT") {
        redirect_url = runtimeConfig.public.pollenDirectUrl;
      } else {
        redirect_url = runtimeConfig.public.pollenLmsUrl;
      }

      const url = new URL(redirect_url);
      url.searchParams.append("user_id", auth.get_user_id());
      url.searchParams.append("access_token", auth.get_access_token());
      url.searchParams.append("expires_at", auth.get_expire_at());
      navigateTo(url.toString(), { external: true });
    },
  },
};
</script>

<style lang="scss" scoped></style>
