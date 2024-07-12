<template>
  <div class="h-screen">
    <v-row no-gutters>
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
        <div class="ma-8">
          <AuthSignup />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
