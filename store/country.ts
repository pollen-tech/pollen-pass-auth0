import { defineStore } from "pinia";
import { ppApi } from "~/services/api";

export const useCountryStore = defineStore("country", {
  state: () => {
    return {
      countries: [],
    };
  },
  actions: {
    async getCountries() {
      const data = await ppApi(`/countries`);
      this.countries = data;
    },
    setCountries(param: never[]) {
      this.countries = param;
    },
    async getCities(param: any) {
      const data = await ppApi(`/countries/${param}/cities`);
      return data;
    },
  },
});
