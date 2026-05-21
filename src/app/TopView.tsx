"use client";
import type { UserData } from "@/BackEnd/type";
import { GraduationCap, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TopView({ data }: { data: UserData | undefined }) {
  const router = useRouter();

  const features: { text: string; des: string; icon: React.ElementType }[] = [
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-30" />

      <div className="relative w-full px-8 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
            Die digitale Zukunft ihres Kindes beginnt hier.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-light">
            Wir bieten unterhaltsame und lehrreiche Programmierkurse, um Kinder
            mit den Fähigkeiten für eine bessere Zukunft auszustatten.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button className="px-8 py-3 bg-white text-black font-medium border border-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-100">
            Kurse entdecken
          </button>
          {data === undefined && (
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3 bg-transparent text-white font-medium border border-gray-400 hover:border-white hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 active:scale-100"
            >
              Jetzt registrieren
            </button>
          )}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(({ text, des, icon: Icon }) => (
            <motion.div
              key={text}
              variants={itemVariants}
              className="group p-6 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:bg-white/8"
            >
              <div className="flex items-start gap-4 mb-4">
                <Icon className="w-6 h-6 text-gray-300 flex-shrink-0 mt-1 group-hover:text-white transition-colors" />
                <h3 className="text-lg font-semibold text-white leading-tight">
                  {text}
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {des}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
