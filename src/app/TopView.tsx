"use client";
import type { UserData } from "@/BackEnd/type";
import { Button } from "@/components/ui/button";
import { GraduationCap, Rocket, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TopView({ data }: { data: UserData | undefined }) {
  const router = useRouter();

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
      <div className="w-full px-8 pt-10">
        <p className="text-4xl font-extrabold w-[75%]">
          Die digitale Zukunft deines Kindes beginnt hier.
        </p>
        <p className="text-md pt-4 text-graytext w-[90%]">
          Wir bieten unterhaltsame und lehrreiche Programmierkurse, um Kinder
          mit den Fähigkeiten für eine bessere Zukunft auszustatten.
        </p>

        <div className="flex pt-8 flex-col   md:flex-row gap-2">
          <Button className="bg-fourthOwn min-w-90 hover:border-fourthOwn w-[25%] hover:border h-10 hover:bg-white hover:text-fourthOwn">
            <p>Kurse entdecken</p>
          </Button>
          {data == undefined && (
            <Button
              onClick={() => router.push("/login")}
              className="bg-secondaryOwn min-w-90 hover:border-secondaryOwn w-[25%] h-10 hover:border hover:bg-white hover:text-secondaryOwn"
            >
              <p>Jetzt registrieren</p>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mx-auto pt-20">
          {texts.map(({ text, des, icon: Icon }) => (
            <div
              key={text}
              className="flex border-1 p-8 max-w-120 mx-auto shadow-md rounded-2xl duration-400 transition-all  hover:-translate-y-5 flex-col items-start gap-2"
            >
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }} // Ausgangsanimation
                  transition={{ duration: 1 }}
                  viewport={{ once: false }} // erlaubt mehrfaches Ein-/Ausblenden
                >
                  <div className="flex flex-row justify-between">
                    <p className="font-semibold">{text}</p>
                    <Icon className="w-7 mb-2 h-7 text-fourthOwn" />
                  </div>

                  <p className="text-sm text-gray-600">{des}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
