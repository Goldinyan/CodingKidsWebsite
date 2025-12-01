"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CircleQuestionMark,
  HandCoins,
  Laptop,
  Minus,
  Monitor,
  Mouse,
  Plus,
  Tickets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type diffGifts = "geld" | "equip" | "membership";
type diffEquip = "Laptop" | "Monitor" | "Mouse" | "Other";

type BaseDonation = {
  from: string;
  date?: Date;
  payment: Payment;
  message?: string;
};

type Donation =
  | (BaseDonation & {
      gift: "equip";
      type: diffEquip;
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

type Payment = {};
export default function GiftingMainView() {
  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [donation, setDonation] = useState<Donation>({
    gift: "geld",
    amount: 0,
    from: "",
    payment: "",
    message: "",
  });

  const steps: { text: string; number: number }[] = [
    {
      text: "Auswahl",
      number: 1,
    },
    {
      text: "Angaben",
      number: 2,
    },
    {
      text: "Abschluss",
      number: 3,
    },
  ];

  return (
    <div className="w-full h-full min-h-screen">
      <div className="w-full h-full flex flex-col items-center">
        <div className="flex flex-col pt-20 items-center">
          <p className="text-2xl font-bold">Helfe uns mit Spenden</p>
          <p className="text-center w-[70%] text-sm pt-2 text-graytext font-medium">
            Unterstützen Sie uns dabei, die nächste Generation von Innovatoren
            zu fördern.
          </p>
        </div>
        <div className="flex w-full  gap-3 pt-5 items-center justify-center">
          {steps.map((st, idx) => (
            <div key={idx} className="flex items-center gap-4 ">
              <div className={`flex flex-row items-center gap-2 `}>
                <p
                  className={`rounded-full text-[13px] h-5 w-5 flex items-center justify-center ${
                    step === st.number
                      ? "bg-fourthOwn text-white"
                      : "text-black bg-otherbg border border-lightborder"
                  } ${step > st.number ? "bg-purple-200" : ""}`}
                >
                  {step > st.number ? (
                    <Check className="w-3 text-fourthOwn  h-3" />
                  ) : (
                    st.number
                  )}
                </p>
                <p
                  className={`text-[13px] font-medium ${
                    step >= st.number ? "text-fourthOwn" : ""
                  }`}
                >
                  {st.text}
                </p>
              </div>
              {st.number < 3 ? (
                <span
                  className={`${
                    step > st.number ? "bg-fourthOwn" : "bg-gray-200"
                  } h-[1.5px] w-7 rounded-2xl `}
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <div className=" pt-8 flex gap-5 sm:flex-row flex-col ">
          <div className="w-110 md:w-140 lg:w-180 ">
            <div className="flex flex-col gap-5">
              <DifferentGifts
                value={donation}
                updateStep={setStep}
                updateValue={setDonation}
                step={step}
              />
              <Customize
                value={donation}
                updateStep={setStep}
                updateValue={setDonation}
                step={step}
              />
            </div>
          </div>
          <div className="w-30 md:w-50 lg:w-70">
            <Summary
              value={donation}
              updateStep={setStep}
              updateValue={setDonation}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type ChildProps = {
  value: Donation;
  updateStep: (newValue: 1 | 2 | 3) => void;
  updateValue: (newValue: Donation) => void;
  step: number;
};

type Gift = {
  text: string;
  des: string;
  input: diffGifts;
  icon: React.ElementType;
};

function createDonation(gift: diffGifts): Donation {
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

function DifferentGifts({ value, updateStep, updateValue, step }: ChildProps) {
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
  }, [step, value]);

  return (
    <div
      className={`  w-full shadow-md border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder`}
    >
      <div>
        <p
          className={`${
            step !== 1 ? "text-graytext" : "text-black"
          } text-lg px-4  py-2 mx-auto font-semibold`}
        >
          Schritt 1: Was wollen Sie spenden?
        </p>
      </div>

      {step > 1 ? (
        <div className="">
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
                  className="ml-auto mr-5 text-sm font-medium text-fourthOwn"
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
                  value.gift === g.input
                    ? "border-fourthOwn"
                    : "border-lightborder"
                } rounded-md ${idx === 2 ? "col-span-2" : ""}`}
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

function Customize({ step, updateStep, value, updateValue }: ChildProps) {
  const giftValues: string[] = ["5", "10", "25", "50"];
  const [customAmount, setCustomAmount] = useState<string>("");
  const equip: { text: string; icon: any }[] = [
    {
      text: "Laptop",
      icon: Laptop,
    },
    {
      text: "Monitor",
      icon: Monitor,
    },
    {
      text: "Mouses",
      icon: Mouse,
    },
    {
      text: "Other",
      icon: CircleQuestionMark,
    },
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
  }, [customAmount]);

  if (step < 2) {
    return (
      <div className="w-full shadow-md  border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
        <div>
          <p
            className={`${
              step !== 2 ? "text-graytext" : "text-black"
            } text-lg px-4  py-2 mx-auto font-semibold`}
          >
            Schritt 2: Spende personalisieren
          </p>
        </div>
        <div className="flex items-center justify-center h-30">
          <p className="text-gray2text text-[12px] font-medium ">
            Bitte Schritt 1 abschließen, um fortzufahren{" "}
          </p>
        </div>
      </div>
    );
  }

  switch (value.gift) {
    case "equip":
      return (
        <div className="w-full shadow-md  border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
          <div>
            <p
              className={`${
                step !== 2 ? "text-graytext" : "text-black"
              } text-lg px-4  py-2 mx-auto font-semibold`}
            >
              Schritt 2: Spende personalisieren
            </p>
          </div>
          <div className="flex flex-col mx-4 ">
            <p className="pt-2 text-graytext text-[14px] py-2 ">
              Was spenden Sie?
            </p>
            <div className="grid grid-cols-2 gap-4  md:grid-cols-4 w-full">
              {equip.map((e) => (
                <div
                  key={e.text}
                  onClick={() =>
                    updateValue({ ...value, type: e.text as diffEquip })
                  }
                  className={` flex flex-col items-center justify-center gap-2 h-20 border rounded-lg transition-all duration-200  ${
                    value.type === e.text
                      ? "border-fourthOwn bg-purple-200"
                      : "border-lightborder"
                  }`}
                >
                  <e.icon className={`h-5 `} />
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
                htmlFor="message"
                className="block text-sm font-medium text-graytext mb-2"
              >
                Equipment Details:
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Bitte geben Sie Marke, Modell, Alter und Zustand des Geräts an (z. B. Dell Latitude 5400, 1 Jahr alt, guter Zustand)"
                className="w-full h-24 p-3 border border-lightborder rounded-md 
               text-sm text-gray-700 placeholder-gray-400 
               focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn resize-none"
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
                  Wenn ausgewählt, kontaktieren wir Sie zur Koordination der
                  Logistik.
                </p>
              </div>
            </Label>
          </div>
        </div>
      );
    case "geld":
      return (
        <div className="w-full shadow-md  border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
          <div>
            <p
              className={`${
                step !== 2 ? "text-graytext" : "text-black"
              } text-lg px-4  py-2 mx-auto font-semibold`}
            >
              Schritt 2: Spende personalisieren
            </p>
          </div>
          <div className="flex flex-col ">
            <p className="px-4 text-graytext text-[14px] py-2 ">
              Spenden Betrag
            </p>
            <div className="flex justify-around flex-row w-full">
              {giftValues.map((v) => (
                <div
                  key={v}
                  onClick={() => updateValue({ ...value, amount: Number(v) })}
                  className={`w-1/5 flex items-center justify-center h-10 border rounded-lg transition-all duration-200  ${
                    value.amount === Number(v)
                      ? "border-fourthOwn bg-purple-200"
                      : "border-lightborder"
                  }`}
                >
                  <p
                    className={`${
                      value.amount === Number(v)
                        ? "text-fourthOwn"
                        : "text-black"
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
                className="w-full pl-4 py-2 border border-lightborder rounded-md 
             text-sm text-gray-700 placeholder-gray-400 
             focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn"
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
                className="w-full h-24 p-3 border border-lightborder rounded-md 
               text-sm text-gray-700 placeholder-gray-400 
               focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn resize-none"
              />
            </div>
          </div>
        </div>
      );

    case "membership":
      return (
        <div className="w-full shadow-md  border rounded-lg border-lightborder bg-white divide-y-1 divide-lightborder">
          <div>
            <p
              className={`${
                step !== 2 ? "text-graytext" : "text-black"
              } text-lg px-4  py-2 mx-auto font-semibold`}
            >
              Schritt 2: Spende personalisieren
            </p>
          </div>
          <div className="flex flex-col ">
            <p className="px-4 text-graytext text-[14px] py-2 ">
              Bestimme die Länge der Mitgliedschaft:
            </p>
            <div className="flex justify-between px-4 gap-4 pt-2 flex-row w-full">
              {membies.map((m) => (
                <div
                  key={m.length}
                  onClick={() =>
                    updateValue({ ...value, amount: Number(m.price) })
                  }
                  className={`w-1/3 flex flex-col items-center justify-center h-25 border rounded-lg transition-all duration-200  ${
                    value.amount === Number(m.price)
                      ? "border-fourthOwn bg-purple-200"
                      : "border-lightborder"
                  }`}
                >
                  <p
                    className={`text-2xl font-bold ${
                      value.amount === Number(m.length)
                        ? "text-fourthOwn"
                        : "text-black"
                    }`}
                  >
                    {m.length}
                  </p>
                  <p
                    className={`text-sm font-light ${
                      value.amount === Number(m.length)
                        ? "text-fourthOwn"
                        : "text-graytext"
                    }`}
                  >
                    Monate
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      value.amount === Number(m.length)
                        ? "text-fourthOwn"
                        : "text-black"
                    }`}
                  >
                    {m.price}€
                  </p>
                </div>
              ))}
            </div>
            <div
              className={` mx-4 mt-4 h-10 flex flex-row justify-between items-center rounded-lg`}
            >
              <input
                type="number"
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="oder individuelle Länge"
                className="w-1/2 pl-4 py-2  border border-lightborder rounded-md 
             text-sm text-gray-700 placeholder-gray-400 
             focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn"
              />
              <div className="flex flex-row gap-2 items-center">
                <Minus
                  onClick={() => {
                    if (value.amountOfMemberships > 0) {
                      updateValue({
                        ...value,
                        amountOfMemberships: value.amountOfMemberships + -1,
                      });
                    }
                  }}
                  className={`h-7 w-7 text-graytext border border-lightborder rounded-lg p-1`}
                />
                <p>{value.amountOfMemberships}x</p>
                <Plus
                  onClick={() =>
                    updateValue({
                      ...value,
                      amountOfMemberships: value.amountOfMemberships + 1,
                    })
                  }
                  className={`h-7 w-7 text-graytext border border-lightborder rounded-lg p-1`}
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
                onChange={(e) =>
                  updateValue({ ...value, message: e.target.value })
                }
                placeholder="Ihre Nachricht hinzufügen..."
                className="w-full h-24 p-3 border border-lightborder rounded-md 
               text-sm text-gray-700 placeholder-gray-400 
               focus:outline-none focus:ring-2 focus:ring-fourthOwn focus:border-fourthOwn resize-none"
              />
            </div>
          </div>
        </div>
      );
  }
}

function Summary({ step, updateStep, value, updateValue }: ChildProps) {
  useEffect(() => {
    if (step === 1 && value.gift === "geld") {
      updateValue({ ...value, amount: 0 });
    }
  }, [step]);
  if (step < 3) {
    return (
      <div className="border divide-y-1 shadow-md divide-lightborder bg-white rounded-lg w-full border-lightborder min-w-50 px-5">
        <div className="">
          <div className="flex pt-2">
            <p className="text-lg font-medium ">Zusammenfassung</p>
          </div>
          <div className="flex flex-col gap-1 pt-2 pb-2">
            <div className="flex flex-row justify-between">
              <p className="text-[12px] text-graytext">Spenden Typ:</p>
              <p className="text-[12px] font-semibold">
                {value.gift === "geld"
                  ? "Geld"
                  : value.gift === "equip"
                  ? "Ausrüstung"
                  : "Mitgliedschaft"}
              </p>
            </div>
            {value.gift === "equip" && step > 1 && (
              <div className="flex flex-row justify-between">
                <p className="text-[12px] text-graytext">Ausrüstung:</p>
                <p className="text-[12px] font-semibold">
                  {value.gift === "equip" ? value.type : ""}
                </p>
              </div>
            )}
            <div className="flex flex-row justify-between">
              {value.gift === "geld" ||
                (value.gift === "membership" && (
                  <div>
                    <p className="text-[12px] text-graytext">Wert:</p>
                    <p className="text-[12px] font-semibold">{value.amount}€</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-4 pb-4">
          <div className="flex flex-row justify-between pb-4">
            <div>
              {value.gift === "geld" ||
                (value.gift === "membership" && (
                  <div>
                    <p className="font-semibold text-[13px]">Total: </p>
                    <p className="font-semibold text-[13px]">{value.amount}€</p>
                  </div>
                ))}
            </div>
            {value.gift === "equip" && step > 1 && (
              <p className="font-light text-graytext text-[13px]">
                {value.gift === "equip" &&
                  "Vielen Dank für Ihre Unterstützung! Ihr Ausrüstung wird das Arbenteuer eines Coders verbessern"}
              </p>
            )}
          </div>
          <Button
            onClick={() => {
              if (step < 3) updateStep((step + 1) as 1 | 2 | 3);
            }}
          >
            <p className="text-[12px] ">
              {step === 1
                ? "Weiter zu den Details"
                : step === 2
                ? "Weiter zum Bezahlen"
                : "Bestätigen und bezahlen"}
            </p>
          </Button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="border bg-white rounded-lg w-full border-lightborder h-50 min-w-50 px-5">
        <div className="flex pt-2">
          <p className="text-lg font-medium ">Zusammenfassung</p>
        </div>
        <div className="flex flex-col gap-3">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  return (
    <div className="border bg-white rounded-lg w-full border-lightborder h-50 min-w-50 px-5">
      <div className="flex pt-2">
        <p className="text-lg font-medium ">Zusammenfassung</p>
      </div>
      <div className="flex flex-col gap-3">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
