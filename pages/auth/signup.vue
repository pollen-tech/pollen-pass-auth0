<template>
  <div class="h-screen">
    <v-row no-gutters class="overflow-y-visible">
      <v-col
        v-if="!$vuetify.display.mobile"
        cols="12"
        md="4"
        lg="4"
        class="pa-12 side-container-pollen-pass h-screen"
      >
        <AuthSideBar />
      </v-col>
      <v-col cols="12" md="8">
        <div
          :class="{
            'my-8': xs,
            'ma-8': !xs,
          }"
        >
          <AuthSignup />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
const { xs } = useDisplay();
</script>

<style lang="scss" scoped></style>
