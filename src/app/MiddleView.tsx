"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
export default function MiddleView() {
  return (
    <div className="w-full flex lg:w-200 items-start justify-start px-8 pt-20">
      <Button className="bg-secondaryOwn hover:border-secondaryOwn w-full hover:border h-10 hover:bg-white hover:text-secondaryOwn">
        <p>Lernen sie mehr über Uns</p>
      </Button>
    </div>
  );
}
