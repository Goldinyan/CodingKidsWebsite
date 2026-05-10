"use client";

import { useEffect, useState } from "react";
import { HandCoins, Laptop, Tickets } from "lucide-react";
import type { ChildProps, Gift } from "../types";
import { createDonation } from "../createDonation";

export function DifferentGifts({ value, updateStep, updateValue, step }: ChildProps) {
  const [filGifts, setFilGifts] = useState<Gift[]>();
  const Gifts: Gift[] = [
    {
      text: "Geld spenden",
      des: "Unterstütze mit einem finanziellen Beitrag.",
      input: "geld",
      icon: HandCoins,
    },
    {
      text: "Aufrüstung spenden",
      des: "Hilf mit Ausrüstunsg oder Materialien.",
      input: "equip",
      icon: Laptop,
    },
    {
      text: "Mitgliedschaft spenden",
      des: "Werde Teil der Gemeinschaft durch eine Mitgliedschaft.",
      input: "membership",
      icon: Tickets,
    },
  ];

  useEffect(() => {
    if (step > 1) {
      setFilGifts(Gifts.filter((gift) => gift.input === value.gift));
    } else {
      setFilGifts(Gifts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, value.gift]);

  return (
    <div className="w-full shadow-md border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
      <div>
        <p
          className={`${
            step !== 1 ? "text-graytext" : "text-black"
          } text-lg px-4 py-2 mx-auto font-semibold`}
        >
          Schritt 1: Was wollen Sie spenden?
        </p>
      </div>

      {step > 1 ? (
        <div>
          {filGifts?.map((gift) => {
            const Icon = gift.icon;
            return (
              <div
                key={gift.input}
                className="flex flex-row items-center h-15 gap-3 p-2"
              >
                <Icon className="w-6 rounded-sm h-6 p-1 text-fourthOwn bg-purple-200" />
                <div>
                  <p className="font-medium text-graytext text-sm">
                    {gift.text}
                  </p>
                </div>
                <p
                  onClick={() => updateStep(1)}
                  className="ml-auto mr-5 text-sm font-medium text-fourthOwn cursor-pointer"
                >
                  Ändern
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {Gifts.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                onClick={() => updateValue(createDonation(g.input))}
                key={g.input}
                className={`flex flex-col gap-3 p-2 border ${
                  value.gift === g.input ? "border-fourthOwn" : "border-lightborder"
                } rounded-md ${idx === 2 ? "col-span-2" : ""} cursor-pointer`}
              >
                <div className="flex flex-row gap-2 items-center">
                  <Icon
                    className={`w-6 h-6 p-1 ${
                      value.gift === g.input
                        ? "text-fourthOwn bg-purple-200 rounded-lg"
                        : "bg-gray-200 rounded-lg"
                    }`}
                  />
                  <p className="font-semibold text-sm">{g.text}</p>
                </div>
                <p className="font-medium text-graytext text-[12px] w-[80%]">
                  {g.des}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

