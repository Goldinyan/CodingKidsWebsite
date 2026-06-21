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

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`backdrop-blur-2xl p-6 border transition-all duration-300 flex flex-col ${isRounded ? "rounded-xl" : "rounded-none"
        } ${theme === "dark"
          ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
          : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100"
        }`}
    >
      {updateView ? (
        <motion.div
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col w-full space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
              >
                Name
              </label>
              <input
                value={updates.name || ""}
                className={`w-full px-3 py-1.5 border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"
                  } ${theme === "dark"
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
              >
                Rolle / Position
              </label>
              <input
                value={updates.role || ""}
                className={`w-full px-3 py-1.5 border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${isRounded ? "rounded-xl" : "rounded-none"
                  } ${theme === "dark"
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, role: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-xs font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}
            >
              Beschreibung (kurz)
            </label>
            <textarea
              className={`w-full px-3 py-1.5 border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors ${isRounded ? "rounded-xl" : "rounded-none"
                } ${theme === "dark"
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              rows={2}
              value={updates.des || ""}
              onChange={(e) =>
                setUpdates((prev) => ({ ...prev, des1: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-400 mb-0.5">
                Instagram
              </label>
              <input
                value={updates.insta || ""}
                placeholder="Link"
                className={`w-full px-2 py-1 border text-xs focus:outline-none ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white border-slate-300"
                  }`}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, insta: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-400 mb-0.5">
                GitHub
              </label>
              <input
                value={updates.github || ""}
                placeholder="Link"
                className={`w-full px-2 py-1 border text-xs focus:outline-none ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white border-slate-300"
                  }`}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, github: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-400 mb-0.5">
                LinkedIn
              </label>
              <input
                value={updates.linkedin || ""}
                placeholder="Link"
                className={`w-full px-2 py-1 border text-xs focus:outline-none ${isRounded ? "rounded-xl" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white border-slate-300"
                  }`}
                onChange={(e) =>
                  setUpdates((prev) => ({ ...prev, linkedin: e.target.value }))
                }
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-row items-start gap-5">
          <Avatar
            className={`w-20 h-20 shrink-0 sticky top-0 ${isRounded ? "rounded-full" : "rounded-none"}`}
          >
            <AvatarImage src={picture} className="object-cover w-full h-full" />
            <AvatarFallback
              className={isRounded ? "rounded-full" : "rounded-none"}
            >
              {name?.slice(0, 1)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <h3
                className={`text-lg font-bold leading-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                {name}
              </h3>
              {role && (
                <span
                  className={`text-xs mt-2 font-medium mb-2 uppercase tracking-wider ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                >
                  {role}
                </span>
              )}
            </div>

            <p
              className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-slate-600"}`}
            >
              {description}
            </p>

            {(insta || github || linkedin) && (
              <div className="flex items-center gap-3 mt-4">
                {insta && (
                  <a
                    href={insta}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-6 mt-auto">
        {updateView ? (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                updateMentor(uid, updates);
                setUpdateView(false);
              }}
              className={`flex-1 px-4 py-2 text-sm font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"
                } bg-green-600 text-white border-green-600 hover:bg-green-700`}
            >
              <Check className="w-4 h-4" />
              Speichern
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 px-4 py-2 text-sm font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"
                } ${theme === "dark"
                  ? "border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                  : "border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-slate-400"
                }`}
              onClick={() => setUpdateView(false)}
            >
              <X className="w-4 h-4" />
              Abbrechen
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUpdateView(true)}
            className={`flex-1 px-4 py-2 text-sm font-medium border transition-colors duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-xl" : "rounded-none"
              } ${theme === "dark"
                ? "bg-purple-600/20 text-purple-300 border-purple-600/30 hover:bg-purple-600/30 hover:border-purple-600/50"
                : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
              }`}
          >
            <Edit2 className="w-4 h-4" />
            Bearbeiten
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
