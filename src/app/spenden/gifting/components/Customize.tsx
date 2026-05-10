"use client";

import { useEffect, useState } from "react";
import { CircleQuestionMark, Laptop, Minus, Monitor, Mouse, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ChildProps, DiffEquip } from "../types";

export function Customize({ step, updateStep, value, updateValue }: ChildProps) {
  const giftValues: string[] = ["5", "10", "25", "50"];
  const [customAmount, setCustomAmount] = useState<string>("");
  const equip: { text: string; icon: any }[] = [
    { text: "Laptop", icon: Laptop },
    { text: "Monitor", icon: Monitor },
    { text: "Mouses", icon: Mouse },
    { text: "Other", icon: CircleQuestionMark },
  ];

  const membies: { length: number; price: number }[] = [
    { length: 1, price: 15 },
    { length: 3, price: 40 },
    { length: 6, price: 80 },
  ];

  useEffect(() => {
    if (customAmount !== "" && value.gift === "geld") {
      updateValue({ ...value, amount: Number(customAmount) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customAmount]);

  useEffect(() => {
    if (value.gift === "membership") {
      updateValue({ ...value, amountOfMemberships: 1 });
      if (value.amountOfMemberships > 0) {
        updateValue({
          ...value,
          amount: value.amountOfMemberships * value.amount,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.gift]);

  if (step < 2) {
    return (
      <div className="w-full shadow-md border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
        <div>
          <p
            className={`${
              step !== 2 ? "text-graytext" : "text-black"
            } text-lg px-4 py-2 mx-auto font-semibold`}
          >
            Schritt 2: Spende personalisieren
          </p>
        </div>
        <div className="flex items-center justify-center h-30">
          <p className="text-gray2text text-[12px] font-medium">
            Bitte Schritt 1 abschließen, um fortzufahren
          </p>
        </div>
      </div>
    );
  }

  switch (value.gift) {
    case "equip":
      return (
        <div className="w-full shadow-md border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
          <div>
            <p
              className={`${
                step !== 2 ? "text-graytext" : "text-black"
              } text-lg px-4 py-2 mx-auto font-semibold`}
            >
              Schritt 2: Spende personalisieren
            </p>
          </div>
          <div className="flex flex-col mx-4">
            <p className="pt-2 text-graytext text-[14px] py-2">Was spenden Sie?</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 w-full">
              {equip.map((e) => (
                <div
                  key={e.text}
                  onClick={() => updateValue({ ...value, type: e.text as DiffEquip })}
                  className={`flex flex-col items-center justify-center gap-2 h-20 border rounded-lg transition-all duration-200 ${
                    value.type === e.text
                      ? "border-fourthOwn bg-purple-200"
                      : "border-lightborder"
                  } cursor-pointer`}
                >
                  <e.icon className="h-5" />
                  <p
                    className={`font-medium ${
                      value.type === e.text ? "text-fourthOwn" : "text-black"
                    }`}
                  >
                    {e.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full pt-4">
              <label
                htmlFor="equip-message"
                className="block text-sm font-medium text-graytext mb-2"
              >
                Equipment Details:
              </label>
              <textarea
                id="equip-message"
                name="equip-message"
                placeholder="Bitte geben Sie Marke, Modell, Alter und Zustand des Geräts an (z. B. Dell Latitude 5400, 1 Jahr alt, guter Zustand)"
                className="w-full h-24 p-3 border border-lightborder rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn resize-none"
              />
            </div>
            <Label className="hover:bg-accent/50 my-4 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-fourthOwn has-[[aria-checked=true]]:bg-purple-200 dark:has-[[aria-checked=true]]:border-fourthOwn dark:has-[[aria-checked=true]]:bg-fourthOwn">
              <Checkbox
                id="toggle-2"
                checked={value.assistance}
                onCheckedChange={() =>
                  updateValue({ ...value, assistance: !value.assistance })
                }
                className="data-[state=checked]:border-fourthOwn data-[state=checked]:bg-fourthOwn data-[state=checked]:text-white dark:data-[state=checked]:border-fourthOwn dark:data-[state=checked]:bg-fourthOwn"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  Ich benötige Unterstützung bei Abholung/Versand. <br />
                </p>
                <p className="text-muted-foreground text-sm">
                  Wenn ausgewählt, kontaktieren wir Sie zur Koordination der Logistik.
                </p>
              </div>
            </Label>
          </div>
        </div>
      );

    case "geld":
      return (
        <div className="w-full shadow-md border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
          <div>
            <p
              className={`${
                step !== 2 ? "text-graytext" : "text-black"
              } text-lg px-4 py-2 mx-auto font-semibold`}
            >
              Schritt 2: Spende personalisieren
            </p>
          </div>
          <div className="flex flex-col">
            <p className="px-4 text-graytext text-[14px] py-2">Spenden Betrag</p>
            <div className="flex justify-around flex-row w-full">
              {giftValues.map((v) => (
                <div
                  key={v}
                  onClick={() => updateValue({ ...value, amount: Number(v) })}
                  className={`w-1/5 flex items-center justify-center h-10 border rounded-lg transition-all duration-200 ${
                    value.amount === Number(v)
                      ? "border-fourthOwn bg-purple-200"
                      : "border-lightborder"
                  } cursor-pointer`}
                >
                  <p
                    className={`${
                      value.amount === Number(v) ? "text-fourthOwn" : "text-black"
                    }`}
                  >
                    {v}€
                  </p>
                </div>
              ))}
            </div>
            <div
              className={`${
                customAmount !== "" ? "border-fourthOwn" : "border-lightborder"
              } mx-4 mt-4 border h-10 flex flex-row justify-between items-center rounded-lg`}
            >
              <input
                type="number"
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="oder individuellen Betrag"
                className="w-full pl-4 py-2 border border-lightborder rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn"
              />
            </div>
            <div className="w-full p-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-graytext mb-2"
              >
                Nachricht (optional)
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Ihre Nachricht hinzufügen..."
                className="w-full h-24 p-3 border border-lightborder rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn resize-none"
              />
            </div>
          </div>
        </div>
      );

    case "membership":
      return (
        <div className="w-full shadow-md border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
          <div>
            <p
              className={`${
                step !== 2 ? "text-graytext" : "text-black"
              } text-lg px-4 py-2 mx-auto font-semibold`}
            >
              Schritt 2: Spende personalisieren
            </p>
          </div>
          <div className="flex flex-col">
            <p className="px-4 text-graytext text-[14px] py-2">
              Bestimme die Länge der Mitgliedschaft:
            </p>
            <div className="flex justify-between px-4 gap-4 pt-2 flex-row w-full">
              {membies.map((m) => (
                <div
                  key={m.length}
                  onClick={() => {
                    updateValue({
                      ...value,
                      months: Number(m.length),
                      amountOfMemberships: 1,
                      amount: Number(m.price),
                    });
                  }}
                  className={`w-1/3 flex flex-col items-center justify-center h-25 border rounded-lg transition-all duration-200 ${
                    value.amount === Number(m.price)
                      ? "border-fourthOwn bg-purple-200"
                      : "border-lightborder"
                  } cursor-pointer`}
                >
                  <p
                    className={`text-2xl font-bold ${
                      value.amount === Number(m.length) ? "text-fourthOwn" : "text-black"
                    }`}
                  >
                    {m.length}
                  </p>
                  <p
                    className={`text-sm font-light ${
                      value.amount === Number(m.length) ? "text-fourthOwn" : "text-graytext"
                    }`}
                  >
                    Monate
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      value.amount === Number(m.length) ? "text-fourthOwn" : "text-black"
                    }`}
                  >
                    {m.price}€
                  </p>
                </div>
              ))}
            </div>
            <div className="mx-4 mt-4 h-10 flex flex-row justify-between items-center rounded-lg">
              <div className="flex flex-row gap-2 items-center">
                <Minus
                  onClick={() => {
                    if (value.amountOfMemberships > 0) {
                      updateValue({
                        ...value,
                        amountOfMemberships: value.amountOfMemberships - 1,
                      });
                    }
                  }}
                  className={`${
                    value.amountOfMemberships > 0 ? "cursor-pointer" : "cursor-not-allowed"
                  } h-7 w-7 text-graytext border border-lightborder rounded-lg p-1`}
                />
                <p className="border border-lightborder rounded-lg w-10 h-7 flex items-center justify-center">
                  {value.amountOfMemberships}x
                </p>
                <Plus
                  onClick={() =>
                    value.amountOfMemberships < 10 &&
                    updateValue({
                      ...value,
                      amountOfMemberships: value.amountOfMemberships + 1,
                    })
                  }
                  className={`${
                    value.amountOfMemberships < 10 ? "" : "cursor-not-allowed"
                  } h-7 w-7 text-graytext border border-lightborder rounded-lg p-1`}
                />
              </div>
            </div>
            <div className="w-full p-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-graytext mb-2"
              >
                Personale Nachricht (optional)
              </label>
              <textarea
                id="message"
                name="message"
                onChange={(e) => updateValue({ ...value, message: e.target.value })}
                placeholder="Ihre Nachricht hinzufügen..."
                className="w-full h-24 p-3 border border-lightborder rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn resize-none"
              />
            </div>
          </div>
        </div>
      );
  }
}

