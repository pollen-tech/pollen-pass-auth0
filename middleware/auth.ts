import { useAuth } from "~/composables/auth0";
import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const { getUserLocalStorage, setUser, get_user_profile } = userStore;
  const { get_channel, get_user_id } = useAuth();

  // Check for channel availability
  if (!get_channel()) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    }
    return;
  }

  // Handle user state
  const user = computed(() => userStore.getUser());
  const userLocal = getUserLocalStorage();

  if (!user.value && userLocal) {
    setUser(userLocal);
  }

  if (typeof window === "undefined") return;

  // Redirect logic based on user state
  const redirectTo = (path) => {
    window.location.href = path;
  };

  if (!user.value && to.name !== "auth-login") {
    redirectTo("/auth/login");
    return;
  }

  const userId = get_user_id();
  if (userId) {
    const req = await get_user_profile(userId);
    if (!req.data?.phone_verified) {
      if (to.name !== "auth-otp") redirectTo("/auth/otp");
      return;
    }

    if (to.name !== "auth-success") {
      redirectTo("/auth/success");
      return;
    }
  }

  // Check for user verification
  if (
    user.value?.email &&
    !user.value?.user_id &&
    to.name !== "auth-verification"
  ) {
    redirectTo("/auth/verification");
    return;
  }

  // Additional logic to redirect from auth-otp to auth-verification
  if (to.name === "auth-otp") {
    if (!user.value?.user_id) {
      redirectTo("/auth/verification");
      return;
    }
  }

  if (user.value?.user_id) {
    const req = await get_user_profile(user.value.user_id);
    if (!req.data?.phone_verified && to.name !== "auth-otp") {
      redirectTo("/auth/otp");
    }
  }
});
