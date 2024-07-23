// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

const LMSTheme = {
  dark: false,
  colors: {
    background: "#f9fafb",
    color: "#111827",
    surface: "#f9fafb",
    primary: "#8431e7",
    "primary-darken-1": "#3700B3",
    secondary: "#D1D5DB",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    theme: {
      defaultTheme: "LMSTheme",
      themes: {
        LMSTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
