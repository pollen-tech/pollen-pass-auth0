import { defineStore } from "pinia";

export const useSellerStore = defineStore("seller", {
  state: () => {
    return {
      companyType: [
        { id: 1, title: "Principal", description: "Product or Brand Owner" },
        {
          id: 2,
          title: "Factory / Production Facility",
          description:
            "Owner of the production, but not the original brand owner ",
        },
        {
          id: 3,
          title: "Distributor / Wholesaler",
          description: "Packaged  Finished goods",
        },
        {
          id: 4,
          title: "Agent",
          description:
            "Represents inventory but doesn't own the warehouse where goods are stored",
        },
        { id: 5, title: "Logistics", description: "Fulfillment Facility" },
        { id: 6, title: "Retailer", description: "Sells direct to consumer" },
      ],
    };
  },
});
