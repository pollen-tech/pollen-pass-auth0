<template>
  <v-sheet
    class="ma-2 pa-2 w-75 text-start d-flex align-start flex-column text--white"
    style="background-color: transparent"
  >
    <img
      src="~/assets/images/avatar_pollen_white.webp"
      alt="Pollen image"
      width="70px"
    />
    <p class="font-weight-bold mt-8 mb-8 text-white" style="font-size: 24px">
      Your passport to<br />
      More Transparency,<br />
      More Optionality,<br />
      More Sustainability
    </p>

    <ul
      v-if="channel == 'CH_LMS'"
      class="pl-4 pt-4"
      style="font-size: 18px; color: white"
    >
      <li v-for="lms in lms_context" :key="lms" class="pb-4">
        {{ lms }}
      </li>
    </ul>
    <ul v-else class="pl-4 pt-4" style="font-size: 18px; color: white">
      <li v-for="direct in direct_context" :key="direct" class="pb-4">
        {{ direct }}
      </li>
    </ul>

    <p class="text-start text-white font-weight-medium mt-4">
      - Powered by
      <a
        href="https://pollen.tech/"
        class="text-decoration-underline font-weight-bold"
        style="color: #fde68a"
        >Pollen.tech</a
      >
    </p>
  </v-sheet>
</template>

<script setup>
import { useAuth } from "@/composables/auth0";
const auth = useAuth();

const channel = computed(() => auth.get_channel());

const lms_context = ref([
  "Value your inventory with market data",
  "Liquidate globally and multichannel",
  "Reduce business waste",
]);
const direct_context = ref([
  "Pollen Pass Exclusive",
  "100% Authentic",
  "Known & Loved Brands",
  "Direct from Global Manufacturers",
  "Regularly Refreshed",
]);
</script>
