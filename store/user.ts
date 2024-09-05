import { defineStore } from "pinia";
import { userOnboardApi } from "~/services/api";

interface User {
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  channelCode: string;
  phoneNumber: string;
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
    },
    getUser(): User | null {
      return this.user;
    },

    async get_user_profile(param: any) {
      const req = await userOnboardApi(`/users/${param}`);
      this.user_profile = req.data || req;
      return req;
    },
  },
});
