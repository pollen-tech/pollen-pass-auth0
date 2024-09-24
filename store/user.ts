import { defineStore } from "pinia";
import { userOnboardApi } from "~/services/api";

interface User {
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  channelCode: string;
  phoneNumber: string;
  phone: string;
  countryCode: string;
}

export const useUserStore = defineStore("user", {
  state: (): { user: User | null } => {
    return {
      user: null,
      user_profile: null,
    };
  },
  actions: {
    setUser(user: User) {
      this.user = { ...this.user, ...user };
      localStorage.setItem("email", user.email);
      localStorage.setItem("user_signup", JSON.stringify(user));
    },
    set_user_email(param) {
      localStorage.setItem("email", param);
    },
    getUser(): User | null {
      return this.user;
    },
    cleanupUser() {
      localStorage.removeItem("user_signup");
    },
    getUserLocalStorage() {
      const user = localStorage.getItem("user_signup");
      return user ? JSON.parse(user) : user;
    },

    async get_user_profile(param: any) {
      const req = await userOnboardApi(`/users/${param}`);
      this.user_profile = req.data || req;
      return req;
    },

    async validate_email_exist(param_email: any) {
      const req = await userOnboardApi(
        `/users/pollen-pass-by-email/${param_email}`
      );
      return req;
    },

    async verify_passwordless_email_login(param_email: any) {
      const req = await userOnboardApi(
        `/auth0/password-less-email-login/${param_email}`,
        "POST"
      );
      return req;
    },
  },
});
