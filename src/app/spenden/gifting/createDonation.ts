import type { Donation, DiffGifts } from "./types";

export function createDonation(gift: DiffGifts): Donation {
  switch (gift) {
    case "geld":
      return { gift, amount: 0, from: "", payment: "" };
    case "equip":
      return {
        gift,
        type: "Laptop",
        messageForEquip: "",
        from: "",
        payment: "",
        assistance: false,
      };
    case "membership":
      return {
        gift,
        months: 1,
        amountOfMemberships: 0,
        amount: 0,
        from: "",
        payment: "",
      };
  }
}

