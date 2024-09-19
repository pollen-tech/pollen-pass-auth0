import { useAuth } from "~/composables/auth0";
import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const { getUserLocalStorage } = userStore;
  const { get_channel } = useAuth();

  if (!get_channel()) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    }
  } else {
    const user = computed(() => userStore.getUser());
    const user_local = getUserLocalStorage();
    if (user.value == null && user_local != null) {
      userStore.setUser(user_local);
    }

    if (typeof window !== "undefined") {
      if (user.value == null) {
        window.location.href = "/auth/login";
      } else {
        if (
          to.name != "auth-verification" &&
          user.value.user_id == undefined &&
          user.value.email
        ) {
          window.location.href = "/auth/verification";
        }
      }
    }
  }
});
