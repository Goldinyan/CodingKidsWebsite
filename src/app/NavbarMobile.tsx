"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/BackEnd/AuthContext";

export default function NavbarMobile(){
    const router = useRouter();

    return (
        <div className="w-full">
            <div className="absolute top-full left-0 w-full bg-white shadow-md z-40">
            <div className="bg-white w-full shadow-md">
              <div className="flex flex-col p-10 w-full gap-6 ">
                <p className="font-bold" onClick={() => router.push("/")}>Startseite</p>
                <p className="font-bold" onClick={() => router.push("/termine")}>Kurse</p>
                <p className="font-bold" onClick={() => router.push("/verein")}>Über uns</p>
                <p className="font-bold" onClick={() => router.push("/kontakt")}>Kontakt</p>
                <p className="font-bold" onClick={() => router.push("/spende")}>Spenden</p>
                <p className="font-bold" onClick={() => router.push("/login")}>Login</p>
                <span className="w-full h-[1.5px] bg-black"></span>
                <div className="flex flex-row">
                    <p>Cookie Settings</p>
                    <p>Datenschutzerklärung</p>
                </div>
                 <div className="flex flex-row">
                    <p>Impressum</p>
                    <p>AGB/Widerruf</p>
                </div>
                {}
                <p></p>
                <p></p>
              </div>
              </div>
            </div>
        </div>
    )
}