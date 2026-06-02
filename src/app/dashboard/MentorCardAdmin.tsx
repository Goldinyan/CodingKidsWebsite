import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Check, Edit2, X } from "lucide-react";
import { updateMentor } from "@/lib/db";
import type { Mentor } from "@/BackEnd/type";

export default function MentorCardAdmin({
        uid,
        name,
        description1,
        description2,
        picture,
}: {
        uid: string;
        name: string;
        description1: string;
        description2: string;
        picture: string;
}) {
        const [showDes2, setShowDes2] = useState<boolean>(false);
        const [updateView, setUpdateView] = useState<boolean>(false);
        const [updates, setUpdates] = useState<Partial<Mentor>>({
                name: name,
                des1: description1,
                des2: description2,
        });
        const { theme } = useTheme();

        return (
                <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`p-6 border transition-all duration-300 flex flex-col ${theme === "dark"
                                ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                                : "bg-slate-50 border-slate-300 hover:border-slate-400 hover:bg-slate-100"
                        }`}
                >
                        <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-24 h-24">
                                        <AvatarImage src={picture} className="object-cover rounded-full" />
                                        <AvatarFallback>{name?.slice(0, 1)?.toUpperCase()}</AvatarFallback>
                                </Avatar>

                                        {updateView ? (
                                                <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex flex-col w-full space-y-3"
                                                >
                                                                <div>
                                                                        <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                                                                Name
                                                                        </label>
                                                                        <input
                                                                                value={updates.name || ""}
                                                                                className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${theme === "dark"
                                                                                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                                                                                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                                                                                }`}
                                                                                onChange={(e) =>
                                                                                        setUpdates((prev) => ({
                                                                                                ...prev,
                                                                                                name: e.target.value,
                                                                                        }))
                                                                                }
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                                                                Beschreibung (kurz)
                                                                        </label>
                                                                        <textarea
                                                                                className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors ${theme === "dark"
                                                                                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                                                                                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                                                                                }`}
                                                                                rows={3}
                                                                                value={updates.des1 || ""}
                                                                                onChange={(e) =>
                                                                                        setUpdates((prev) => ({
                                                                                                ...prev,
                                                                                                des1: e.target.value,
                                                                                        }))
                                                                                }
                                                                        />
                                                                </div>

                                                                <div>
                                                                        <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}>
                                                                                Beschreibung (lang)
                                                                        </label>
                                                                        <textarea
                                                                                value={updates.des2 || ""}
                                                                                rows={5}
                                                                                className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-colors ${theme === "dark"
                                                                                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                                                                                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                                                                                }`}
                                                                                onChange={(e) =>
                                                                                        setUpdates((prev) => ({
                                                                                                ...prev,
                                                                                                des2: e.target.value,
                                                                                        }))
                                                                                }
                                                                        />
                                                                </div>
                                                        </motion.div>
                                        ) : (
                                                <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex flex-col items-center text-center"
                                                >
                                                <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{name}</h3>
                                                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>{description1}</p>
                                                {showDes2 && (
                                                        <motion.p
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                                className={`pt-6 text-sm whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-slate-700"}`}
                                                        >
                                                                {description2}
                                                        </motion.p>
                                                )}
                                        </motion.div>
                                )}
                        </div>

                        <div className="flex gap-2 pt-6 mt-auto">
                                <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowDes2((prev) => !prev)}
                                        className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 ${theme === "dark"
                                                ? "border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                                                : "border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-slate-400"
                                        }`}
                                >
                                        {showDes2 ? "Weniger anzeigen" : "Mehr anzeigen"}
                                </motion.button>

                                {updateView ? (
                                        <>
                                                <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => (updateMentor(uid, updates), setUpdateView(false))}
                                                        className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                                                                ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                                                                : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                                                        }`}
                                                >
                                                        <Check className="w-4 h-4" />
                                                        Speichern
                                                </motion.button>
                                                <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
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
                                                className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${theme === "dark"
                                                        ? "bg-amber-600/20 text-amber-300 border-amber-600/30 hover:bg-amber-600/30 hover:border-amber-600/50"
                                                        : "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
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
