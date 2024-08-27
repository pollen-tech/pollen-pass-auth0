import { defineStore } from "pinia";

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
  },
});
