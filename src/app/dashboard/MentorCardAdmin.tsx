"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Check, Edit2, X, Instagram, Github, Linkedin } from "lucide-react";
import { updateMentor } from "@/lib/db";
import type { Mentor } from "@/BackEnd/type";

export default function MentorCardAdmin({
  uid,
  name,
  description,
  picture,
  role,
  insta,
  github,
  linkedin,
}: {
  uid: string;
  name: string;
  description: string;
  picture: string;
  role?: string;
  insta?: string;
  github?: string;
  linkedin?: string;
}) {
  const [updateView, setUpdateView] = useState<boolean>(false);
  const [updates, setUpdates] = useState<Partial<Mentor>>({
    name: name,
    des: description,
    role: role,
    insta: insta,
    github: github,
    linkedin: linkedin,
  });
  const { theme, isRounded } = useTheme();

  const isDark = theme === "dark";
  const radiusClass = isRounded ? "rounded-[12px]" : "rounded-none";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 border transition-colors duration-200 flex flex-col h-full ${radiusClass} ${
        isDark
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      {updateView ? (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col w-full space-y-4 font-['JetBrains_Mono']"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-[10px] tracking-wider uppercase mb-1.5 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                NAME
              </label>
              <input
                value={updates.name || ""}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full px-3 py-2 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
              />
            </div>
            <div>
              <label
                className={`block text-[10px] tracking-wider uppercase mb-1.5 ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                ROLLE / POSITION
              </label>
              <input
                value={updates.role || ""}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, role: e.target.value }))
                }
                className={`w-full px-3 py-2 text-xs uppercase tracking-wide border focus:outline-none focus:border-green-600 transition-colors ${radiusClass} ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-[10px] tracking-wider mb-1.5 ${
                isDark ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              BESCHREIBUNG (KURZ)
            </label>
            <textarea
              rows={3}
              value={updates.des || ""}
              onChange={(e) =>
                setUpdates((prev) => ({ ...prev, des: e.target.value }))
              }
              className={`w-full px-3 py-2 text-xs tracking-wide border focus:outline-none focus:border-green-600 resize-none transition-colors ${radiusClass} ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={`block text-[9px] tracking-wider uppercase mb-1 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                INSTAGRAM
              </label>
              <input
                value={updates.insta || ""}
                placeholder="LINK"
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, insta: e.target.value }))
                }
                className={`w-full px-2 py-1.5 text-xs border focus:outline-none focus:border-green-600 ${radiusClass} ${
                  isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className={`block text-[9px] tracking-wider uppercase mb-1 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                GITHUB
              </label>
              <input
                value={updates.github || ""}
                placeholder="LINK"
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, github: e.target.value }))
                }
                className={`w-full px-2 py-1.5 text-xs border focus:outline-none focus:border-green-600 ${radiusClass} ${
                  isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className={`block text-[9px] tracking-wider uppercase mb-1 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                LINKEDIN
              </label>
              <input
                value={updates.linkedin || ""}
                placeholder="LINK"
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, linkedin: e.target.value }))
                }
                className={`w-full px-2 py-1.5 text-xs border focus:outline-none focus:border-green-600 ${radiusClass} ${
                  isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar className={`w-20 h-20 shrink-0 sticky top-0 border ${isDark ? "border-zinc-800" : "border-slate-200"} ${radiusClass}`}>
            <AvatarImage src={picture} className="object-cover w-full h-full" />
            <AvatarFallback className={`font-['JetBrains_Mono'] text-sm font-bold bg-zinc-100 dark:bg-zinc-900 ${radiusClass}`}>
              {name?.slice(0, 1)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <h3 className={`text-xl font-black font-['Familjen_Grotesk'] tracking-tight uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
                {name}
              </h3>
              {role && (
                <span className={`font-['JetBrains_Mono'] text-[10px] font-bold mt-1 mb-2 uppercase tracking-widest ${isDark ? "text-green-400" : "text-green-600"}`}>
                  {role}
                </span>
              )}
            </div>

            <p className={`text-xxs font-gro pb-4 leading-relaxed tracking-wide ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              {description}
            </p>

            {(insta || github || linkedin) && (
              <div className="flex items-center gap-3 mt-2 mb-4">
                {insta && (
                  <a
                    href={insta}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition-colors ${isDark ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
                  >
                    <Instagram className="w-4 h-4 stroke-[1.75]" />
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition-colors ${isDark ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
                  >
                    <Github className="w-4 h-4 stroke-[1.75]" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition-colors ${isDark ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
                  >
                    <Linkedin className="w-4 h-4 stroke-[1.75]" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-6 pb-4 mt-auto border-t border-zinc-100 dark:border-zinc-900/60 items-center">
        {updateView ? (
          <>
            <button
              onClick={() => {
                updateMentor(uid, updates);
                setUpdateView(false);
              }}
              className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase text-white transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} bg-green-600 hover:bg-green-700`}
            >
              <Check className="w-3.5 h-3.5" />
              SPEICHERN
            </button>
            <button
              onClick={() => setUpdateView(false)}
              className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border ${radiusClass} ${
                isDark
                  ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <X className="w-3.5 h-3.5" />
              ABBRECHEN
            </button>
          </>
        ) : (
          <button
            onClick={() => setUpdateView(true)}
            className={`flex-1 px-4 py-2.5 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 border border-transparent ${radiusClass} ${
              isDark
                ? "bg-purple-950/40 text-purple-400 border-purple-900/40 hover:bg-purple-900/30"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            BEARBEITEN
          </button>
        )}
      </div>
    </motion.div>
  );
}
