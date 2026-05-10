"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ChildProps } from "../types";

export function Summary({ step, updateStep, value, updateValue }: ChildProps) {
  useEffect(() => {
    if (step === 1 && value.gift === "geld") {
      updateValue({ ...value, amount: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (step < 3) {
    return (
      <div className="border divide-y-1 shadow-md divide-lightborder bg-white rounded-lg w-full border-lightborder px-5">
        <div>
          <div className="flex pt-2">
            <p className="text-lg font-medium">Zusammenfassung</p>
          </div>
          <div className="flex flex-col gap-1 pt-2 pb-2">
            <div className="flex flex-row justify-between">
              <p className="text-[11px] text-graytext">Spenden Typ:</p>
              <p className="text-[11px] font-semibold">
                {value.gift === "geld"
                  ? "Geld"
                  : value.gift === "equip"
                    ? "Ausrüstung"
                    : "Mitgliedschaft"}
              </p>
            </div>
            {value.gift === "equip" && step > 1 && (
              <div className="flex flex-row justify-between">
                <p className="text-[11px] text-graytext">Ausrüstung:</p>
                <p className="text-[11px] font-semibold">{value.type}</p>
              </div>
            )}
            {value.gift === "membership" && step > 1 && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row justify-between">
                  <p className="text-[11px] text-graytext">Länge:</p>
                  <p className="text-[11px] font-semibold">
                    {value.months > 1 ? value.months + " Monate" : value.months + " Monat"}
                  </p>
                </div>
                <div className="flex flex-row justify-between">
                  <p className="text-[11px] text-graytext">Anzahl:</p>
                  <p className="text-[11px] font-semibold">{value.amountOfMemberships}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p className="text-[11px] text-graytext">Wert:</p>
                  <p className="text-[11px] font-semibold">
                    {value.amountOfMemberships + "x " + value.amount + "€"}
                  </p>
                </div>
              </div>
            )}
            {value.gift === "geld" && (
              <div className="flex flex-row w-full justify-between">
                <p className="text-[12px] text-graytext">Wert:</p>
                <p className="text-[12px] font-semibold">{value.amount}€</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col pt-4 pb-4">
          <div className="flex w-full flex-col justify-between pb-4">
            <div className="w-full">
              {value.gift === "geld" && (
                <div className="flex flex-row w-full justify-between">
                  <p className="font-semibold text-[13px]">Total: </p>
                  <p className="font-semibold text-[13px]">{value.amount}€</p>
                </div>
              )}
              {value.gift === "membership" && (
                <div className="flex flex-row w-full justify-between">
                  <p className="font-semibold text-[13px]">Total: </p>
                  <p className="font-semibold text-[13px]">
                    {value.amount * value.amountOfMemberships}€
                  </p>
                </div>
              )}
            </div>
            <div className="w-full mx-auto">
              {value.gift === "equip" && step > 1 && (
                <p className="font-light text-graytext mx-auto text-center text-[13px]">
                  Vielen Dank für Ihre Unterstützung! Ihr Ausrüstung wird das Arbenteuer eines Coders verbessern
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={() => {
              if (step < 3) updateStep((step + 1) as 1 | 2 | 3);
            }}
          >
            <p className="text-[12px]">
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

  return null;
}

