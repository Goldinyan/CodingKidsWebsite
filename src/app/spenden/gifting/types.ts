import type React from "react";

export type DiffGifts = "geld" | "equip" | "membership";
export type DiffEquip = "Laptop" | "Monitor" | "Mouse" | "Other";

export type BaseDonation = {
  from: string;
  date?: Date;
  payment: string;
  message?: string;
};

export type Donation =
  | (BaseDonation & {
      gift: "equip";
      type: DiffEquip;
      messageForEquip: string;
      assistance: boolean;
    })
  | (BaseDonation & {
      gift: "geld";
      amount: number;
    })
  | (BaseDonation & {
      gift: "membership";
      months: number;
      amountOfMemberships: number;
      amount: number;
    });

export type ChildProps = {
  value: Donation;
  updateStep: (newValue: 1 | 2 | 3) => void;
  updateValue: (newValue: Donation) => void;
  step: number;
};

export type Gift = {
  text: string;
  des: string;
  input: DiffGifts;
  icon: React.ElementType;
};

