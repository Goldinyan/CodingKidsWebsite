"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Handshake, Heart, Sparkles, Presentation, MapPinned,School } from "lucide-react";
import MentorenView from "./MentorView";
const values = [
  {
    title: "Empowerment",
    description:
      "Wir geben Kindern die Werkzeuge und das Selbstvertrauen, um Schöpfer und nicht nur Konsumenten von Technologie zu werden.",
    icon: Lightbulb,
  },
  {
    title: "Zusammenarbeit",
    description:
      "Wir fördern eine unterstützende Gemeinschaft, in der Schüler in einer teamorientierten Umgebung voneinander lernen.",
    icon: Handshake,
  },
  {
    title: "Zugänglichkeit",
    description:
      "Unsere Programme sind so konzipiert, dass sie inklusiv und für Kinder aus allen Verhältnissen verfügbar sind.",
    icon: Heart,
  },
] as const;

export default function WerWirSind() {
    
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-center flex-col h-150 gap-6 bg-fifthOwn ">
          <div className=" flex items-center flex-col  text-center">
            <p className="text-xl font-extrabold 1:text-4xl md:text-4xl lg:text-5xl text-white xxl:text-6xl xxl:w-200 pr-6 pl-6">
              Wir gestalten die digitale Zukunft.
            </p>
            <p className="mt-6 text-lg xxl:text-xl xxl:w-160 lg:text-l md:text-m pr-6 pl-6 text-lighttext">
              Unsere Mission ist es, Kinder für Technologie zu begeistern, ihre Kreativität zu fördern und sie zu den Innovatoren von morgen zu machen.
            </p>
          </div>
        </div>





        <div className="flex flex-col items-center justify-around p-10 gap-30 sm:gap-0 lg:flex-row m-5">
          <div className="flex flex-col  1:w-70  md:w-120 lg:w-150 ">
            <p className="text-2xl 1:w-70 md:w-120 lg:w-120 xl:w-120 font-bold mb-3">
              Von einer kleinen Idee zu einer regionalen Bewegung
            </p>
            <p className=" text-gray-600 1:w-70 md:w-120 lg:w-120 md:mb-5">
              Coding Kids Niederrhein begann mit einer einfachen Überzeugung:
              Jedes Kind verdient die Chance, die Sprache der Zukunft zu lernen.
              Was als kleiner Wochenend-Workshop anfing, hat sich zu einer
              blühenden Gemeinschaft entwickelt, die Hunderte von jungen Köpfen
              in der gesamten Region erreicht. Wir widmen uns der Bereitstellung
              zugänglicher, unterhaltsamer und hochwertiger
              Programmierausbildung, um Kinder auf eine digitale Welt
              vorzubereiten.
            </p>
          </div>



          <div className="">
            <div className=" 1:w-70  md:w-120 lg:w-90 xl:w-140 flex flex-col">


              <div className="flex flex-row gap-5  items-center">
                <Sparkles className="bg-primaryOwn p-2 rounded-full text-white w-10 h-10" />
                <div className="flex flex-col">
                  <p className="font-bold">Gegründet</p>
                  <p>2018</p>
                </div>
              </div>

              <div className="flex justify-start">
                 <span className="ml-5 m-1 block w-px h-6 bg-black"></span>
               </div>


              <div className="flex flex-row gap-5  items-center">
                <Presentation className="bg-primaryOwn p-2 rounded-full text-white w-10 h-10" />
                <div className="flex flex-col">
                  <p className="font-bold">Erster Öffentlicher Workshop</p>
                  <p>2019</p>
                </div>
              </div>

              <div className="flex justify-start">
                 <span className="ml-5 m-1 block w-px h-6 bg-black"></span>
               </div>


               <div className="flex flex-row gap-5 items-center">
                <MapPinned className="bg-primaryOwn p-2 rounded-full text-white w-10 h-10" />
                <div className="flex flex-col">
                  <p className="font-bold">Expansion in drei Städte</p>
                  <p>2021</p>
                </div>
              </div>

              <div className="flex justify-start">
                 <span className="ml-5 m-1 block w-px h-6 bg-black"></span>
               </div>


               <div className="flex flex-row gap-5 items-center">
                <School className="bg-primaryOwn p-2 rounded-full text-white w-10 h-10" />
                <div className="flex flex-col">
                  <p className="font-bold">Partnerschaft mit lokalen Schulen</p>
                  <p>2022</p>
                </div>
              </div>

             


            </div>
          </div>







        </div>
        <div className="w-full flex flex-col items-center justify-center  gap-10  bg-otherbg pt-20 pb-20 ">
          <p className="text-center text-4xl lg:text-4xl pb-2 xl:text-5xl font-bold">
            Was uns antreibt
          </p>
          <p className=" text-center  1:w-70 text-lg sm:w-100 md:w-140 pb-2 lg:text-2xl  xl:text-2xl lg:w-200 text-muted-foreground ">
            Unsere Mission ist es, digitale Bildung zugänglich und unterhaltsam
            zu machen und Kreativität, kritisches Denken und Zusammenarbeit für
            jedes Kind in unserer Gemeinschaft zu fördern.
          </p>
          <div className="flex  flex-col 1:w-70 md:flex-row lg:m-0 gap-10 justify-between  ">
            {values.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="flex flex-col sm: md: lg: xl: transition-all duration-300  shadow-primaryOwn hover:-translate-y-3 hover:shadow-lg items-center p-5 border bg-white border-primaryOwn rounded-3xl text-center md:text-left gap-4"
              >
                <Icon className="w-8 h-8 text-secondaryOwn" />
                <div>
                  <h3 className="text-xl sm: md: lg:  text-center font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm  sm: md: lg:w-60 xl:w-80 text-center text-muted-foreground mt-1 ">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
            <MentorenView />
        </div>



      </div>
    </>
  );
}
