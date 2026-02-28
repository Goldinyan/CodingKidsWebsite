"use client";

import { Button } from "@/components/ui/button";

export default function MiddleView() {
  return (
    <div className="w-full flex  items-start justify-start px-8 pt-20">
      <Button className="bg-secondaryOwn max-w-120 mx-auto md:mx-0  hover:border-secondaryOwn w-full hover:border h-10 hover:bg-white hover:text-secondaryOwn">
        <p>Lernen sie mehr über Uns</p>
      </Button>
    </div>
  );
}
