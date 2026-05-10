"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import type { Donation } from "./gifting/types";
import { StepsHeader } from "./gifting/components/StepsHeader";
import { DifferentGifts } from "./gifting/components/DifferentGifts";
import { Customize } from "./gifting/components/Customize";
import { Summary } from "./gifting/components/Summary";

export default function GiftingMainView() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [donation, setDonation] = useState<Donation>({
    gift: "geld",
    amount: 0,
    from: "",
    payment: "",
    message: "",
  });

  useEffect(() => {
    if (userRole !== "admin") {
      toast({
        title: "In Arbeit",
        description: "Diese Seite befindet sich noch in der Entwicklung.",
        variant: "success",
      });
    }
  }, [userRole]);

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
    <div
      className={` ${userRole !== "admin" ? "blur-[3px] pointer-events-none select-none" : ""} w-full h-full min-h-screen`}
    >
      <div className="w-full h-full flex flex-col items-center">
        <div className="flex flex-col pt-25 items-center">
          <p className="text-3xl font-bold">Helfe uns mit Spenden</p>
          <p className="text-center w-[70%] text-sm pt-4 pb-4 text-graytext font-medium">
            Unterstützen Sie uns dabei, die nächste Generation von Innovatoren
            zu fördern.
          </p>
        </div>
        <StepsHeader step={step} steps={steps} />
        <div className=" pt-8 flex gap-5 md:flex-row flex-col ">
          <div className="w-110 md:w-120 lg:w-180 ">
            <div className="flex flex-col gap-5">
              <DifferentGifts value={donation} updateStep={setStep} updateValue={setDonation} step={step} />
              <Customize value={donation} updateStep={setStep} updateValue={setDonation} step={step} />
            </div>
          </div>
          <div className="w-110 md:w-60">
            <Summary value={donation} updateStep={setStep} updateValue={setDonation} step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}
