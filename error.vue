<template>
  <v-app>
    <div class="error-page text-center mx-2 mt-6">
      <LandingEmpty :error="true" :text="text" />
      <h1 v-if="error.statusCode === 404" class="mt-4">Page Not Found</h1>
      <h3 v-else class="mt-4">{{ error.statusCode }} - {{ error.message }}</h3>
      <p v-if="error.statusCode === 404">
        The page you are for might have been removed, had its name changed, or
        is temporarily unavailable.
      </p>
      <v-btn variant="outlined" class="ma-2 text-capitalize" href="/"
        >Go back to the homepage</v-btn
      >
    </div>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const error = useError();
const text =
  ref(` ${error.statusCode}  <br/>  ${error.statusCode} -  ${error.message}    The page you are for might have been removed, had its name
        changed, or is temporarily unavailable.`);
</script>
