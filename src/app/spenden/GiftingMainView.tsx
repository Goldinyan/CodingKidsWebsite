"use client";

import { useState } from "react";
import { Check } from "lucide-react"

type diffGifts = "geld" | "equip" | "membership";

export default function GiftingMainView() {
  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [gift, setGift] = useState<diffGifts>("geld")

  
  const Gifts: {text: string, des: string, input: diffGifts}[] = [
    {
        text: "Geld spenden",
        des: "Unterstütze mit einem finanziellen Beitrag.",
        input: "geld"
    },
    {
        text: "Aufrüstung spenden",
        des: "Hilf mit Ausrüstung oder Materialien.",
        input: "equip"
    },
    {
        text: "Mitgliedschaft spenden",
        des: "Werde Teil der Gemeinschaft durch eine Mitgliedschaft.",
        input: "membership"
    }
  ]
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
      <div className="w-full h-full">
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
                  {step > st.number ? <Check className="w-3 text-fourthOwn  h-3"/> : st.number}
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
                <span className={`${step > st.number ? "bg-fourthOwn" : "bg-gray-200"} h-[1.5px] w-7 rounded-2xl `} />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
