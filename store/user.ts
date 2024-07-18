import { defineStore } from 'pinia';

interface User {
	user_id: string;
	email: string;
	firstName: string;
	lastName: string;
	channelCode: string;
	phoneNumber: string;
	countryCode: string;
}

export const useUserStore = defineStore({
	id: 'shared',
	state: (): { user: User | null } => ({
		user: null,
	}),
	actions: {
		setUser(user: User) {
			this.user = { ...this.user, ...user };
		},
		getUser(): User | null {
			return this.user;
		},
	},
});
