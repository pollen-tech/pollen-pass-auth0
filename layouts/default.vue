<template>
  <v-layout class="rounded rounded-md">
    <!--<v-app-bar
      fixed
      app
      :class="$vuetify.display.mobile ? 'py-2' : 'pt-1'"
      class="mb-3 bg-white"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.display.mobile"
        @click.stop="showNavMobile()"
      />
      <div>
        <v-list-item class="pl-1">
          <v-list-item-title class="d-flex align-center">
            <img src="../assets/images/pollen-lms.svg" />

            <p
              v-if="!$vuetify.display.mobile"
              class="font-weight-bold text-caption ml-1"
            >
              {{ title }}
            </p>
          </v-list-item-title>
        </v-list-item>
      </div>
      <v-spacer />
      <v-skeleton-loader :loading="loading" type="list-item-two-line">
        <v-menu v-if="$vuetify.display.mobile && !isAuthenticated">
          <template #activator="{ props }">
            <div>
              <v-btn icon="mdi-dots-vertical" v-bind="props"> </v-btn>
            </div>
          </template>

          <v-card class="rounded pa-1">
            <v-card-text class="pa-0">
              <v-list density="compact">
                <v-list-item>
                  <NuxtLink
                    class="text-grey-darken-1 text-body-2 cursor-pointer text-decoration-none"
                    @click="onSignUp()"
                  >
                    Sign Up with Pollen Pass
                  </NuxtLink>
                </v-list-item>
                <v-list-item>
                  <NuxtLink
                    class="text-grey-darken-1 text-body-2 cursor-pointer text-decoration-none"
                    @click="onLogin()"
                  >
                    Login
                  </NuxtLink>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
        <div v-else class="my-10 bg-white">
          <v-btn
            v-if="!isAuthenticated"
            variant="outlined"
            class="my-4 mx-2 me-auto text-capitalize"
            color="purple-darken-3"
            @click="onLogin()"
            >Login</v-btn
          >
          <v-btn
            v-if="!isAuthenticated"
            class="my-4 mx-2 me-auto text-capitalize bg-purple-darken-3"
            @click="onSignUp()"
            >Sign Up with Pollen Pass</v-btn
          >
        </div>

        <v-menu v-if="isAuthenticated">
          <template #activator="{ props }">
            <div>
              <v-btn
                icon="mdi-account-outline"
                variant="tonal"
                color="primary"
                rounded="lg"
                v-bind="props"
              />
            </div>
          </template>

          <v-card class="rounded pa-1">
            <v-card-text class="pa-0">
              <v-list density="compact">
                <v-list-item
                  class="text-grey-darken-1 text-body-2"
                  @click="showProfileSetting()"
                >
                  <v-icon>mdi-account-details-outline</v-icon> Profile
                </v-list-item>
                <v-list-item>
                  <NuxtLink
                    class="text-grey-darken-1 text-body-2 cursor-pointer text-decoration-none"
                    @click="onLogout()"
                  >
                    <v-icon>mdi-logout</v-icon> Logout
                  </NuxtLink>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
        <div
          v-if="isAuthenticated && !$vuetify.display.mobile"
          class="d-flex flex-column ma-2"
        >
          <h5>
            {{ userProfile?.firstName || userProfile?.name }}
          </h5>
          <h6 v-if="userProfile?.id" class="font-weight-regular">
            Member ID:
            {{ userProfile?.id }}
          </h6>
        </div>
      </v-skeleton-loader>
    </v-app-bar>-->
    <v-navigation-drawer
      v-if="isAuthenticated && showSideNav"
      v-model="drawer"
      :rail="rail"
      :permanent="!$vuetify.display.mobile"
      :temporary="$vuetify.display.mobile"
      color="#782CD1"
    >
      <v-list-item v-if="!$vuetify.display.mobile" nav>
        <template #title>
          <div class="py-2 d-flex align-center">
            <v-btn
              v-if="rail"
              variant="text"
              icon="mdi-chevron-right"
              @click.stop="rail = !rail"
            />
            <v-btn
              v-else
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            />

            Hide Navigation Bar
          </div>
        </template>
      </v-list-item>

      <v-divider />

      <v-list-item nav>
        <template #title>
          <div
            :class="$vuetify.display.mobile ? 'pt-6' : 'pt-1'"
            class="py-2 pl-1 d-flex align-center"
          >
            <v-avatar color="purple-lighten-5 " size="33">
              <span class="purple--text text-h6 text-capitalize">
                {{ userProfile?.firstName.charAt(0) || "" }}
              </span>
            </v-avatar>
            <div class="pl-6">
              <div
                class="text-body-2 multiline-text text-white"
                style="width: 160px"
              >
                {{ userProfile?.name || "" }}
              </div>
              <div class="text-caption">{{ title }}</div>
            </div>
          </div>
        </template>
      </v-list-item>

      <v-divider />
      <v-list
        density="compact"
        nav
        class="sidebar-list"
        :style="{
          height: $vuetify.display.height <= 430 ? '105%!important' : '',
        }"
      >
        <v-spacer v-if="$vuetify.display.height > 390" />
        <v-list-item
          class="logout-item w-100"
          :class="{
            'logout-item': $vuetify.display.height > 390,
          }"
        >
          <template #title>
            <div class="d-flex text-center align-center">
              <v-icon
                color="gray"
                size="large"
                class="rotate-icon mr-2"
                @click="onLogout()"
                >mdi-logout</v-icon
              >
              <p class="text-caption pl-6">Logout</p>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="d-flex flex-column align-center justify-center"
      style="background: #f9fafb"
    >
      <div class="h-100 w-100 overflow-hidden">
        <slot />
        <ProfileSettings
          v-model="dialogVisible"
          @close="dialogVisible = false"
        />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentUrl = computed(() => route.fullPath);
const userProfile = ref({ id: null });
const title = ref("Pollen Pass");
const rail = ref(true);
const drawer = ref(true);
const dialogVisible = ref(false);
const loading = ref(true);
const showSideNav = ref(true);
const excludeSideNav = ref(["/onboarding"]);
const isAuthenticated = ref(false);

onMounted(async () => {
  if (excludeSideNav.value.includes(currentUrl.value)) {
    showSideNav.value = false;
  }
  setTimeout(() => {
    loading.value = false;
  }, 800);
});

const onLogout = () => {};
</script>
