"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Gift,
  UserPlus,
  ScrollText,
  Coins,
  Check,
  Hammer,
  BookOpenCheck,
  MapPinned,
 ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"

export default function Support() {

   const router = useRouter();

  return (
    <div>
      <div className="w-full flex items-center justify-center  ">
        <div className=" mt-20 mb-30  ">
          <p className="text-xl text-secondaryOwn font-extrabold text-center mb-5">
            GEMEINSAM ZUKUNFT GESTALTEN
          </p>
          <p className="1:text-4xl text-6xl font-bold 1:w-80 text-center mb-5">
            Werden Sie Teil unserer Mission
          </p>
          <p className="text-2xl 1:w-70 text-center mx-auto text-muted-foreground">
            Ihre Unterstützung als Mitdlied oder Förderer ermöglicht es uns,
            kostenlose CoderDojos anzubieten und die digitale Bildung der Region
            voranzutreiben
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row pt-10 gap-10 items-center justify-center bg-otherbg ">



        <div className="flex flex-col sm:w-100   1:w-90 border-2 p-5 py-10 border-lightborder rounded-3xl transition-all duration-300 hover:-translate-y-5 hover:shadow-lg   ">
          <div className="flex flex-row    ">
            <div className="flex items-center ">
            <Users className="w-12 h-12 p-2 mr-5 mb-10 md:flex hidden text-white bg-primaryOwn rounded-full" />
            </div>
            <div className="flex flex-col pb-5">
              <p className="text-3xl font-bold">Mitglied werden</p>
              <p className="text-l text-muted-foreground">
                Gestalten sie aktiv mit!
              </p>
            </div>
          </div>
          <div className="">
            <p className="text-muted-foreground   pb-10 sm:w-80 ">
              Als Mitgleid im Coding Kids Niederrhein e.V. sind Sie Teil einer
              wachsenden Gemeinschaft, die sich für die Förderung von Kinder und
              Jugendlichen einsetzt. Ihr Beitrag hilft uns, unsere CoderDojos zu
              finanzieren, neue Technologien anzuschaffen und unsere Reichweite
              zu vergrößern. Eine Mitgliedschaft ist nicht nötig um teilnehmen
              zu können.{" "}
            </p>
          </div>
          <div className="flex flex-col gap-5 mt-1 sm:w-70 1:w-70 w-70 mx-auto justify-center items-center ">
            <Button
              variant="outline"
              className="bg-gray-200 border-gray-400 flex justify-start w-full"
            >
              <a
                href="/files/Mitgliedsantrag.pdf"
                download
                className="flex items-center gap-2 text-black"
              >
                <UserPlus size={18} className="text-primaryOwn" />
                Mitgliedsantrag
              </a>
            </Button>

            <Button
              variant="outline"
              className="bg-gray-200 border-gray-400 flex justify-start w-full"
            >
              <a
                href="/files/Vereinssatzung.pdf"
                download
                className="flex items-center gap-2 text-black"
              >
                <ScrollText size={18} className="text-primaryOwn" />
                Satzung des Vereins
              </a>
            </Button>

            <Button
              variant="outline"
              className="bg-gray-200 border-gray-400 flex justify-start w-full"
            >
              <a
                href="/files/Beitragsordnung.pdf"
                download
                className="flex items-center gap-2 text-black"
              >
                <Coins size={18} className="text-primaryOwn" />
                Beitragsordnung
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:w-100  1:w-90 border-2 p-5 py-10 bg-thirdOwn border-gray-400 rounded-3xl transition-all duration-300 hover:-translate-y-5 hover:shadow-lg   ">
          <div className="flex flex-row    ">
             <div className="flex items-center ">
            <Gift className="w-12 h-12 p-2 mr-5 md:flex hidden text-thirdOwn bg-white rounded-full" />
            </div>
            <div className="flex flex-col pb-5">
              <p className="text-3xl text-white font-bold">Förderer werden</p>
              <p className="text-l text-white">
                Bewegen sie viel mit ihrer Spende!
              </p>
            </div>
          </div>
          <div className="">
            <p className="text-white   pb-10 sm:w-80 ">
              Ihre Spende macht einen direkten Unterschied. Sie ermöglicht uns,
              Laptops für Kinder ohne eigene Geräte bereitzustellen, spezielle
              Workshops mit Experten zu organisieren und Lehrnmaterial zu
              entwickeln. Jeder Beitrag, ob groß oder klein, hilft uns, die
              digitale Kluft zu überbrücken und Chanchengleicheit zu schaffen.
            </p>
          </div>
          <div className="flex flex-col gap-5 w-80   justify-center items-center ">
            <div className="flex flex-col gap-5   justify-center items-center">

              <div className="flex flex-row items-center gap-5 sm:w-80 ">
                <Check className="w-10 md:flex hidden h-10 p-2 text-white border-white border rounded-full shrink-0" />
                <p className="text-white">
                  <span className="font-bold">Hardware anschaffen:</span>{" "}
                  Laptops & Robotik-Kits für unsere Dojos.
                </p>
              </div>

              <div className="flex flex-row items-center gap-5 sm:w-80 ">
                <Check className="w-10 h-10 md:flex hidden p-2 text-white border-white border rounded-full shrink-0" />
                <p className="text-white">
                  <span className="font-bold">Workshops ermöglichen:</span>{" "}
                  Raummieten und Materialkosten decken.
                </p>
              </div>

              <div className="flex flex-row items-center gap-5 sm:w-80 ">
                <Check className="w-10 h-10 md:flex hidden p-2 text-white border-white border rounded-full shrink-0" />
                <p className="text-white">
                  <span className="font-bold">Reichweite vergrößern:</span> Neue
                  Standorte am Niederrhein erschließen.
                </p>
              </div>
              <Button variant="outline" className="sm:w-80 1:w-60 h-10 " onClick={() => router.push("/spenden")}>
                <p className="text-primaryOwn font-bold">Vorstand kontaktieren</p>
                <ArrowRight className="text-primaryOwn font-bold"/>
              </Button>
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col mx-auto mb-5 mt-20 lg:flex-row md:w-100  w-90  bg-fourthOwn  rounded-3xl justify-center items-center">
        <div className="flex flex-col ">
            <p className=" text-2xl lg:text-3xl 1:w-70 font-bold pt-10 text-white mb-4">
                Haben Sie noch Fragen?
            </p>
            <p className="text-gray-300 text-lg lg:text-xl 1:w-70 ">
                Wir beantworten gerne ihre Fragen zur Mitgliedschaft, zu Spenden oder anderen Anliegen. Zögern Sie nicht, uns zu kontaktieren.
            </p>
        </div>
        <Button variant="outline" className="my-10 1:w-60 scale-125">
            <p onClick={() => (router.push("/kontakt"))}>Kontakt aufnehmen</p>
        </Button>
      </div>
    </div>
  );
}
