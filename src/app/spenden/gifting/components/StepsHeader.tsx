"use client";

import { Check } from "lucide-react";

export function StepsHeader(props: {
  step: 1 | 2 | 3;
  steps: { text: string; number: number }[];
}) {
  const { step, steps } = props;

  return (
    <div className="flex w-full gap-3 pt-5 items-center justify-center">
      {steps.map((st, idx) => (
        <div key={idx} className="flex items-center gap-4 ">
          <div className="flex flex-row items-center gap-2">
            <p
              className={`rounded-full text-[13px] h-5 w-5 flex items-center justify-center ${
                step === st.number
                  ? "bg-fourthOwn text-white"
                  : "text-black bg-otherbg border border-lightborder"
              } ${step > st.number ? "bg-purple-200" : ""}`}
            >
              {step > st.number ? (
                <Check className="w-3 text-fourthOwn h-3" />
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
              } h-[1.5px] w-7 rounded-2xl`}
            />
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}

