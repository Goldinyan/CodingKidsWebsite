"use client";
import type { UserData } from "@/BackEnd/type";
import { Button } from "@/components/ui/button";
import { GraduationCap, Rocket, Users } from "lucide-react";

export default function TopView({ data }: { data: UserData | undefined }) {
  const texts: { text: string; des: string; icon: React.ElementType }[] = [
    {
      text: "Für alle Altersgruppen",
      des: "Vom Einstieg mit blockbasierter Programmierung bis hin zu fortgeschrittenen textbasierten Sprachen wie JavaScript.",
      icon: GraduationCap,
    },
    {
      text: "Erfahrene Mentoren",
      des: "Lerne von leidenschaftlichen Informatiklern mit Praxiserfahrung in Technologie und Informatik.",
      icon: Users,
    },
    {
      text: "Zukunftsorientiert",
      des: "Wir vermitteln nicht nur Code, sondern auch Problemlösungskonzepte und kreatives Denken für die Welt von morgen.",
      icon: Rocket,
    },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="w-full px-8 pt-2">
        <p className="text-4xl font-extrabold w-[75%]">
          Die digitale Zukunft deines Kindes beginnt hier.
        </p>
        <p className="text-md pt-4 text-graytext w-[90%]">
          Wir bieten unterhaltsame und lehrreiche Programmierkurse, um Kinder
          mit den Fähigkeiten für eine bessere Zukunft auszustatten.
        </p>

        <div className="flex pt-8 flex-col gap-2">
          <Button className="bg-fourthOwn hover:border-fourthOwn hover:border h-10 hover:bg-white hover:text-fourthOwn">
            <p>Kurse entdecken</p>
          </Button>
          {data == undefined && (
            <Button className="bg-secondaryOwn hover:border-secondaryOwn h-10 hover:border hover:bg-white hover:text-secondaryOwn">
              <p>Jetzt registrieren</p>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-10  pt-20">
          {texts.map(({ text, des, icon: Icon }) => (
            <div key={text} className="flex hover:shadow-md p-3 rounded-2xl duration-400 transition-all  hover:-translate-y-5 flex-col items-start gap-2">
              <Icon className="w-7 h-7 text-fourthOwn" />
              <p className="font-semibold">{text}</p>
              <p className="text-sm text-gray-600">{des}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
